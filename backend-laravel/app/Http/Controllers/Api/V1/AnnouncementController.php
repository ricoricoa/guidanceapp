<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AnnouncementController
{
    /**
     * Get all announcements for a specific counselor's students
     */
    public function getForStudent(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Check if user is a student
            if ($user->role !== 'student') {
                return response()->json([
                    'message' => 'Only students can view announcements'
                ], 403);
            }

            // Get all active announcements from all counselors
            $announcements = Announcement::where(function($query) use ($user) {
                // Either show all active announcements, or if user has counselor_id, show theirs + all other counselors
                if ($user->counselor_id) {
                    // Show announcements from their counselor and all other counselors
                    $query->where('counselor_id', $user->counselor_id)
                        ->orWhereIn('counselor_id', function($subQuery) {
                            $subQuery->select('id')->from('users')->where('role', 'counselor');
                        });
                } else {
                    // If no counselor assigned, show all announcements from all counselors
                    $query->whereIn('counselor_id', function($subQuery) {
                        $subQuery->select('id')->from('users')->where('role', 'counselor');
                    });
                }
            })
                ->with('counselor')
                ->active()
                ->published()
                ->orderBy('published_at', 'desc')
                ->paginate(10);

            return response()->json([
                'data' => $announcements,
                'message' => 'Announcements retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving announcements',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new announcement (Counselor only)
     */
    public function create(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            // Check if user is a counselor or guidance officer
            if ($user->role !== 'counselor' && $user->role !== 'guidance') {
                return response()->json([
                    'message' => 'Only counselors can create announcements'
                ], 403);
            }

            // Validate input
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'category' => 'required|string|in:news,tips,alert,general',
                'is_active' => 'boolean',
            ]);

            // Create announcement
            $announcement = Announcement::create([
                'counselor_id' => $user->id,
                'title' => $validated['title'],
                'content' => $validated['content'],
                'category' => $validated['category'],
                'is_active' => $validated['is_active'] ?? true,
                'published_at' => now(),
            ]);

            return response()->json([
                'data' => $announcement,
                'message' => 'Announcement created successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating announcement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all announcements created by the authenticated counselor
     */
    public function getCounselorAnnouncements(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            // Check if user is a counselor or guidance officer
            if ($user->role !== 'counselor' && $user->role !== 'guidance') {
                return response()->json([
                    'message' => 'Only counselors can view their announcements'
                ], 403);
            }

            // Get all announcements by this counselor with counselor relationship
            $announcements = Announcement::where('counselor_id', $user->id)
                ->with('counselor')
                ->orderBy('published_at', 'desc')
                ->paginate(10);

            return response()->json([
                'data' => $announcements,
                'message' => 'Announcements retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving announcements',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an announcement
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $user = $request->user();

            // Check if user is a counselor or guidance officer
            if ($user->role !== 'counselor' && $user->role !== 'guidance') {
                return response()->json([
                    'message' => 'Only counselors can update announcements'
                ], 403);
            }

            // Find announcement
            $announcement = Announcement::find($id);

            if (!$announcement) {
                return response()->json([
                    'message' => 'Announcement not found'
                ], 404);
            }

            // Check if counselor owns this announcement
            if ($announcement->counselor_id !== $user->id) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Validate input
            $validated = $request->validate([
                'title' => 'string|max:255',
                'content' => 'string',
                'category' => 'string|in:news,tips,alert,general',
                'is_active' => 'boolean',
            ]);

            // Update announcement
            $announcement->update($validated);

            return response()->json([
                'data' => $announcement,
                'message' => 'Announcement updated successfully'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating announcement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an announcement
     */
    public function delete(Request $request, $id): JsonResponse
    {
        try {
            $user = $request->user();

            // Check if user is a counselor or guidance officer
            if ($user->role !== 'counselor' && $user->role !== 'guidance') {
                return response()->json([
                    'message' => 'Only counselors can delete announcements'
                ], 403);
            }

            // Find announcement
            $announcement = Announcement::find($id);

            if (!$announcement) {
                return response()->json([
                    'message' => 'Announcement not found'
                ], 404);
            }

            // Check if counselor owns this announcement
            if ($announcement->counselor_id !== $user->id) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Delete announcement
            $announcement->delete();

            return response()->json([
                'message' => 'Announcement deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting announcement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single announcement
     */
    public function show($id): JsonResponse
    {
        try {
            $announcement = Announcement::with('counselor')->find($id);

            if (!$announcement) {
                return response()->json([
                    'message' => 'Announcement not found'
                ], 404);
            }

            return response()->json([
                'data' => $announcement,
                'message' => 'Announcement retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving announcement',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
