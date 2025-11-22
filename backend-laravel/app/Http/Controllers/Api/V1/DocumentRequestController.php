<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DocumentRequest;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DocumentRequestController extends Controller
{
    use ApiResponses;

    /**
     * Get all document requests for authenticated user
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return $this->error('Unauthenticated', 401);
        }

        $requests = DocumentRequest::where('user_id', $user->id)
            ->orderBy('submitted_at', 'desc')
            ->get();

        return $this->ok('Document requests retrieved successfully', [
            'requests' => $requests,
        ]);
    }

    /**
     * Create a new document request
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return $this->error('Unauthenticated', 401);
        }

        $validated = $request->validate([
            'request_type' => 'required|in:good_moral,referral,certificate',
            'purpose' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $documentRequest = DocumentRequest::create([
            'user_id' => $user->id,
            'request_type' => $validated['request_type'],
            'purpose' => $validated['purpose'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
            'remarks' => 'Awaiting processing',
        ]);

        return $this->ok('Document request submitted successfully', [
            'request' => $documentRequest,
        ], 201);
    }

    /**
     * Get a specific document request
     */
    public function show(string $id)
    {
        $user = Auth::user();
        if (!$user) {
            return $this->error('Unauthenticated', 401);
        }

        $documentRequest = DocumentRequest::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$documentRequest) {
            return $this->error('Document request not found', 404);
        }

        return $this->ok('Document request retrieved successfully', [
            'request' => $documentRequest,
        ]);
    }

    /**
     * Update a document request (admin/counselor only)
     */
    public function update(Request $request, string $id)
    {
        $documentRequest = DocumentRequest::findOrFail($id);

        $validated = $request->validate([
            'status' => 'nullable|in:pending,approved,rejected,completed',
            'remarks' => 'nullable|string|max:255',
        ]);

        if (isset($validated['status'])) {
            $documentRequest->status = $validated['status'];
        }

        if (isset($validated['remarks'])) {
            $documentRequest->remarks = $validated['remarks'];
        }

        if ($validated['status'] === 'completed') {
            $documentRequest->completed_at = now();
        }

        $documentRequest->save();

        return $this->ok('Document request updated successfully', [
            'request' => $documentRequest,
        ]);
    }

    /**
     * Delete a document request
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        if (!$user) {
            return $this->error('Unauthenticated', 401);
        }

        $documentRequest = DocumentRequest::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$documentRequest) {
            return $this->error('Document request not found', 404);
        }

        $documentRequest->delete();

        return $this->ok('Document request deleted successfully');
    }

    /**
     * Approve a document request (counselor only)
     */
    public function approve(Request $request, string $id)
    {
        $documentRequest = DocumentRequest::findOrFail($id);

        $validated = $request->validate([
            'remarks' => 'nullable|string|max:255',
        ]);

        $documentRequest->status = 'approved';
        $documentRequest->remarks = $validated['remarks'] ?? 'Approved by counselor';
        $documentRequest->save();

        return $this->ok('Document request approved successfully', [
            'request' => $documentRequest,
        ]);
    }

    /**
     * Reject a document request (counselor only)
     */
    public function reject(Request $request, string $id)
    {
        $documentRequest = DocumentRequest::findOrFail($id);

        $validated = $request->validate([
            'remarks' => 'required|string|max:255',
        ]);

        $documentRequest->status = 'rejected';
        $documentRequest->remarks = $validated['remarks'];
        $documentRequest->save();

        return $this->ok('Document request rejected successfully', [
            'request' => $documentRequest,
        ]);
    }
}
