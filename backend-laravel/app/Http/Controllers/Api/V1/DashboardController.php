<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CounselorRequest;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get student dashboard data
     */
    public function studentDashboard(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Get appointment statistics
        $upcomingSessions = CounselorRequest::where('student_id', $user->id)
            ->where('status', 'scheduled')
            ->count();

        $completedSessions = CounselorRequest::where('student_id', $user->id)
            ->where('status', 'completed')
            ->count();

        // Get recent appointments
        $recentActivities = CounselorRequest::where('student_id', $user->id)
            ->with(['counselor:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($appt) {
                return [
                    'id' => $appt->id,
                    'counselor_name' => $appt->counselor->name ?? 'Unknown',
                    'topic' => $appt->topic,
                    'status' => $appt->status,
                    'requested_date' => $appt->requested_date,
                    'created_at' => $appt->created_at,
                ];
            });

        // Get upcoming appointments
        $upcomingAppointments = CounselorRequest::where('student_id', $user->id)
            ->where('status', 'scheduled')
            ->with(['counselor:id,name,email'])
            ->orderBy('requested_date', 'asc')
            ->get()
            ->map(function ($appt) {
                return [
                    'id' => $appt->id,
                    'counselor_name' => $appt->counselor->name ?? 'Unknown',
                    'counselor_email' => $appt->counselor->email ?? '',
                    'topic' => $appt->topic,
                    'date' => $appt->requested_date,
                    'time' => $appt->requested_time,
                    'status' => $appt->status,
                ];
            });

        return response()->json([
            'data' => [
                'user' => $user,
                'stats' => [
                    'upcoming_sessions' => $upcomingSessions,
                    'completed_sessions' => $completedSessions,
                    'total_sessions' => CounselorRequest::where('student_id', $user->id)->count(),
                    'messages' => 0, // Placeholder for messaging system
                    'resources' => 0, // Placeholder for resources system
                ],
                'recent_activities' => $recentActivities,
                'upcoming_appointments' => $upcomingAppointments,
            ],
            'message' => 'Student dashboard data retrieved successfully',
            'status' => 200,
        ]);
    }

    /**
     * Get counselor/guidance dashboard data
     */
    public function guidanceDashboard(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'guidance' && $user->role !== 'counselor') {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Get list of students assigned/requesting with this counselor
        // Students can be assigned via counselor_id field OR through counselor_requests
        $studentIds = User::where('counselor_id', $user->id)
            ->pluck('id')
            ->toArray();
        
        $requestedStudentIds = CounselorRequest::where('counselor_id', $user->id)
            ->distinct()
            ->pluck('student_id')
            ->toArray();
        
        $allStudentIds = array_unique(array_merge($studentIds, $requestedStudentIds));
        
        $students = User::whereIn('id', $allStudentIds)
        ->select('id', 'name', 'email', 'created_at')
        ->withCount(['counselorRequests' => function ($query) use ($user) {
            $query->where('counselor_id', $user->id);
        }])
        ->get()
        ->map(function ($student) {
            return [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'sessions' => $student->counselor_requests_count,
                'status' => 'active',
            ];
        });

        // Get appointments/requests
        $appointments = CounselorRequest::where('counselor_id', $user->id)
            ->with(['student:id,name,email'])
            ->orderBy('requested_date', 'asc')
            ->get()
            ->map(function ($appt) {
                return [
                    'id' => $appt->id,
                    'student_id' => $appt->student_id,
                    'student_name' => $appt->student->name ?? 'Unknown',
                    'student_email' => $appt->student->email ?? '',
                    'date' => $appt->requested_date,
                    'time' => $appt->requested_time,
                    'topic' => $appt->topic,
                    'status' => $appt->status,
                    'notes' => $appt->notes ?? '',
                ];
            });

        // Get statistics
        $totalStudents = $students->count();
        $totalSessions = CounselorRequest::where('counselor_id', $user->id)->count();
        $completedSessions = CounselorRequest::where('counselor_id', $user->id)
            ->where('status', 'completed')
            ->count();
        $upcomingSessions = CounselorRequest::where('counselor_id', $user->id)
            ->where('status', 'scheduled')
            ->count();

        return response()->json([
            'data' => [
                'user' => $user,
                'stats' => [
                    'total_students' => $totalStudents,
                    'total_sessions' => $totalSessions,
                    'completed_sessions' => $completedSessions,
                    'upcoming_sessions' => $upcomingSessions,
                ],
                'students' => $students,
                'appointments' => $appointments,
            ],
            'message' => 'Guidance dashboard data retrieved successfully',
            'status' => 200,
        ]);
    }

    /**
     * Get upcoming appointments
     */
    public function getAppointments(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        if ($role === 'student') {
            $appointments = CounselorRequest::where('student_id', $user->id)
                ->with(['counselor:id,name,email'])
                ->orderBy('requested_date', 'asc')
                ->get();
        } elseif ($role === 'guidance' || $role === 'counselor') {
            $appointments = CounselorRequest::where('counselor_id', $user->id)
                ->with(['student:id,name,email'])
                ->orderBy('requested_date', 'asc')
                ->get();
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'data' => $appointments,
            'message' => 'Appointments retrieved successfully',
            'status' => 200,
        ]);
    }

    /**
     * Update appointment status
     */
    public function updateAppointmentStatus(Request $request, $appointmentId)
    {
        $user = $request->user();
        $appointment = CounselorRequest::find($appointmentId);

        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        if ($appointment->counselor_id !== $user->id && $appointment->student_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,scheduled,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        $appointment->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? $appointment->notes,
        ]);

        return response()->json([
            'data' => $appointment,
            'message' => 'Appointment updated successfully',
            'status' => 200,
        ]);
    }
}
