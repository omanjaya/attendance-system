<?php

/**
 * Route Testing Script
 * 
 * This script can be run via artisan tinker to test route configurations
 * Usage: php artisan tinker --execute="include 'routes/route-test.php'"
 */

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

// Clear route cache to ensure fresh routes
Artisan::call('route:clear');

echo "Testing Route Configuration...\n\n";

// Test Web Routes
echo "=== WEB ROUTES ===\n";
$webRoutes = collect(Route::getRoutes()->getRoutes())
    ->filter(function ($route) {
        return !str_starts_with($route->uri(), 'api/');
    });

echo "Total Web Routes: " . $webRoutes->count() . "\n";

// Group web routes by prefix/category
$webRouteGroups = [
    'Authentication' => $webRoutes->filter(fn($r) => str_contains($r->uri(), 'login') || str_contains($r->uri(), 'register') || str_contains($r->uri(), 'password')),
    'Dashboard' => $webRoutes->filter(fn($r) => str_contains($r->uri(), 'dashboard')),
    'Profile' => $webRoutes->filter(fn($r) => str_contains($r->uri(), 'profile')),
    'Employees' => $webRoutes->filter(fn($r) => str_contains($r->uri(), 'employees')),
    'Attendance' => $webRoutes->filter(fn($r) => str_contains($r->uri(), 'attendance')),
    'Schedules' => $webRoutes->filter(fn($r) => str_contains($r->uri(), 'schedules')),
    'Leaves' => $webRoutes->filter(fn($r) => str_contains($r->uri(), 'leaves')),
    'Payroll' => $webRoutes->filter(fn($r) => str_contains($r->uri(), 'payroll')),
    'Reports' => $webRoutes->filter(fn($r) => str_contains($r->uri(), 'reports')),
    'Settings' => $webRoutes->filter(fn($r) => str_contains($r->uri(), 'settings')),
    'Face Recognition' => $webRoutes->filter(fn($r) => str_contains($r->uri(), 'face-recognition')),
];

foreach ($webRouteGroups as $group => $routes) {
    if ($routes->count() > 0) {
        echo "\n{$group} Routes: {$routes->count()}\n";
        foreach ($routes as $route) {
            $methods = implode('|', $route->methods());
            $name = $route->getName() ?: 'unnamed';
            echo "  {$methods} {$route->uri()} -> {$name}\n";
        }
    }
}

// Test API Routes
echo "\n\n=== API ROUTES ===\n";
$apiRoutes = collect(Route::getRoutes()->getRoutes())
    ->filter(function ($route) {
        return str_starts_with($route->uri(), 'api/');
    });

echo "Total API Routes: " . $apiRoutes->count() . "\n";

// Group API routes by version and category
$apiRouteGroups = [
    'Authentication' => $apiRoutes->filter(fn($r) => str_contains($r->uri(), 'auth')),
    'Dashboard' => $apiRoutes->filter(fn($r) => str_contains($r->uri(), 'dashboard')),
    'Profile' => $apiRoutes->filter(fn($r) => str_contains($r->uri(), 'profile')),
    'Employees' => $apiRoutes->filter(fn($r) => str_contains($r->uri(), 'employees')),
    'Attendance' => $apiRoutes->filter(fn($r) => str_contains($r->uri(), 'attendance')),
    'Schedules' => $apiRoutes->filter(fn($r) => str_contains($r->uri(), 'schedules')),
    'Leaves' => $apiRoutes->filter(fn($r) => str_contains($r->uri(), 'leaves')),
    'Payroll' => $apiRoutes->filter(fn($r) => str_contains($r->uri(), 'payroll')),
    'Reports' => $apiRoutes->filter(fn($r) => str_contains($r->uri(), 'reports')),
    'Face Recognition' => $apiRoutes->filter(fn($r) => str_contains($r->uri(), 'face-recognition')),
    'Notifications' => $apiRoutes->filter(fn($r) => str_contains($r->uri(), 'notifications')),
    'Utilities' => $apiRoutes->filter(fn($r) => str_contains($r->uri(), 'utils')),
    'Webhooks' => $apiRoutes->filter(fn($r) => str_contains($r->uri(), 'webhooks')),
];

foreach ($apiRouteGroups as $group => $routes) {
    if ($routes->count() > 0) {
        echo "\n{$group} API Routes: {$routes->count()}\n";
        foreach ($routes as $route) {
            $methods = implode('|', $route->methods());
            $name = $route->getName() ?: 'unnamed';
            $middleware = implode(', ', $route->gatherMiddleware());
            echo "  {$methods} {$route->uri()} -> {$name}\n";
            if ($middleware) {
                echo "    Middleware: {$middleware}\n";
            }
        }
    }
}

// Test Middleware
echo "\n\n=== MIDDLEWARE ANALYSIS ===\n";

