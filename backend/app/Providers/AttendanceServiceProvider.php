<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\AttendanceCalculatorService;
use App\Services\LocationValidationService;

/**
 * Attendance Service Provider
 * 
 * Registers attendance-related services in the application container.
 */
class AttendanceServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register AttendanceCalculatorService as singleton
        $this->app->singleton(AttendanceCalculatorService::class, function ($app) {
            return new AttendanceCalculatorService();
        });

        // Register LocationValidationService as singleton
        $this->app->singleton(LocationValidationService::class, function ($app) {
            return new LocationValidationService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}