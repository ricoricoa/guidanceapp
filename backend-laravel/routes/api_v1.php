<?php

use App\Http\Controllers\Api\V1\CarController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\V1\StudentController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\DocumentRequestController;
use App\Http\Controllers\Api\V1\CertificateController;
use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\MessageController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\AnnouncementController;
use App\Http\Controllers\Api\V1\AnnouncementCommentController;
use App\Http\Controllers\Api\V1\AnnouncementReactionController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\ChatController;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Route;

//Private(Authenticated) Routes
//Route::middleware('auth:sanctum')->apiResource('cars', CarController::class);

// Authenticated route to return current user (v1)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
	return $request->user();
});

// AI Chatbot route (public route - no authentication required)
Route::post('/chat', [ChatController::class, 'chat']);

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
	Route::get('/admin/counselors', [AdminController::class, 'getCounselors']);
});

// Student document requests
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
	Route::post('/documents', [DocumentRequestController::class, 'store']);
	Route::get('/documents', [DocumentRequestController::class, 'index']);
	Route::get('/documents/{id}', [DocumentRequestController::class, 'show']);
});

// Student certificate requests
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
	Route::post('/student/certificate-request', [CertificateController::class, 'store']);
	Route::get('/student/certificate-requests', [CertificateController::class, 'getStudentRequests']);
});

// Student counselor reviews
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
	Route::get('/reviews/counselors', [ReviewController::class, 'getCounselors']);
	Route::post('/reviews/store', [ReviewController::class, 'storeReview']);
	Route::get('/reviews/counselor/{counselorId}', [ReviewController::class, 'getStudentReview']);
});

// Counselor document request approval
Route::middleware(['auth:sanctum', 'role:guidance,counselor'])->group(function () {
	Route::get('/counselor/student-requests', [AdminController::class, 'getStudentDocumentRequests']);
	Route::put('/documents/{id}/approve', [DocumentRequestController::class, 'approve']);
	Route::put('/documents/{id}/reject', [DocumentRequestController::class, 'reject']);
});

// Counselor certificate request approval
Route::middleware(['auth:sanctum', 'role:guidance,counselor'])->group(function () {
	Route::get('/counselor/certificate-requests', [CertificateController::class, 'getCounselorRequests']);
	Route::put('/certificate-requests/{id}/approve', [CertificateController::class, 'approve']);
	Route::put('/certificate-requests/{id}/reject', [CertificateController::class, 'reject']);
	Route::put('/certificate-requests/{id}/status', [CertificateController::class, 'updateStatus']);
});

Route::middleware(['auth:sanctum', 'role:guidance,counselor'])->group(function () {
	Route::get('/guidance/dashboard', [DashboardController::class, 'guidanceDashboard']);
	Route::get('/guidance/students', [AdminController::class, 'getStudents']);
});

// Shared appointment endpoints
Route::middleware('auth:sanctum')->group(function () {
	Route::get('/appointments', [DashboardController::class, 'getAppointments']);
	Route::put('/appointments/{appointmentId}', [DashboardController::class, 'updateAppointmentStatus']);
});

// Profile endpoints: view and update allowed profile fields (no role changes)
Route::middleware('auth:sanctum')->get('/user/profile', function (Request $request) {
	$user = $request->user();
	// Expose a public URL for profile picture if stored
	if ($user->profile_picture_path) {
		$user->profile_picture = asset('storage/' . $user->profile_picture_path);
	} else {
		$user->profile_picture = null;
	}

	return response()->json(['user' => $user]);
});

