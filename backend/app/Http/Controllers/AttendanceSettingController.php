<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Validator;

class AttendanceSettingController extends Controller
{
    /**
     * Show attendance settings page
     */
    public function index(): View
    {
        $this->authorize('manage settings');

        $settings = [
            // GPS Settings
            'gps_attendance_enabled' => Setting::getValue('gps_attendance_enabled', false),
            'attendance_latitude' => Setting::getValue('attendance_latitude', ''),
            'attendance_longitude' => Setting::getValue('attendance_longitude', ''),
            'attendance_radius' => Setting::getValue('attendance_radius', 100),
            
            // Working Hours Settings
            'standard_working_hours' => Setting::getValue('standard_working_hours', 8),
            'overtime_threshold' => Setting::getValue('overtime_threshold', 8),
            'break_duration_minutes' => Setting::getValue('break_duration_minutes', 60),
            
            // Attendance Rules
            'allow_early_checkin_minutes' => Setting::getValue('allow_early_checkin_minutes', 30),
            'late_threshold_minutes' => Setting::getValue('late_threshold_minutes', 15),
            'auto_checkout_enabled' => Setting::getValue('auto_checkout_enabled', false),
            'auto_checkout_time' => Setting::getValue('auto_checkout_time', '18:00'),
            
            // Face Recognition Settings
            'face_recognition_enabled' => Setting::getValue('face_recognition_enabled', true),
            'gesture_verification_required' => Setting::getValue('gesture_verification_required', true),
            'face_confidence_threshold' => Setting::getValue('face_confidence_threshold', 0.6),
            
            // Notification Settings
            'notify_late_attendance' => Setting::getValue('notify_late_attendance', true),
            'notify_missing_checkout' => Setting::getValue('notify_missing_checkout', true),
            'attendance_reminder_time' => Setting::getValue('attendance_reminder_time', '08:30'),
        ];

        return view('settings.attendance', compact('settings'));
    }