$middlewareUsage = [];
foreach (Route::getRoutes()->getRoutes() as $route) {
    foreach ($route->gatherMiddleware() as $middleware) {
        if (!isset($middlewareUsage[$middleware])) {
            $middlewareUsage[$middleware] = 0;
        }
        $middlewareUsage[$middleware]++;
    }
}

echo "Middleware Usage:\n";
arsort($middlewareUsage);
foreach ($middlewareUsage as $middleware => $count) {
    echo "  {$middleware}: {$count} routes\n";
}

// Test RESTful Resource Routes
echo "\n\n=== RESTFUL ROUTES ANALYSIS ===\n";

$resourceRoutes = collect(Route::getRoutes()->getRoutes())
    ->filter(function ($route) {
        $methods = $route->methods();
        return in_array('GET', $methods) || in_array('POST', $methods) || 
               in_array('PUT', $methods) || in_array('PATCH', $methods) || 
               in_array('DELETE', $methods);
    })
    ->groupBy(function ($route) {
        $uri = $route->uri();
        // Extract resource name (first segment after api/v1 or directly)
        $segments = explode('/', $uri);
        if (count($segments) >= 3 && $segments[0] === 'api' && $segments[1] === 'v1') {
            return $segments[2];
        } elseif (count($segments) >= 1) {
            return $segments[0];
        }
        return 'other';
    });

foreach ($resourceRoutes as $resource => $routes) {
    $methods = $routes->pluck('methods')->flatten()->unique()->sort()->values();
    echo "{$resource}: " . $methods->implode(', ') . " ({$routes->count()} routes)\n";
}

// Route Name Analysis
echo "\n\n=== ROUTE NAMES ANALYSIS ===\n";

$namedRoutes = collect(Route::getRoutes()->getRoutes())
    ->filter(fn($r) => $r->getName())
    ->pluck('name')
    ->sort();

$unnamedRoutes = collect(Route::getRoutes()->getRoutes())
    ->filter(fn($r) => !$r->getName())
    ->count();

echo "Named Routes: " . $namedRoutes->count() . "\n";
echo "Unnamed Routes: " . $unnamedRoutes . "\n";

if ($unnamedRoutes > 0) {
    echo "\nUnnamed routes (should be named for better maintainability):\n";
    collect(Route::getRoutes()->getRoutes())
        ->filter(fn($r) => !$r->getName())
        ->each(function ($route) {
            $methods = implode('|', $route->methods());
            echo "  {$methods} {$route->uri()}\n";
        });
}

// Security Analysis
echo "\n\n=== SECURITY ANALYSIS ===\n";

$authRoutes = collect(Route::getRoutes()->getRoutes())
    ->filter(function ($route) {
        $middleware = $route->gatherMiddleware();
        return in_array('auth', $middleware) || in_array('auth:sanctum', $middleware);
    });

$permissionRoutes = collect(Route::getRoutes()->getRoutes())
    ->filter(function ($route) {
        $middleware = $route->gatherMiddleware();
        return collect($middleware)->some(fn($m) => str_starts_with($m, 'permission:'));
    });

$throttledRoutes = collect(Route::getRoutes()->getRoutes())
    ->filter(function ($route) {
        $middleware = $route->gatherMiddleware();
        return collect($middleware)->some(fn($m) => str_starts_with($m, 'throttle:'));
    });

echo "Routes requiring authentication: " . $authRoutes->count() . "\n";
echo "Routes with permission checks: " . $permissionRoutes->count() . "\n";
echo "Routes with rate limiting: " . $throttledRoutes->count() . "\n";

echo "\n✅ Route configuration analysis complete!\n";

// Additional validation
echo "\n=== ROUTE VALIDATION ===\n";

$issues = [];

// Check for duplicate route names
$routeNames = collect(Route::getRoutes()->getRoutes())
    ->pluck('name')
    ->filter()
    ->countBy()
    ->filter(fn($count) => $count > 1);

if ($routeNames->count() > 0) {
    $issues[] = "Duplicate route names found: " . $routeNames->keys()->implode(', ');
}

// Check for routes without CSRF protection where needed
$postRoutes = collect(Route::getRoutes()->getRoutes())
    ->filter(function ($route) {
        return in_array('POST', $route->methods()) && 
               !str_starts_with($route->uri(), 'api/') &&
               !in_array('guest', $route->gatherMiddleware());
    });

foreach ($postRoutes as $route) {
    if (!in_array('web', $route->gatherMiddleware())) {
        $issues[] = "POST route without web middleware (CSRF): " . $route->uri();
    }
}

if (empty($issues)) {
    echo "✅ No configuration issues found!\n";
} else {
    echo "⚠️  Issues found:\n";
    foreach ($issues as $issue) {
        echo "  - {$issue}\n";
    }
}

echo "\n" . str_repeat("=", 50) . "\n";
echo "Route testing completed successfully!\n";
echo str_repeat("=", 50) . "\n";