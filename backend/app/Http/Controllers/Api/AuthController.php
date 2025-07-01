<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Services\SecurityService;

class AuthController extends Controller
{
    protected SecurityService $securityService;

    public function __construct(SecurityService $securityService)
    {
        $this->securityService = $securityService;
    }

    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->sanitized();
            $userEmail = $credentials['email'] ?? 'unknown';
            $requestId = $request->attributes->get('request_id', uniqid());

            \Log::channel('auth')->info('Login attempt started', [
                'request_id' => $requestId,
                'email' => $userEmail,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'timestamp' => now()->toISOString(),
            ]);

            // Extract only email and password for Auth::attempt
            $authCredentials = [
                'email' => $credentials['email'],
                'password' => $credentials['password']
            ];

            if (Auth::attempt($authCredentials)) {
                $user = Auth::user();
                
                // Load relationships and permissions
                $user->load(['employee', 'roles.permissions', 'permissions']);
                
                // Create token with user info
                $token = $user->createToken('attendance-system', ['*'])->plainTextToken;

                \Log::channel('auth')->info('Login successful', [
                    'request_id' => $requestId,
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name')->toArray(),
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'timestamp' => now()->toISOString(),
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Login successful',
                    'data' => [
                        'user' => [
                            'id' => $user->id,
                            'name' => $user->name,
                            'email' => $user->email,
                            'employee' => $user->employee,
                            'roles' => $user->roles->pluck('name'),
                            'permissions' => $user->getAllPermissions()->pluck('name'),
                        ],
                        'token' => $token
                    ]
                ]);
            }

            \Log::channel('auth')->warning('Login failed - Invalid credentials', [
                'request_id' => $requestId,
                'email' => $userEmail,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'timestamp' => now()->toISOString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);

        } catch (\Exception $e) {
            \Log::channel('auth')->error('Login error', [
                'request_id' => $request->attributes->get('request_id', uniqid()),
                'email' => $credentials['email'] ?? 'unknown',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'ip' => $request->ip(),
                'timestamp' => now()->toISOString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Login failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Logout successful'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function user(Request $request)
    {
        try {
            $user = $request->user();
            $user->load(['employee', 'roles.permissions', 'permissions']);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'employee' => $user->employee,
                        'roles' => $user->roles->pluck('name'),
                        'permissions' => $user->getAllPermissions()->pluck('name'),
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function refresh(Request $request)
    {
        try {
            $user = $request->user();
            
            // Delete current token
            $request->user()->currentAccessToken()->delete();
            
            // Create new token
            $token = $user->createToken('attendance-system', ['*'])->plainTextToken;
            
            return response()->json([
                'success' => true,
                'message' => 'Token refreshed successfully',
                'data' => [
                    'token' => $token
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token refresh failed: ' . $e->getMessage()
            ], 500);
        }
    }
}