    /**
     * Update attendance settings
     */
    public function update(Request $request): JsonResponse
    {
        $this->authorize('manage settings');

        $validator = Validator::make($request->all(), [
            // GPS Settings
            'gps_attendance_enabled' => 'boolean',
            'attendance_latitude' => 'nullable|numeric|between:-90,90',
            'attendance_longitude' => 'nullable|numeric|between:-180,180',
            'attendance_radius' => 'nullable|integer|min:10|max:1000',
            
            // Working Hours Settings
            'standard_working_hours' => 'nullable|integer|min:1|max:24',
            'overtime_threshold' => 'nullable|integer|min:1|max:24',
            'break_duration_minutes' => 'nullable|integer|min:0|max:480',
            
            // Attendance Rules
            'allow_early_checkin_minutes' => 'nullable|integer|min:0|max:120',
            'late_threshold_minutes' => 'nullable|integer|min:0|max:60',
            'auto_checkout_enabled' => 'boolean',
            'auto_checkout_time' => 'nullable|date_format:H:i',
            
            // Face Recognition Settings
            'face_recognition_enabled' => 'boolean',
            'gesture_verification_required' => 'boolean',
            'face_confidence_threshold' => 'nullable|numeric|between:0.1,1.0',
            
            // Notification Settings
            'notify_late_attendance' => 'boolean',
            'notify_missing_checkout' => 'boolean',
            'attendance_reminder_time' => 'nullable|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // GPS Settings validation
            if ($request->boolean('gps_attendance_enabled')) {
                if (empty($request->attendance_latitude) || empty($request->attendance_longitude)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'GPS coordinates are required when GPS attendance is enabled'
                    ], 422);
                }
            }

            // Update all settings
            $settingsToUpdate = [
                // GPS Settings
                'gps_attendance_enabled' => $request->boolean('gps_attendance_enabled'),
                'attendance_latitude' => $request->attendance_latitude ?? '',
                'attendance_longitude' => $request->attendance_longitude ?? '',
                'attendance_radius' => $request->attendance_radius ?? 100,
                
                // Working Hours Settings
                'standard_working_hours' => $request->standard_working_hours ?? 8,
                'overtime_threshold' => $request->overtime_threshold ?? 8,
                'break_duration_minutes' => $request->break_duration_minutes ?? 60,
                
                // Attendance Rules
                'allow_early_checkin_minutes' => $request->allow_early_checkin_minutes ?? 30,
                'late_threshold_minutes' => $request->late_threshold_minutes ?? 15,
                'auto_checkout_enabled' => $request->boolean('auto_checkout_enabled'),
                'auto_checkout_time' => $request->auto_checkout_time ?? '18:00',
                
                // Face Recognition Settings
                'face_recognition_enabled' => $request->boolean('face_recognition_enabled'),
                'gesture_verification_required' => $request->boolean('gesture_verification_required'),
                'face_confidence_threshold' => $request->face_confidence_threshold ?? 0.6,
                
                // Notification Settings
                'notify_late_attendance' => $request->boolean('notify_late_attendance'),
                'notify_missing_checkout' => $request->boolean('notify_missing_checkout'),
                'attendance_reminder_time' => $request->attendance_reminder_time ?? '08:30',
            ];

            foreach ($settingsToUpdate as $key => $value) {
                Setting::setValue($key, $value);
            }

            return response()->json([
                'success' => true,
                'message' => 'Attendance settings updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test GPS coordinates
     */
    public function testGpsCoordinates(Request $request): JsonResponse
    {
        $this->authorize('manage settings');

        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'test_latitude' => 'required|numeric|between:-90,90',
            'test_longitude' => 'required|numeric|between:-180,180',
            'radius' => 'required|integer|min:10|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid coordinates provided',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $schoolLat = $request->latitude;
            $schoolLon = $request->longitude;
            $testLat = $request->test_latitude;
            $testLon = $request->test_longitude;
            $radius = $request->radius;

            // Calculate distance using Haversine formula
            $distance = $this->calculateDistance($schoolLat, $schoolLon, $testLat, $testLon);
            $isWithinRadius = $distance <= $radius;

            return response()->json([
                'success' => true,
                'distance' => round($distance, 2),
                'radius' => $radius,
                'within_radius' => $isWithinRadius,
                'message' => $isWithinRadius 
                    ? "Test location is within the allowed radius ({$distance}m from center)"
                    : "Test location is outside the allowed radius ({$distance}m from center, allowed: {$radius}m)"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error calculating distance: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get current attendance location (for setting GPS coordinates)
     */
    public function getCurrentLocation(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid coordinates provided'
            ], 422);
        }

        try {
            // Use a geocoding service to get address (optional)
            $address = $this->reverseGeocode($request->latitude, $request->longitude);

            return response()->json([
                'success' => true,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'address' => $address,
                'timestamp' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error processing location: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export attendance settings
     */
    public function exportSettings(): JsonResponse
    {
        $this->authorize('manage settings');

        try {
            $settings = Setting::where('key', 'like', '%attendance%')
                ->orWhere('key', 'like', '%gps%')
                ->orWhere('key', 'like', '%face%')
                ->orWhere('key', 'like', '%working%')
                ->orWhere('key', 'like', '%overtime%')
                ->orWhere('key', 'like', '%break%')
                ->orWhere('key', 'like', '%notify%')
                ->get()
                ->pluck('value', 'key')
                ->toArray();

            return response()->json([
                'success' => true,
                'settings' => $settings,
                'exported_at' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error exporting settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Import attendance settings
     */
    public function importSettings(Request $request): JsonResponse
    {
        $this->authorize('manage settings');

        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid settings data provided'
            ], 422);
        }

        try {
            $imported = 0;
            foreach ($request->settings as $key => $value) {
                // Only import attendance-related settings for security
                if (str_contains($key, 'attendance') || 
                    str_contains($key, 'gps') || 
                    str_contains($key, 'face') || 
                    str_contains($key, 'working') || 
                    str_contains($key, 'overtime') || 
                    str_contains($key, 'break') || 
                    str_contains($key, 'notify')) {
                    
                    Setting::setValue($key, $value);
                    $imported++;
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Successfully imported {$imported} settings",
                'imported_count' => $imported
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error importing settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate distance between two GPS coordinates
     */
    private function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371000; // Earth's radius in meters

        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($lonDelta / 2) * sin($lonDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        
        return $earthRadius * $c;
    }

    /**
     * Simple reverse geocoding (optional - can be enhanced with Google Maps API)
     */
    private function reverseGeocode(float $lat, float $lon): string
    {
        // This is a simple implementation
        // You can integrate with Google Maps API or other geocoding services
        return "Location: {$lat}, {$lon}";
    }
}