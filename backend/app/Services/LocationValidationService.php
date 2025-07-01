<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\AttendanceRadiusSetting;
use Illuminate\Support\Collection;

/**
 * Location Validation Service
 * 
 * Handles GPS coordinate validation, radius checking using Haversine formula,
 * and employee type restrictions for attendance locations.
 */
class LocationValidationService
{
    /**
     * Earth radius in meters (used for Haversine formula)
     */
    protected const EARTH_RADIUS_METERS = 6371000;

    /**
     * Default maximum allowed distance if no settings found (meters)
     */
    protected const DEFAULT_MAX_DISTANCE = 100;

    /**
     * Validate if an employee can check in/out from a specific location
     *
     * @param Employee $employee
     * @param float $latitude
     * @param float $longitude
     * @return array
     */
    public function validateLocation(Employee $employee, float $latitude, float $longitude): array
    {
        // Validate coordinates are within valid ranges
        if (!$this->isValidCoordinate($latitude, $longitude)) {
            return [
                'valid' => false,
                'message' => 'Invalid GPS coordinates provided',
                'location' => null,
                'distance' => null,
            ];
        }

        // Get allowed locations for this employee type
        $allowedLocations = $this->getAllowedLocations($employee);

        if ($allowedLocations->isEmpty()) {
            return [
                'valid' => false,
                'message' => 'No attendance locations configured for your employee type',
                'location' => null,
                'distance' => null,
            ];
        }

        // Find the closest location and check if within radius
        $validation = $this->findClosestValidLocation($latitude, $longitude, $allowedLocations);

        if ($validation['valid']) {
            return [
                'valid' => true,
                'message' => "Within allowed radius of {$validation['location']->location_name}",
                'location' => $validation['location'],
                'distance' => $validation['distance'],
            ];
        }

        return [
            'valid' => false,
            'message' => $this->generateDistanceMessage($validation),
            'location' => $validation['closest_location'],
            'distance' => $validation['closest_distance'],
        ];
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     *
     * @param float $lat1
     * @param float $lon1
     * @param float $lat2
     * @param float $lon2
     * @return float Distance in meters
     */
    public function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        // Convert degrees to radians
        $lat1Rad = deg2rad($lat1);
        $lon1Rad = deg2rad($lon1);
        $lat2Rad = deg2rad($lat2);
        $lon2Rad = deg2rad($lon2);

        // Calculate differences
        $deltaLat = $lat2Rad - $lat1Rad;
        $deltaLon = $lon2Rad - $lon1Rad;

        // Haversine formula
        $a = sin($deltaLat / 2) * sin($deltaLat / 2) +
             cos($lat1Rad) * cos($lat2Rad) *
             sin($deltaLon / 2) * sin($deltaLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return self::EARTH_RADIUS_METERS * $c;
    }

    /**
     * Get all locations within a specific radius
     *
     * @param float $latitude
     * @param float $longitude
     * @param int $radiusMeters
     * @param Employee|null $employee
     * @return Collection
     */
    public function getLocationsWithinRadius(
        float $latitude,
        float $longitude,
        int $radiusMeters,
        ?Employee $employee = null
    ): Collection {
        $query = AttendanceRadiusSetting::active();

        if ($employee) {
            $locations = $query->get()->filter(function ($location) use ($employee) {
                return $location->allowsEmployee($employee);
            });
        } else {
            $locations = $query->get();
        }

        return $locations->filter(function ($location) use ($latitude, $longitude, $radiusMeters) {
            $distance = $this->calculateDistance($latitude, $longitude, $location->latitude, $location->longitude);
            return $distance <= $radiusMeters;
        })->map(function ($location) use ($latitude, $longitude) {
            $location->distance = $this->calculateDistance($latitude, $longitude, $location->latitude, $location->longitude);
            return $location;
        })->sortBy('distance');
    }

    /**
     * Check if employee can use location-based attendance
     *
     * @param Employee $employee
     * @return bool
     */
    public function canUseLocationBasedAttendance(Employee $employee): bool
    {
        // Check if there are any active location settings for this employee type
        return AttendanceRadiusSetting::active()
            ->forEmployeeType($employee->employee_type_id)
            ->exists();
    }

    /**
     * Get attendance boundary information for an employee
     *
     * @param Employee $employee
     * @return array
     */
    public function getAttendanceBoundaries(Employee $employee): array
    {
        $locations = $this->getAllowedLocations($employee);

        if ($locations->isEmpty()) {
            return [
                'has_boundaries' => false,
                'locations' => [],
                'message' => 'No attendance boundaries configured for your employee type',
            ];
        }

        $boundaries = $locations->map(function ($location) {
            return [
                'id' => $location->id,
                'name' => $location->location_name,
                'latitude' => $location->latitude,
                'longitude' => $location->longitude,
                'radius' => $location->radius_meters,
                'description' => $location->description,
            ];
        })->toArray();

        return [
            'has_boundaries' => true,
            'locations' => $boundaries,
            'message' => 'Attendance allowed within specified boundaries',
        ];
    }

    /**
     * Validate coordinates for multiple locations
     *
     * @param float $latitude
     * @param float $longitude
     * @param array $locationIds
     * @return array
     */
    public function validateAgainstSpecificLocations(float $latitude, float $longitude, array $locationIds): array
    {
        $locations = AttendanceRadiusSetting::whereIn('id', $locationIds)
            ->where('is_active', true)
            ->get();

        $results = [];

        foreach ($locations as $location) {
            $distance = $this->calculateDistance($latitude, $longitude, $location->latitude, $location->longitude);
            $isWithinRadius = $distance <= $location->radius_meters;

            $results[] = [
                'location_id' => $location->id,
                'location_name' => $location->location_name,
                'distance' => round($distance, 2),
                'radius' => $location->radius_meters,
                'within_radius' => $isWithinRadius,
                'exceeded_by' => $isWithinRadius ? 0 : round($distance - $location->radius_meters, 2),
            ];
        }

        return $results;
    }

    /**
     * Get recommended check-in locations for an employee
     *
     * @param Employee $employee
     * @param float|null $currentLat
     * @param float|null $currentLon
     * @return Collection
     */
    public function getRecommendedLocations(Employee $employee, ?float $currentLat = null, ?float $currentLon = null): Collection
    {
        $locations = $this->getAllowedLocations($employee);

        if ($currentLat && $currentLon && $this->isValidCoordinate($currentLat, $currentLon)) {
            // Sort by distance from current location
            return $locations->map(function ($location) use ($currentLat, $currentLon) {
                $location->distance = $this->calculateDistance(
                    $currentLat,
                    $currentLon,
                    $location->latitude,
                    $location->longitude
                );
                return $location;
            })->sortBy('distance');
        }

        return $locations;
    }

    /**
     * Validate if coordinates are within valid ranges
     *
     * @param float $latitude
     * @param float $longitude
     * @return bool
     */
    protected function isValidCoordinate(float $latitude, float $longitude): bool
    {
        return $latitude >= -90 && $latitude <= 90 &&
               $longitude >= -180 && $longitude <= 180;
    }

    /**
     * Get allowed locations for an employee
     *
     * @param Employee $employee
     * @return Collection
     */
    protected function getAllowedLocations(Employee $employee): Collection
    {
        return AttendanceRadiusSetting::active()
            ->forEmployeeType($employee->employee_type_id)
            ->get();
    }

    /**
     * Find the closest valid location
     *
     * @param float $latitude
     * @param float $longitude
     * @param Collection $locations
     * @return array
     */
    protected function findClosestValidLocation(float $latitude, float $longitude, Collection $locations): array
    {
        $closestLocation = null;
        $closestDistance = PHP_FLOAT_MAX;
        $validLocation = null;
        $validDistance = null;

        foreach ($locations as $location) {
            $distance = $this->calculateDistance($latitude, $longitude, $location->latitude, $location->longitude);

            // Track closest location overall
            if ($distance < $closestDistance) {
                $closestDistance = $distance;
                $closestLocation = $location;
            }

            // Check if within allowed radius
            if ($distance <= $location->radius_meters && !$validLocation) {
                $validLocation = $location;
                $validDistance = $distance;
            }
        }

        return [
            'valid' => $validLocation !== null,
            'location' => $validLocation,
            'distance' => $validDistance,
            'closest_location' => $closestLocation,
            'closest_distance' => $closestDistance,
        ];
    }

    /**
     * Generate distance message for invalid location
     *
     * @param array $validation
     * @return string
     */
    protected function generateDistanceMessage(array $validation): string
    {
        $location = $validation['closest_location'];
        $distance = round($validation['closest_distance'], 0);
        $allowedRadius = $location->radius_meters;
        $excess = $distance - $allowedRadius;

        if ($distance < 1000) {
            $distanceStr = "{$distance}m";
            $excessStr = "{$excess}m";
        } else {
            $distanceStr = round($distance / 1000, 1) . "km";
            $excessStr = round($excess / 1000, 1) . "km";
        }

        return "You are {$distanceStr} away from {$location->location_name}. " .
               "Maximum allowed distance is {$allowedRadius}m. " .
               "Please move {$excessStr} closer to check in.";
    }

    /**
     * Calculate bearing between two coordinates
     *
     * @param float $lat1
     * @param float $lon1
     * @param float $lat2
     * @param float $lon2
     * @return float Bearing in degrees
     */
    public function calculateBearing(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $lat1Rad = deg2rad($lat1);
        $lat2Rad = deg2rad($lat2);
        $deltaLonRad = deg2rad($lon2 - $lon1);

        $x = sin($deltaLonRad) * cos($lat2Rad);
        $y = cos($lat1Rad) * sin($lat2Rad) - sin($lat1Rad) * cos($lat2Rad) * cos($deltaLonRad);

        $bearing = atan2($x, $y);
        $bearing = rad2deg($bearing);
        
        // Normalize to 0-360 degrees
        return ($bearing + 360) % 360;
    }

    /**
     * Get compass direction from bearing
     *
     * @param float $bearing
     * @return string
     */
    public function getCompassDirection(float $bearing): string
    {
        $directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        $index = round($bearing / 45) % 8;
        return $directions[$index];
    }

    /**
     * Get direction to nearest allowed location
     *
     * @param float $currentLat
     * @param float $currentLon
     * @param Employee $employee
     * @return array|null
     */
    public function getDirectionToNearestLocation(float $currentLat, float $currentLon, Employee $employee): ?array
    {
        $locations = $this->getAllowedLocations($employee);
        
        if ($locations->isEmpty()) {
            return null;
        }

        $nearest = null;
        $minDistance = PHP_FLOAT_MAX;

        foreach ($locations as $location) {
            $distance = $this->calculateDistance($currentLat, $currentLon, $location->latitude, $location->longitude);
            if ($distance < $minDistance) {
                $minDistance = $distance;
                $nearest = $location;
            }
        }

        if (!$nearest) {
            return null;
        }

        $bearing = $this->calculateBearing($currentLat, $currentLon, $nearest->latitude, $nearest->longitude);
        $direction = $this->getCompassDirection($bearing);

        return [
            'location' => $nearest,
            'distance' => round($minDistance, 0),
            'bearing' => round($bearing, 1),
            'direction' => $direction,
            'message' => "Head {$direction} for " . round($minDistance, 0) . "m to reach {$nearest->location_name}",
        ];
    }

    /**
     * Validate location history for fraud detection
     *
     * @param Employee $employee
     * @param float $latitude
     * @param float $longitude
     * @param int $timeWindowMinutes
     * @return array
     */
    public function validateLocationHistory(
        Employee $employee,
        float $latitude,
        float $longitude,
        int $timeWindowMinutes = 5
    ): array {
        // Get recent attendance records within time window
        $recentRecords = $employee->attendanceRecords()
            ->where('created_at', '>=', now()->subMinutes($timeWindowMinutes))
            ->whereNotNull('latitude_in')
            ->whereNotNull('longitude_in')
            ->latest()
            ->first();

        if (!$recentRecords) {
            return [
                'valid' => true,
                'message' => 'No recent location history to validate against',
            ];
        }

        // Calculate distance from last check-in
        $distance = $this->calculateDistance(
            $recentRecords->latitude_in,
            $recentRecords->longitude_in,
            $latitude,
            $longitude
        );

        // Calculate maximum possible distance (assuming 60 km/h travel speed)
        $maxPossibleDistance = ($timeWindowMinutes / 60) * 60000; // meters

        if ($distance > $maxPossibleDistance) {
            return [
                'valid' => false,
                'message' => 'Location change too rapid. Possible GPS spoofing detected.',
                'distance' => round($distance, 0),
                'max_possible' => round($maxPossibleDistance, 0),
            ];
        }

        return [
            'valid' => true,
            'message' => 'Location change is within acceptable range',
            'distance' => round($distance, 0),
        ];
    }
}