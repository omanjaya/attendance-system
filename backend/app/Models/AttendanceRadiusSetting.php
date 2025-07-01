<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * AttendanceRadiusSetting Model
 * 
 * Represents geofencing settings for attendance check-in/out locations.
 * Defines allowed locations with radius restrictions for employee attendance.
 * 
 * @property int $id
 * @property string $location_name
 * @property float $latitude
 * @property float $longitude
 * @property int $radius_meters
 * @property string|null $description
 * @property bool $is_active
 * @property array|null $allowed_employee_types
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 */
class AttendanceRadiusSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'location_name',
        'latitude',
        'longitude',
        'radius_meters',
        'description',
        'is_active',
        'allowed_employee_types',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'is_active' => 'boolean',
            'allowed_employee_types' => 'array',
        ];
    }

    /**
     * Get the formatted coordinates.
     */
    protected function coordinates(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->latitude . ', ' . $this->longitude,
        );
    }

    /**
     * Get the radius in kilometers.
     */
    protected function radiusKilometers(): Attribute
    {
        return Attribute::make(
            get: fn () => round($this->radius_meters / 1000, 2),
        );
    }

    /**
     * Get the Google Maps URL for the location.
     */
    protected function googleMapsUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => "https://maps.google.com/maps?q={$this->latitude},{$this->longitude}",
        );
    }

    /**
     * Scope a query to only include active settings.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter by employee type.
     */
    public function scopeForEmployeeType(Builder $query, int $employeeTypeId): Builder
    {
        return $query->where(function ($q) use ($employeeTypeId) {
            $q->whereNull('allowed_employee_types')
                ->orWhereJsonContains('allowed_employee_types', $employeeTypeId);
        });
    }

    /**
     * Scope a query to filter by radius range.
     */
    public function scopeWithinRadiusRange(Builder $query, int $minRadius, int $maxRadius): Builder
    {
        return $query->whereBetween('radius_meters', [$minRadius, $maxRadius]);
    }

    /**
     * Check if this location setting allows a specific employee type.
     */
    public function allowsEmployeeType(int $employeeTypeId): bool
    {
        return empty($this->allowed_employee_types) || 
               in_array($employeeTypeId, $this->allowed_employee_types);
    }

    /**
     * Check if this location setting allows an employee.
     */
    public function allowsEmployee(Employee $employee): bool
    {
        return $this->allowsEmployeeType($employee->employee_type_id);
    }

    /**
     * Calculate distance from a given coordinate.
     */
    public function calculateDistanceFrom(float $latitude, float $longitude): float
    {
        // Haversine formula to calculate distance between two points
        $earthRadius = 6371000; // meters

        $lat1 = deg2rad($this->latitude);
        $lon1 = deg2rad($this->longitude);
        $lat2 = deg2rad($latitude);
        $lon2 = deg2rad($longitude);

        $deltaLat = $lat2 - $lat1;
        $deltaLon = $lon2 - $lon1;

        $a = sin($deltaLat / 2) * sin($deltaLat / 2) +
             cos($lat1) * cos($lat2) *
             sin($deltaLon / 2) * sin($deltaLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Check if a coordinate is within the allowed radius.
     */
    public function isWithinRadius(float $latitude, float $longitude): bool
    {
        $distance = $this->calculateDistanceFrom($latitude, $longitude);
        return $distance <= $this->radius_meters;
    }

    /**
     * Add an allowed employee type.
     */
    public function addAllowedEmployeeType(int $employeeTypeId): bool
    {
        $allowedTypes = $this->allowed_employee_types ?? [];
        
        if (!in_array($employeeTypeId, $allowedTypes)) {
            $allowedTypes[] = $employeeTypeId;
            return $this->update(['allowed_employee_types' => $allowedTypes]);
        }
        
        return true;
    }

    /**
     * Remove an allowed employee type.
     */
    public function removeAllowedEmployeeType(int $employeeTypeId): bool
    {
        $allowedTypes = collect($this->allowed_employee_types ?? [])
            ->reject(fn ($id) => $id === $employeeTypeId)
            ->values()
            ->toArray();
        
        return $this->update(['allowed_employee_types' => $allowedTypes]);
    }

    /**
     * Activate the location setting.
     */
    public function activate(): bool
    {
        return $this->update(['is_active' => true]);
    }

    /**
     * Deactivate the location setting.
     */
    public function deactivate(): bool
    {
        return $this->update(['is_active' => false]);
    }

    /**
     * Get the employee types that are allowed for this location.
     */
    public function getAllowedEmployeeTypes(): \Illuminate\Database\Eloquent\Collection
    {
        if (empty($this->allowed_employee_types)) {
            return EmployeeType::all();
        }

        return EmployeeType::whereIn('id', $this->allowed_employee_types)->get();
    }

    /**
     * Check if an employee can check in at a specific location.
     */
    public static function canEmployeeCheckInAt(Employee $employee, float $latitude, float $longitude): bool
    {
        $settings = static::active()
            ->forEmployeeType($employee->employee_type_id)
            ->get();

        foreach ($settings as $setting) {
            if ($setting->isWithinRadius($latitude, $longitude)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get the closest location setting for given coordinates.
     */
    public static function getClosestLocation(float $latitude, float $longitude, ?int $employeeTypeId = null): ?static
    {
        $query = static::active();
        
        if ($employeeTypeId) {
            $query->forEmployeeType($employeeTypeId);
        }
        
        $settings = $query->get();
        
        if ($settings->isEmpty()) {
            return null;
        }

        $closestSetting = null;
        $shortestDistance = PHP_FLOAT_MAX;

        foreach ($settings as $setting) {
            $distance = $setting->calculateDistanceFrom($latitude, $longitude);
            if ($distance < $shortestDistance) {
                $shortestDistance = $distance;
                $closestSetting = $setting;
            }
        }

        return $closestSetting;
    }

    /**
     * Get all locations within a certain radius of given coordinates.
     */
    public static function getLocationsWithinRadius(
        float $latitude,
        float $longitude,
        int $radiusMeters,
        ?int $employeeTypeId = null
    ): \Illuminate\Database\Eloquent\Collection {
        $query = static::active();
        
        if ($employeeTypeId) {
            $query->forEmployeeType($employeeTypeId);
        }
        
        $settings = $query->get();
        
        return $settings->filter(function ($setting) use ($latitude, $longitude, $radiusMeters) {
            $distance = $setting->calculateDistanceFrom($latitude, $longitude);
            return $distance <= $radiusMeters;
        });
    }

    /**
     * Validate attendance location for an employee.
     */
    public static function validateAttendanceLocation(Employee $employee, float $latitude, float $longitude): array
    {
        $allowedSettings = static::active()
            ->forEmployeeType($employee->employee_type_id)
            ->get();

        if ($allowedSettings->isEmpty()) {
            return [
                'allowed' => false,
                'reason' => 'No attendance locations configured for your employee type.',
                'closest_location' => null,
                'distance' => null,
            ];
        }

        $closestSetting = null;
        $shortestDistance = PHP_FLOAT_MAX;
        $withinRadius = false;

        foreach ($allowedSettings as $setting) {
            $distance = $setting->calculateDistanceFrom($latitude, $longitude);
            
            if ($distance < $shortestDistance) {
                $shortestDistance = $distance;
                $closestSetting = $setting;
            }

            if ($distance <= $setting->radius_meters) {
                $withinRadius = true;
            }
        }

        if ($withinRadius) {
            return [
                'allowed' => true,
                'reason' => 'Location is within allowed attendance area.',
                'closest_location' => $closestSetting,
                'distance' => $shortestDistance,
            ];
        }

        return [
            'allowed' => false,
            'reason' => "You are {$shortestDistance}m away from the nearest allowed location ({$closestSetting->location_name}). Maximum allowed distance is {$closestSetting->radius_meters}m.",
            'closest_location' => $closestSetting,
            'distance' => $shortestDistance,
        ];
    }

    /**
     * Create a new location setting.
     */
    public static function createLocation(
        string $locationName,
        float $latitude,
        float $longitude,
        int $radiusMeters = 100,
        ?string $description = null,
        ?array $allowedEmployeeTypes = null
    ): static {
        return static::create([
            'location_name' => $locationName,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'radius_meters' => $radiusMeters,
            'description' => $description,
            'is_active' => true,
            'allowed_employee_types' => $allowedEmployeeTypes,
        ]);
    }

    /**
     * Get the location description with distance info.
     */
    public function getLocationInfo(): string
    {
        $info = $this->location_name;
        
        if ($this->description) {
            $info .= ' - ' . $this->description;
        }
        
        $info .= " (Radius: {$this->radius_meters}m)";
        
        return $info;
    }
}