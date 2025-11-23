<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LoginHistory;
use App\Models\DocumentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    /**
     * Get all users with optional role filtering
     */
    public function getAllUsers(Request $request)
    {
        $role = $request->query('role', null);
        
        $query = User::query();
        
        if ($role && $role !== 'all') {
            $query->where('role', $role);
        }
        
        $users = $query->select('id', 'name', 'email', 'role', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                    'status' => 'active', // You can add a status field to users table later
                ];
            });
        
        return response()->json([
            'message' => 'Users retrieved successfully',
            'data' => $users,
            'total' => $users->count(),
        ], 200);
    }

    /**
     * Get all counselors
     */
    public function getCounselors()
    {
        $counselors = User::where('role', 'counselor')
            ->select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($counselor) {
                return [
                    'id' => $counselor->id,
                    'name' => $counselor->name,
                    'email' => $counselor->email,
                    'role' => $counselor->role,
                    'created_at' => $counselor->created_at,
                    'status' => 'active',
                ];
            });
        
        return response()->json([
            'message' => 'Counselors retrieved successfully',
            'data' => $counselors,
            'total' => $counselors->count(),
        ], 200);
    }

    /**
     * Get all students
     */
    public function getStudents()
    {
        $students = User::where('role', 'student')
            ->select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                    'role' => $student->role,
                    'created_at' => $student->created_at,
                    'status' => 'active',
                ];
            });
        
        return response()->json([
            'message' => 'Students retrieved successfully',
            'data' => $students,
            'total' => $students->count(),
        ], 200);
    }

    /**
     * Get admin dashboard summary
     */
    public function getDashboardSummary()
    {
        $totalUsers = User::count();
        $totalCounselors = User::where('role', 'counselor')->count();
        $totalStudents = User::where('role', 'student')->count();
        
        return response()->json([
            'message' => 'Dashboard summary retrieved successfully',
            'data' => [
                'total_users' => $totalUsers,
                'total_counselors' => $totalCounselors,
                'total_students' => $totalStudents,
                'total_admins' => User::where('role', 'admin')->count(),
            ],
        ], 200);
    }

    /**
     * Get students created by a counselor
     */
    public function getCounselorStudents(Request $request)
    {
        $counselorId = $request->user()->id;
        
        $students = User::where('role', 'student')
            ->where('counselor_id', $counselorId)
            ->select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                    'role' => $student->role,
                    'created_at' => $student->created_at,
                    'status' => 'active',
                ];
            });
        
        return response()->json([
            'message' => 'Counselor students retrieved successfully',
            'data' => $students,
            'total' => $students->count(),
        ], 200);
    }

    /**
     * Create a student as a counselor
     */
    public function createCounselorStudent(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')],
            'password' => 'required|string|min:8',
            'address' => 'nullable|string|max:500',
        ]);

        $counselorId = $request->user()->id;

        $student = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'student',
            'address' => $validated['address'] ?? null,
            'counselor_id' => $counselorId,
        ]);

        return response()->json([
            'message' => 'Student created successfully',
            'data' => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'role' => $student->role,
                'counselor_id' => $student->counselor_id,
                'created_at' => $student->created_at,
            ],
        ], 201);
    }

    /**
     * Get login history with user details
     */
    public function getLoginHistory()
    {
        $loginHistory = LoginHistory::with('user:id,name,email,role')
            ->orderBy('login_time', 'desc')
            ->limit(100)
            ->get()
            ->map(function ($history) {
                return [
                    'id' => $history->id,
                    'user_id' => $history->user_id,
                    'user_name' => $history->user?->name,
                    'email' => $history->user?->email,
                    'role' => $history->user?->role,
                    'login_time' => $history->login_time,
                    'logout_time' => $history->logout_time,
                    'ip_address' => $history->ip_address,
                    'duration' => $history->logout_time 
                        ? $history->logout_time->diffInMinutes($history->login_time) 
                        : null,
                ];
            });
        
        return response()->json([
            'message' => 'Login history retrieved successfully',
            'data' => $loginHistory,
            'total' => $loginHistory->count(),
        ], 200);
    }

    /**
     * Get all student document requests for counselor
     */
    public function getStudentDocumentRequests(Request $request)
    {
        $requests = DocumentRequest::with('user:id,name,email')
            ->orderBy('submitted_at', 'desc')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'student_id' => $request->user_id,
                    'student_name' => $request->user?->name,
                    'student_email' => $request->user?->email,
                    'request_type' => $request->request_type,
                    'purpose' => $request->purpose,
                    'notes' => $request->notes,
                    'status' => $request->status,
                    'remarks' => $request->remarks,
                    'submitted_at' => $request->submitted_at,
                    'completed_at' => $request->completed_at,
                ];
            });

        return response()->json([
            'message' => 'Student document requests retrieved successfully',
            'data' => $requests,
            'total' => $requests->count(),
        ], 200);
    }
}
