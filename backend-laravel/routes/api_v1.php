<?php

use App\Http\Controllers\Api\V1\CarController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\V1\StudentController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\DocumentRequestController;
use App\Http\Controllers\Api\V1\AdminController;
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
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
	Route::get('/student/dashboard', [DashboardController::class, 'studentDashboard']);
});

// Student counselor request endpoints
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
	Route::post('/student/appointments', [StudentController::class, 'createAppointmentRequest']);
	Route::get('/student/appointments', [StudentController::class, 'getAppointmentRequests']);
	Route::get('/student/appointments/{id}', [StudentController::class, 'getAppointmentRequest']);
	Route::put('/student/appointments/{id}', [StudentController::class, 'updateAppointmentRequest']);
	Route::delete('/student/appointments/{id}', [StudentController::class, 'deleteAppointmentRequest']);
	Route::get('/counselors', [StudentController::class, 'getCounselors']);
});

Route::middleware(['auth:sanctum', 'role:guidance'])->group(function () {
	Route::get('/guidance/dashboard', [DashboardController::class, 'guidanceDashboard']);
	Route::get('/guidance/students', [AdminController::class, 'getStudents']);
	Route::get('/counselor/students', [AdminController::class, 'getCounselorStudents']);
	Route::post('/counselor/students', [AdminController::class, 'createCounselorStudent']);
});

// Shared appointment endpoints
Route::middleware('auth:sanctum')->group(function () {
	Route::get('/appointments', [DashboardController::class, 'getAppointments']);
	Route::put('/appointments/{appointmentId}', [DashboardController::class, 'updateAppointmentStatus']);
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

// Admin routes
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
	Route::get('/admin/users', [AdminController::class, 'getAllUsers']);
	Route::get('/admin/counselors', [AdminController::class, 'getCounselors']);
	Route::get('/admin/students', [AdminController::class, 'getStudents']);
	Route::get('/admin/dashboard-summary', [AdminController::class, 'getDashboardSummary']);
	Route::get('/admin/login-history', [AdminController::class, 'getLoginHistory']);
});

//Public Routes
//Route::get('/carlisting', [CarController::class, 'index']);