Route::middleware('auth:sanctum')->put('/user/profile', function (Request $request) {
	$user = $request->user();

	$data = $request->validate([
		'name' => ['required', 'string', 'max:255'],
		'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
		'address' => ['nullable', 'string', 'max:500'],
		'phone' => ['nullable', 'string', 'max:20'],
		'year' => ['nullable', 'string', 'max:255'],
		'program' => ['nullable', 'string', 'max:255'],
		'tertiary_year' => ['nullable', 'string', 'max:50'],
		'bio' => ['nullable', 'string', 'max:1000'],
		'date_of_birth' => ['nullable', 'date'],
		'grade_level' => ['nullable', 'string', 'max:50'],
		'guardian_name' => ['nullable', 'string', 'max:255'],
		'guardian_contact' => ['nullable', 'string', 'max:20'],
	]);

	// Fill only allowed fields
	$user->fill([
		'name' => $data['name'],
		'email' => $data['email'],
		'address' => $data['address'] ?? null,
		'phone' => $data['phone'] ?? null,
		'year' => $data['year'] ?? null,
		'program' => $data['program'] ?? null,
		'tertiary_year' => $data['tertiary_year'] ?? null,
		'bio' => $data['bio'] ?? null,
		'date_of_birth' => $data['date_of_birth'] ?? null,
		'grade_level' => $data['grade_level'] ?? null,
		'guardian_name' => $data['guardian_name'] ?? null,
		'guardian_contact' => $data['guardian_contact'] ?? null,
	]);

	// Handle profile picture upload
	if ($request->hasFile('profile_picture')) {
		$file = $request->file('profile_picture');
		
		// Check if file has image in its mime type (accepts any image format)
		$mimeType = $file->getMimeType();
		
		if (strpos($mimeType, 'image/') !== 0) {
			return response()->json(['message' => 'Profile picture must be an image file'], 422);
		}
		
		// Delete old picture if exists
		if ($user->profile_picture_path && file_exists(storage_path('app/public/' . $user->profile_picture_path))) {
			unlink(storage_path('app/public/' . $user->profile_picture_path));
		}
		
		$path = $file->store('profile_pictures', 'public');
		$user->profile_picture_path = $path;
		$user->profile_picture = $path; // Also set profile_picture field
	}

	$user->save();

	// Expose public URL for the profile picture if stored
	if ($user->profile_picture_path) {
		$user->profile_picture = asset('storage/' . $user->profile_picture_path);
	} else {
		$user->profile_picture = null;
	}

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
	Route::get('/admin/reviews', [ReviewController::class, 'getAllReviews']);
});

// Counselor routes - access all students for messaging
Route::middleware(['auth:sanctum', 'role:counselor'])->group(function () {
	// Counselor-specific routes go here
});

// Message routes - available to authenticated users (students and counselors)
Route::middleware('auth:sanctum')->group(function () {
	Route::get('/messages/{studentId}/{counselorId}', [MessageController::class, 'getMessages']);
	Route::post('/messages', [MessageController::class, 'sendMessage']);
	Route::get('/messages', [MessageController::class, 'getUserMessages']);
	Route::put('/messages/{id}/read', [MessageController::class, 'markAsRead']);
});

// Announcement routes - Students view, Counselors create/manage
// Note: Role checks are performed in the controller methods for flexibility
Route::middleware('auth:sanctum')->group(function () {
	Route::get('/announcements', [AnnouncementController::class, 'getForStudent']);
	Route::post('/announcements', [AnnouncementController::class, 'create']);
	Route::get('/announcements/counselor/all', [AnnouncementController::class, 'getCounselorAnnouncements']);
	Route::put('/announcements/{id}', [AnnouncementController::class, 'update']);
	Route::delete('/announcements/{id}', [AnnouncementController::class, 'delete']);
});

// Show single announcement - must be after specific routes
Route::middleware('auth:sanctum')->group(function () {
	Route::get('/announcements/{id}', [AnnouncementController::class, 'show']);
});

// Announcement comments routes - both students and counselors can comment
Route::middleware('auth:sanctum')->group(function () {
	Route::get('/announcements/{id}/comments', [AnnouncementCommentController::class, 'getComments']);
	Route::post('/announcements/{id}/comments', [AnnouncementCommentController::class, 'addComment']);
	Route::put('/comments/{id}', [AnnouncementCommentController::class, 'updateComment']);
	Route::delete('/comments/{id}', [AnnouncementCommentController::class, 'deleteComment']);
});

// Announcement reactions routes - both students and counselors can react
Route::middleware('auth:sanctum')->group(function () {
	Route::get('/announcements/{id}/reactions', [AnnouncementReactionController::class, 'getReactions']);
	Route::post('/announcements/{id}/reactions', [AnnouncementReactionController::class, 'toggleReaction']);
});

// Report routes - Students can submit, Admin can view
// Student report submission endpoint
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
	Route::post('/reports', [ReportController::class, 'store']);
});

// Admin report viewing and management endpoints
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
	Route::get('/reports', [ReportController::class, 'index']);
	Route::put('/reports/{id}/status', [ReportController::class, 'updateStatus']);
});

//Public Routes
//Route::get('/carlisting', [CarController::class, 'index']);
