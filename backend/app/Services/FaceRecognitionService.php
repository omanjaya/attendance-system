<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\RequestException;

class FaceRecognitionService
{
    private string $baseUrl;
    private int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.face_recognition.url', 'http://localhost:8001');
        $this->timeout = config('services.face_recognition.timeout', 30);
    }

    /**
     * Check if face recognition service is available
     */
    public function isAvailable(): bool
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/health");
            return $response->successful();
        } catch (\Exception $e) {
            Log::warning('Face recognition service unavailable', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Register a new face for an employee
     */
    public function registerFace(string $employeeId, string $employeeName, $imageFile): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->attach('file', $imageFile, "{$employeeId}.jpg")
                ->post("{$this->baseUrl}/api/v1/register-face", [
                    'employee_id' => $employeeId,
                    'employee_name' => $employeeName,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                Log::info('Face registration successful', [
                    'employee_id' => $employeeId,
                    'employee_name' => $employeeName
                ]);
                return [
                    'success' => true,
                    'data' => $data,
                    'message' => $data['message'] ?? 'Face registered successfully'
                ];
            }

            $error = $response->json();
            Log::error('Face registration failed', [
                'employee_id' => $employeeId,
                'status' => $response->status(),
                'error' => $error
            ]);

            return [
                'success' => false,
                'message' => $error['detail'] ?? 'Face registration failed',
                'status_code' => $response->status()
            ];

        } catch (RequestException $e) {
            Log::error('Face registration request failed', [
                'employee_id' => $employeeId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Unable to connect to face recognition service',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Verify face against registered employees
     */
    public function verifyFace(string $imageData, bool $requireGestures = true): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->post("{$this->baseUrl}/api/v1/verify-face", [
                    'image_data' => $imageData,
                    'require_gestures' => $requireGestures
                ]);

            if ($response->successful()) {
                $result = $response->json();
                
                Log::info('Face verification completed', [
                    'success' => $result['success'],
                    'employee_id' => $result['employee_id'] ?? null,
                    'confidence' => $result['confidence'] ?? 0
                ]);

                return [
                    'success' => true,
                    'data' => $result,
                    'recognized' => $result['success'],
                    'employee_id' => $result['employee_id'] ?? null,
                    'employee_name' => $result['employee_name'] ?? null,
                    'confidence' => $result['confidence'] ?? 0,
                    'message' => $result['message'] ?? 'Verification completed'
                ];
            }

            $error = $response->json();
            Log::warning('Face verification failed', [
                'status' => $response->status(),
                'error' => $error
            ]);

            return [
                'success' => false,
                'recognized' => false,
                'message' => $error['detail'] ?? 'Face verification failed',
                'status_code' => $response->status()
            ];

        } catch (RequestException $e) {
            Log::error('Face verification request failed', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'recognized' => false,
                'message' => 'Unable to connect to face recognition service',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Remove face registration for an employee
     */
    public function removeFace(string $employeeId): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->delete("{$this->baseUrl}/api/v1/remove-face/{$employeeId}");

            if ($response->successful()) {
                $data = $response->json();
                Log::info('Face removal successful', ['employee_id' => $employeeId]);
                
                return [
                    'success' => true,
                    'data' => $data,
                    'message' => $data['message'] ?? 'Face removed successfully'
                ];
            }

            $error = $response->json();
            Log::warning('Face removal failed', [
                'employee_id' => $employeeId,
                'status' => $response->status(),
                'error' => $error
            ]);

            return [
                'success' => false,
                'message' => $error['detail'] ?? 'Face removal failed',
                'status_code' => $response->status()
            ];

        } catch (RequestException $e) {
            Log::error('Face removal request failed', [
                'employee_id' => $employeeId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Unable to connect to face recognition service',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get list of registered employees
     */
    public function getRegisteredEmployees(): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->get("{$this->baseUrl}/api/v1/employees");

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'data' => $data,
                    'employees' => $data['employees'] ?? [],
                    'count' => $data['count'] ?? 0
                ];
            }

            $error = $response->json();
            return [
                'success' => false,
                'message' => $error['detail'] ?? 'Failed to get employee list',
                'status_code' => $response->status()
            ];

        } catch (RequestException $e) {
            Log::error('Get employees request failed', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Unable to connect to face recognition service',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get service status and health information
     */
    public function getServiceStatus(): array
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/health");

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'available' => true,
                    'data' => $data,
                    'status' => $data['status'] ?? 'healthy',
                    'services' => $data['services'] ?? []
                ];
            }

            return [
                'success' => false,
                'available' => false,
                'message' => 'Service unhealthy',
                'status_code' => $response->status()
            ];

        } catch (RequestException $e) {
            return [
                'success' => false,
                'available' => false,
                'message' => 'Service unavailable',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Bulk register faces for multiple employees
     */
    public function bulkRegisterFaces(array $employees): array
    {
        $results = [];
        $successful = 0;
        $failed = 0;

        foreach ($employees as $employee) {
            $result = $this->registerFace(
                $employee['employee_id'],
                $employee['employee_name'],
                $employee['image_file']
            );

            $results[] = [
                'employee_id' => $employee['employee_id'],
                'employee_name' => $employee['employee_name'],
                'result' => $result
            ];

            if ($result['success']) {
                $successful++;
            } else {
                $failed++;
            }
        }

        return [
            'success' => true,
            'total' => count($employees),
            'successful' => $successful,
            'failed' => $failed,
            'results' => $results
        ];
    }
}