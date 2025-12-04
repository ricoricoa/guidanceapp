<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ReportController
{
    /**
     * Store a new report from a student
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            Log::info('Report submission attempt', ['user_id' => $user->id, 'user_email' => $user->email]);

            // Validate input
            $validated = $request->validate([
                'report_type' => 'required|string|in:bug,suggestion,feedback,other',
                'title' => 'required|string|max:100',
                'description' => 'required|string|max:500',
            ]);

            Log::info('Report validation passed', ['data' => $validated]);

            // Create report
            $report = Report::create([
                'user_id' => $user->id,
                'report_type' => $validated['report_type'],
                'title' => $validated['title'],
                'description' => $validated['description'],
                'status' => 'pending',
            ]);

            Log::info('Report created successfully', ['report_id' => $report->id, 'user_id' => $user->id]);

            // Load user relationship
            $report->load('user:id,name,email');

            return response()->json([
                'data' => $report,
                'message' => 'Report submitted successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Report validation failed', ['errors' => $e->errors()]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Report submission error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'message' => 'Error submitting report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all reports (Admin only)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Get all reports with user info
            $reports = Report::with('user:id,name,email')
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return response()->json([
                'data' => $reports,
                'message' => 'Reports retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving reports',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update report status (Admin only)
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => 'required|string|in:pending,reviewed,resolved,closed',
            ]);

            $report = Report::find($id);
            if (!$report) {
                return response()->json([
                    'message' => 'Report not found'
                ], 404);
            }

            $report->update(['status' => $validated['status']]);
            $report->load('user:id,name,email');

            return response()->json([
                'data' => $report,
                'message' => 'Report status updated successfully'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating report',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
