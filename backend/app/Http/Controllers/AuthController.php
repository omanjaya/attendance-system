<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class AuthController extends Controller
{
    /**
     * Show the login form.
     */
    public function showLoginForm(): View
    {
        return view('auth.login');
    }

    /**
     * Handle login request.
     */
    public function login(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            'remember' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput($request->except('password'));
        }

        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember', false);

        // Attempt authentication
        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();
            
            $user = Auth::user();
            
            // Check if user has employee profile
            if (!$user->isEmployee()) {
                // Redirect admin/HR users without employee profiles to admin dashboard
                if ($user->hasRole(['admin', 'hr'])) {
                    return redirect()->intended('/admin/dashboard')
                        ->with('success', 'Welcome back, ' . $user->name);
                }
                
                // Regular users must have employee profile
                Auth::logout();
                return redirect()->back()
                    ->withErrors(['email' => 'Your account is not properly configured. Please contact administration.']);
            }

            // Log successful login
            activity()
                ->performedOn($user)
                ->causedBy($user)
                ->withProperties(['ip' => $request->ip(), 'user_agent' => $request->userAgent()])
                ->log('User logged in');

            // Redirect based on role
            return $this->redirectBasedOnRole($user);
        }

        // Authentication failed
        return redirect()->back()
            ->withErrors(['email' => 'Invalid credentials provided.'])
            ->withInput($request->except('password'));
    }

    /**
     * Show the registration form.
     */
    public function showRegistrationForm(): View
    {
        return view('auth.register');
    }

    /**
     * Handle registration request.
     */
    public function register(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'employee_number' => 'sometimes|string|max:50|unique:employees,employee_number',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput($request->except('password', 'password_confirmation'));
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Assign default role (employee)
            $user->assignRole('employee');

            // Log registration
            activity()
                ->performedOn($user)
                ->causedBy($user)
                ->withProperties(['ip' => $request->ip(), 'user_agent' => $request->userAgent()])
                ->log('User registered');

            // Auto-login after registration
            Auth::login($user);

            return redirect('/dashboard')
                ->with('success', 'Registration successful! Please complete your employee profile.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['general' => 'Registration failed. Please try again.'])
                ->withInput($request->except('password', 'password_confirmation'));
        }
    }

    /**
     * Handle logout request.
     */
    public function logout(Request $request): RedirectResponse
    {
        $user = Auth::user();

        // Log logout
        if ($user) {
            activity()
                ->performedOn($user)
                ->causedBy($user)
                ->withProperties(['ip' => $request->ip(), 'user_agent' => $request->userAgent()])
                ->log('User logged out');
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login')
            ->with('success', 'You have been logged out successfully.');
    }

    /**
     * Show forgot password form.
     */
    public function showForgotPasswordForm(): View
    {
        return view('auth.forgot-password');
    }

    /**
     * Handle forgot password request.
     */
    public function forgotPassword(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Here you would typically send a password reset email
        // For now, we'll just show a success message
        
        return redirect()->back()
            ->with('success', 'Password reset instructions have been sent to your email.');
    }

    /**
     * Redirect user based on their role.
     */
    private function redirectBasedOnRole(User $user): RedirectResponse
    {
        if ($user->hasRole('admin')) {
            return redirect()->intended('/admin/dashboard')
                ->with('success', 'Welcome back, Administrator');
        }

        if ($user->hasRole(['hr', 'supervisor'])) {
            return redirect()->intended('/dashboard')
                ->with('success', 'Welcome back, ' . $user->name);
        }

        if ($user->hasRole('teacher') || $user->hasRole('staff')) {
            return redirect()->intended('/dashboard')
                ->with('success', 'Welcome back, ' . $user->name);
        }

        // Default redirect for employees
        return redirect()->intended('/dashboard')
            ->with('success', 'Welcome back, ' . $user->name);
    }

    /**
     * Show user profile page.
     */
    public function profile(): View
    {
        $user = Auth::user();
        return view('auth.profile', compact('user'));
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'current_password' => 'sometimes|required|string',
            'password' => 'sometimes|nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            // Check current password if trying to change password
            if ($request->filled('password')) {
                if (!$request->filled('current_password') || !Hash::check($request->current_password, $user->password)) {
                    return redirect()->back()
                        ->withErrors(['current_password' => 'Current password is incorrect.'])
                        ->withInput();
                }
                $user->password = Hash::make($request->password);
            }

            $user->name = $request->name;
            $user->email = $request->email;
            $user->save();

            // Log profile update
            activity()
                ->performedOn($user)
                ->causedBy($user)
                ->withProperties(['fields' => array_keys($request->except('password', 'current_password', 'password_confirmation'))])
                ->log('User updated profile');

            return redirect()->back()
                ->with('success', 'Profile updated successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['general' => 'Profile update failed. Please try again.'])
                ->withInput();
        }
    }
}