<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\AIChatController;
use App\Http\Controllers\API\V1\ChatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/verify-email', [AuthController::class, 'verifyEmail'])->name('verify.email');
Route::post('/resend-verification', [AuthController::class, 'resendVerification'])->name('resend.verification');

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/user', action: function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('ai/chat', [AIChatController::class, 'chat']);
Route::post('/chat', [ChatController::class, 'chat']);
