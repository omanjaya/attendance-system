<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\FaceLog;
use App\Services\AttendanceCalculatorService;
use App\Services\LocationValidationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Face Recognition Controller
 * 
 * Handles face recognition functionality for attendance including
 * face enrollment, verification, and attendance marking.
 */
class FaceRecognitionController extends Controller
{
    protected AttendanceCalculatorService $attendanceCalculator;
    protected LocationValidationService $locationValidator;

    public function __construct(
        AttendanceCalculatorService $attendanceCalculator,
        LocationValidationService $locationValidator
    ) {
        $this->attendanceCalculator = $attendanceCalculator;
        $this->locationValidator = $locationValidator;
    }

    /**
     * Enroll face for an employee
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function enrollFace(Request $request)
    {
        $request->validate([
            'face_image' => 'required|image|max:5120', // 5MB max
            'face_encodings' => 'required|array',
            'face_encodings.*' => 'numeric',
        ]);

        try {
            DB::beginTransaction();

            $employee = Employee::where('user_id', auth()->id())->firstOrFail();

            // Store face image
            $imagePath = null;
            if ($request->hasFile('face_image')) {
                $file = $request->file('face_image');
                $filename = 'face_' . $employee->id . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $imagePath = $file->storeAs('faces', $filename, 'private');
            }

            // Update employee face encodings
            $employee->update([
                'face_encodings' => $request->face_encodings,
                'profile_photo' => $imagePath ?? $employee->profile_photo,
            ]);

            // Log face enrollment
            FaceLog::create([
                'employee_id' => $employee->id,
                'action' => 'enrollment',
                'success' => true,
                'confidence_score' => 100,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Face enrolled successfully',
                'data' => [
                    'has_face_recognition' => true,
                    'enrollment_date' => now()->toDateTimeString(),
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Face enrollment failed', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to enroll face. Please try again.',
            ], 500);
        }
    }

    /**
     * Verify face for attendance
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyFace(Request $request)
    {
        $request->validate([
            'face_encodings' => 'required|array',
            'face_encodings.*' => 'numeric',
            'confidence_threshold' => 'nullable|numeric|between:0,100',
        ]);

        try {
            $employee = Employee::where('user_id', auth()->id())->firstOrFail();

            // Check if employee has face recognition enabled
            if (!$employee->hasFaceRecognition()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Face recognition not enrolled. Please enroll your face first.',
                ], 422);
            }

            // Calculate face similarity
            $similarity = $this->calculateFaceSimilarity(
                $employee->face_encodings,
                $request->face_encodings
            );

            $threshold = $request->confidence_threshold ?? 80;
            $verified = $similarity >= $threshold;

            // Log face verification attempt
            FaceLog::create([
                'employee_id' => $employee->id,
                'action' => 'verification',
                'success' => $verified,
                'confidence_score' => $similarity,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            if (!$verified) {
                return response()->json([
                    'success' => false,
                    'message' => 'Face verification failed. Please try again.',
                    'data' => [
                        'confidence_score' => round($similarity, 2),
                        'required_threshold' => $threshold,
                    ],
                ], 422);
            }

            return response()->json([
                'success' => true,
                'message' => 'Face verified successfully',
                'data' => [
                    'verified' => true,
                    'confidence_score' => round($similarity, 2),
                    'employee_id' => $employee->id,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Face verification failed', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to verify face. Please try again.',
            ], 500);
        }
    }

    /**
     * Check in with face recognition
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkInWithFace(Request $request)
    {
        $request->validate([
            'face_encodings' => 'required|array',
            'face_encodings.*' => 'numeric',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'confidence_threshold' => 'nullable|numeric|between:0,100',
        ]);

        try {
            DB::beginTransaction();

            $employee = Employee::where('user_id', auth()->id())->firstOrFail();

            // Verify face first
            if (!$employee->hasFaceRecognition()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Face recognition not enrolled. Please use manual check-in.',
                ], 422);
            }

            $similarity = $this->calculateFaceSimilarity(
                $employee->face_encodings,
                $request->face_encodings
            );

            $threshold = $request->confidence_threshold ?? 80;
            if ($similarity < $threshold) {
                FaceLog::create([
                    'employee_id' => $employee->id,
                    'action' => 'check_in_failed',
                    'success' => false,
                    'confidence_score' => $similarity,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Face verification failed. Cannot check in.',
                    'data' => [
                        'confidence_score' => round($similarity, 2),
                        'required_threshold' => $threshold,
                    ],
                ], 422);
            }

            // Now proceed with regular check-in using AttendanceApiController logic
            $attendanceController = app(AttendanceApiController::class);
            $checkInRequest = new Request([
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'method' => 'face_recognition',
                'face_confidence' => $similarity,
            ]);

            $response = $attendanceController->checkIn($checkInRequest);

            // Log successful face check-in
            if ($response->getStatusCode() === 200) {
                FaceLog::create([
                    'employee_id' => $employee->id,
                    'action' => 'check_in',
                    'success' => true,
                    'confidence_score' => $similarity,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);
            }

            DB::commit();
            return $response;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Face check-in failed', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to check in with face recognition.',
            ], 500);
        }
    }

    /**
     * Check out with face recognition
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkOutWithFace(Request $request)
    {
        $request->validate([
            'face_encodings' => 'required|array',
            'face_encodings.*' => 'numeric',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'confidence_threshold' => 'nullable|numeric|between:0,100',
        ]);

        try {
            DB::beginTransaction();

            $employee = Employee::where('user_id', auth()->id())->firstOrFail();

            // Verify face first
            if (!$employee->hasFaceRecognition()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Face recognition not enrolled. Please use manual check-out.',
                ], 422);
            }

            $similarity = $this->calculateFaceSimilarity(
                $employee->face_encodings,
                $request->face_encodings
            );

            $threshold = $request->confidence_threshold ?? 80;
            if ($similarity < $threshold) {
                FaceLog::create([
                    'employee_id' => $employee->id,
                    'action' => 'check_out_failed',
                    'success' => false,
                    'confidence_score' => $similarity,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Face verification failed. Cannot check out.',
                    'data' => [
                        'confidence_score' => round($similarity, 2),
                        'required_threshold' => $threshold,
                    ],
                ], 422);
            }

            // Now proceed with regular check-out using AttendanceApiController logic
            $attendanceController = app(AttendanceApiController::class);
            $checkOutRequest = new Request([
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'method' => 'face_recognition',
                'face_confidence' => $similarity,
            ]);

            $response = $attendanceController->checkOut($checkOutRequest);

            // Log successful face check-out
            if ($response->getStatusCode() === 200) {
                FaceLog::create([
                    'employee_id' => $employee->id,
                    'action' => 'check_out',
                    'success' => true,
                    'confidence_score' => $similarity,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);
            }

            DB::commit();
            return $response;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Face check-out failed', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to check out with face recognition.',
            ], 500);
        }
    }

    /**
     * Update face enrollment
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateFace(Request $request)
    {
        $request->validate([
            'face_image' => 'nullable|image|max:5120',
            'face_encodings' => 'required|array',
            'face_encodings.*' => 'numeric',
            'current_password' => 'required|string',
        ]);

        try {
            // Verify password for security
            if (!auth()->attempt([
                'email' => auth()->user()->email,
                'password' => $request->current_password,
            ])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid password. Cannot update face enrollment.',
                ], 422);
            }

            DB::beginTransaction();

            $employee = Employee::where('user_id', auth()->id())->firstOrFail();

            // Delete old face image if uploading new one
            if ($request->hasFile('face_image') && $employee->profile_photo) {
                Storage::disk('private')->delete($employee->profile_photo);
            }

            // Store new face image
            $imagePath = $employee->profile_photo;
            if ($request->hasFile('face_image')) {
                $file = $request->file('face_image');
                $filename = 'face_' . $employee->id . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $imagePath = $file->storeAs('faces', $filename, 'private');
            }

            // Update face encodings
            $employee->update([
                'face_encodings' => $request->face_encodings,
                'profile_photo' => $imagePath,
            ]);

            // Log face update
            FaceLog::create([
                'employee_id' => $employee->id,
                'action' => 'update_enrollment',
                'success' => true,
                'confidence_score' => 100,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Face enrollment updated successfully',
                'data' => [
                    'updated_at' => now()->toDateTimeString(),
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Face update failed', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update face enrollment.',
            ], 500);
        }
    }

    /**
     * Remove face enrollment
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeFace(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'confirmation' => 'required|boolean|accepted',
        ]);

        try {
            // Verify password for security
            if (!auth()->attempt([
                'email' => auth()->user()->email,
                'password' => $request->current_password,
            ])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid password. Cannot remove face enrollment.',
                ], 422);
            }

            DB::beginTransaction();

            $employee = Employee::where('user_id', auth()->id())->firstOrFail();

            // Delete face image
            if ($employee->profile_photo) {
                Storage::disk('private')->delete($employee->profile_photo);
            }

            // Remove face encodings
            $employee->update([
                'face_encodings' => null,
                'profile_photo' => null,
            ]);

            // Log face removal
            FaceLog::create([
                'employee_id' => $employee->id,
                'action' => 'remove_enrollment',
                'success' => true,
                'confidence_score' => 0,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Face enrollment removed successfully',
                'data' => [
                    'removed_at' => now()->toDateTimeString(),
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Face removal failed', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to remove face enrollment.',
            ], 500);
        }
    }

    /**
     * Get face recognition status
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function status()
    {
        try {
            $employee = Employee::where('user_id', auth()->id())->firstOrFail();

            $hasEnrollment = $employee->hasFaceRecognition();
            $recentLogs = [];

            if ($hasEnrollment) {
                $recentLogs = FaceLog::where('employee_id', $employee->id)
                    ->latest()
                    ->take(10)
                    ->get()
                    ->map(function ($log) {
                        return [
                            'action' => $log->action,
                            'success' => $log->success,
                            'confidence_score' => $log->confidence_score,
                            'timestamp' => $log->created_at->toDateTimeString(),
                        ];
                    });
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'has_face_recognition' => $hasEnrollment,
                    'enrollment_date' => $hasEnrollment && $employee->face_encodings 
                        ? $employee->updated_at->toDateTimeString() 
                        : null,
                    'recent_activity' => $recentLogs,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get face recognition status', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get face recognition status.',
            ], 500);
        }
    }

    /**
     * Calculate similarity between two face encodings
     *
     * @param array $encodings1
     * @param array $encodings2
     * @return float
     */
    protected function calculateFaceSimilarity(array $encodings1, array $encodings2): float
    {
        // This is a simplified similarity calculation
        // In a real implementation, you would use a proper face recognition library
        // like dlib or face_recognition Python library through an API

        if (count($encodings1) !== count($encodings2)) {
            return 0.0;
        }

        // Calculate Euclidean distance
        $sum = 0;
        for ($i = 0; $i < count($encodings1); $i++) {
            $sum += pow($encodings1[$i] - $encodings2[$i], 2);
        }
        $distance = sqrt($sum);

        // Convert distance to similarity percentage
        // This is a simplified conversion - adjust based on your face recognition model
        $maxDistance = 1.0; // Adjust based on your encoding format
        $similarity = max(0, 100 * (1 - ($distance / $maxDistance)));

        return $similarity;
    }
}
