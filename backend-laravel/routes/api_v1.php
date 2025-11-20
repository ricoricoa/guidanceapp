<?php

use App\Http\Controllers\Api\V1\CarController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Route;

//Private(Authenticated) Routes
//Route::middleware('auth:sanctum')->apiResource('cars', CarController::class);

// Authenticated route to return current user (v1)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
	return $request->user();
});

// Role-protected dashboard endpoints
Route::middleware(['auth:sanctum', 'role:student'])->get('/student/dashboard', function (Request $request) {
	return response()->json([
		'message' => 'Welcome to student dashboard',
		'user' => $request->user(),
	]);
});

Route::middleware(['auth:sanctum', 'role:guidance'])->get('/guidance/dashboard', function (Request $request) {
	return response()->json([
		'message' => 'Welcome to guidance dashboard',
		'user' => $request->user(),
	]);
});

// Profile endpoints: view and update allowed profile fields (no role changes)
Route::middleware('auth:sanctum')->get('/user/profile', function (Request $request) {
	return response()->json(['user' => $request->user()]);
});

Route::middleware('auth:sanctum')->put('/user/profile', function (Request $request) {
	$user = $request->user();

	$data = $request->validate([
		'name' => ['required', 'string', 'max:255'],
		'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
		'address' => ['nullable', 'string', 'max:500'],
	]);

	// only fill allowed fields
	$user->name = $data['name'];
	$user->email = $data['email'];
	$user->address = $data['address'] ?? null;
	$user->save();

	return response()->json(['message' => 'Profile updated', 'user' => $user]);
});

Route::middleware(['auth:sanctum', 'role:admin'])->apiResource('cars', CarController::class);

//Public Routes
//Route::get('/carlisting', [CarController::class, 'index']);
