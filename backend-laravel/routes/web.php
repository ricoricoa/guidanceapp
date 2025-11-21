<?php

use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Support\Facades\Route;

// Health check route
Route::get('/up', function () {
    return response()->json(['status' => 'ok']);
});

// Fallback route - return 404 for web routes
Route::fallback(function () {
    return response()->json(['message' => 'Not Found'], 404);
});

