<?php

use Illuminate\Support\Facades\Route;

// Welcome route
Route::get('/', function () {
    return view('welcome');
});

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'OK', 'timestamp' => now()]);
});

// SPA catch-all route
Route::get('/{any}', function () {
    return view('spa');
})->where('any', '.*');