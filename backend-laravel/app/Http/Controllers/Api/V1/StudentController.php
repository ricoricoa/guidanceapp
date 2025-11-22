<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CounselorRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    /**
     * Create a new counselor appointment request.
     */
    public function createAppointmentRequest(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'topic' => 'required|string|max:1000',
            'counselor_id' => 'required|exists:users,id',
        ]);

        $user = $request->user();

        // Check if counselor exists and has guidance role
        $counselor = User::find($validated['counselor_id']);
        if (!$counselor || ($counselor->role !== 'guidance' && $counselor->role !== 'counselor')) {
            return response()->json([
                'message' => 'Invalid counselor selected'
            ], 422);
        }

        $appointmentRequest = CounselorRequest::create([
            'student_id' => $user->id,
            'counselor_id' => $validated['counselor_id'],
            'requested_date' => $validated['date'],
            'requested_time' => $validated['time'],
            'topic' => $validated['topic'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Appointment request created successfully',
            'appointment' => $appointmentRequest->load(['student', 'counselor']),
        ], 201);
    }

    /**
     * Get all appointment requests for the logged-in student.
     */
    public function getAppointmentRequests(Request $request)
    {
        $user = $request->user();

        $requests = CounselorRequest::where('student_id', $user->id)
            ->with(['student', 'counselor'])
            ->orderBy('requested_date', 'desc')
            ->get();

        return response()->json([
            'message' => 'Appointment requests retrieved',
            'data' => $requests,
        ]);
    }

    /**
     * Get a specific appointment request.
     */
    public function getAppointmentRequest(Request $request, $id)
    {
        $user = $request->user();

        $appointmentRequest = CounselorRequest::where('student_id', $user->id)
            ->findOrFail($id);

        return response()->json([
            'message' => 'Appointment request retrieved',
            'appointment' => $appointmentRequest->load(['student', 'counselor']),
        ]);
    }

    /**
     * Update an appointment request (student can only update pending requests).
     */
    public function updateAppointmentRequest(Request $request, $id)
    {
        $user = $request->user();

        $appointmentRequest = CounselorRequest::where('student_id', $user->id)
            ->findOrFail($id);

        // Can only update pending requests
        if ($appointmentRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Cannot update a request that is not pending'
            ], 422);
        }

        $validated = $request->validate([
            'date' => 'sometimes|date|after_or_equal:today',
            'time' => 'sometimes|date_format:H:i',
            'topic' => 'sometimes|string|max:1000',
            'counselor_id' => 'sometimes|exists:users,id',
        ]);

        if (isset($validated['date'])) {
            $appointmentRequest->requested_date = $validated['date'];
        }
        if (isset($validated['time'])) {
            $appointmentRequest->requested_time = $validated['time'];
        }
        if (isset($validated['topic'])) {
            $appointmentRequest->topic = $validated['topic'];
        }
        if (isset($validated['counselor_id'])) {
            $appointmentRequest->counselor_id = $validated['counselor_id'];
        }

        $appointmentRequest->save();

        return response()->json([
            'message' => 'Appointment request updated',
            'appointment' => $appointmentRequest->load(['student', 'counselor']),
        ]);
    }

    /**
     * Delete an appointment request (student can only delete pending requests).
     */
    public function deleteAppointmentRequest(Request $request, $id)
    {
        $user = $request->user();

        $appointmentRequest = CounselorRequest::where('student_id', $user->id)
            ->findOrFail($id);

        // Can only delete pending requests
        if ($appointmentRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Cannot delete a request that is not pending'
            ], 422);
        }

        $appointmentRequest->delete();

        return response()->json([
            'message' => 'Appointment request deleted',
        ]);
    }

    /**
     * Get list of available counselors.
     */
    public function getCounselors(Request $request)
    {
        $counselors = User::whereIn('role', ['guidance', 'counselor'])
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return response()->json([
            'message' => 'Counselors retrieved',
            'data' => $counselors,
        ]);
    }
}
