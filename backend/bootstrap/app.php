<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Global middleware - applies to all requests (CORS first)
        $middleware->prepend(\App\Http\Middleware\CustomCors::class);
        
        // Security middleware - apply to all routes
        $middleware->append(\App\Http\Middleware\SecurityHeaders::class);
        $middleware->append(\App\Http\Middleware\SecurityAudit::class);
        
        // API Middleware
        $middleware->api([
            \App\Http\Middleware\ApiLogging::class,
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \App\Http\Middleware\InputSanitization::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
        
        // Web Middleware
        $middleware->web([
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);

        // Register named middleware
        $middleware->alias([
            'rate.limit' => \App\Http\Middleware\RateLimiting::class,
            'audit.log' => \App\Http\Middleware\AuditLogMiddleware::class,
            'check.permission' => \App\Http\Middleware\CheckPermissionMiddleware::class,
            'check.role' => \App\Http\Middleware\CheckRoleMiddleware::class,
            'employee.type' => \App\Http\Middleware\CheckEmployeeType::class,
            'location.access' => \App\Http\Middleware\ValidateLocationAccess::class,
            'ensure.employee' => \App\Http\Middleware\EnsureEmployeeProfile::class,
            'api.logging' => \App\Http\Middleware\ApiLogging::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();