<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\CertificateRequest;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CertificateController extends Controller
{
    /**
     * Store a new certificate request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'certificate_type' => 'required|in:Good Moral,Referral',
            'purpose' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            $certificateRequest = CertificateRequest::create([
                'user_id' => $request->user()->id,
                'certificate_type' => $validated['certificate_type'],
                'purpose' => $validated['purpose'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'status' => 'pending',
                'submitted_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Certificate request submitted successfully',
                'data' => $certificateRequest
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create certificate request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all certificate requests for a student
     */
    public function getStudentRequests(Request $request)
    {
        try {
            $requests = CertificateRequest::where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $requests
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch certificate requests',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all certificate requests for counselor to review
     */
    public function getCounselorRequests(Request $request)
    {
        try {
            $requests = CertificateRequest::with('student')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($request) {
                    return [
                        'id' => $request->id,
                        'student_name' => $request->student->name ?? 'Unknown',
                        'student_email' => $request->student->email ?? 'N/A',
                        'certificate_type' => $request->certificate_type,
                        'request_type' => $request->certificate_type,
                        'status' => $request->status,
                        'submitted_at' => $request->submitted_at,
                        'notes' => $request->notes,
                        'counselor_remarks' => $request->counselor_remarks,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $requests
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch certificate requests',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a single certificate request
     */
    public function show($id)
    {
        try {
            $request = CertificateRequest::with('student')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $request
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Certificate request not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update certificate request status
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected,completed',
            'counselor_remarks' => 'nullable|string',
        ]);

        try {
            $certRequest = CertificateRequest::findOrFail($id);
            $certRequest->status = $validated['status'];
            $certRequest->counselor_remarks = $validated['counselor_remarks'] ?? $certRequest->counselor_remarks;
            
            if ($validated['status'] === 'completed') {
                $certRequest->completed_at = now();
            }
            
            $certRequest->save();

            return response()->json([
                'success' => true,
                'message' => 'Certificate request updated successfully',
                'data' => $certRequest
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update certificate request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve certificate request
     */
    public function approve(Request $request, $id)
    {
        $validated = $request->validate([
            'counselor_remarks' => 'nullable|string',
        ]);

        try {
            $certRequest = CertificateRequest::findOrFail($id);
            $certRequest->status = 'approved';
            $certRequest->counselor_remarks = $validated['counselor_remarks'] ?? null;
            $certRequest->save();

            return response()->json([
                'success' => true,
                'message' => 'Certificate request approved',
                'data' => $certRequest
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve certificate request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject certificate request
     */
    public function reject(Request $request, $id)
    {
        $validated = $request->validate([
            'counselor_remarks' => 'nullable|string',
        ]);

        try {
            $certRequest = CertificateRequest::findOrFail($id);
            $certRequest->status = 'rejected';
            $certRequest->counselor_remarks = $validated['counselor_remarks'] ?? null;
            $certRequest->save();

            return response()->json([
                'success' => true,
                'message' => 'Certificate request rejected',
                'data' => $certRequest
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject certificate request',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
