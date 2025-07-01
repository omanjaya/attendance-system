<?php

namespace App\Http\Middleware;

use App\Services\LocationValidationService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateLocationAccess
{
    protected LocationValidationService $locationService;

    public function __construct(LocationValidationService $locationService)
    {
        $this->locationService = $locationService;
    }

    /**
     * Handle an incoming request.
     * 
     * Validates location-based access for attendance operations.
     * Checks GPS coordinates against allowed attendance boundaries.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user || !$user->employee) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Employee profile required.'], 403);
            }
            return redirect()->route('dashboard');
        }

        // Skip validation if no location enforcement is configured
        if (!$this->locationService->canUseLocationBasedAttendance($user->employee)) {
            return $next($request);
        }

        // Get coordinates from request
        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');

        if (!$latitude || !$longitude) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'GPS coordinates required for attendance operations.',
                    'code' => 'LOCATION_REQUIRED'
                ], 422);
            }
            
            return back()->withErrors([
                'location' => 'GPS coordinates required for attendance operations.'
            ]);
        }

        // Validate location
        $validation = $this->locationService->validateLocation(
            $user->employee,
            (float) $latitude,
            (float) $longitude
        );

        if (!$validation['valid']) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => $validation['message'],
                    'code' => 'LOCATION_INVALID',
                    'location_data' => [
                        'distance' => $validation['distance'],
                        'nearest_location' => $validation['location']->location_name ?? null,
                    ]
                ], 422);
            }
            
            return back()->withErrors([
                'location' => $validation['message']
            ]);
        }

        // Add validated location data to request for use in controllers
        $request->merge([
            'validated_location' => $validation['location'],
            'location_distance' => $validation['distance']
        ]);

        return $next($request);
    }
}