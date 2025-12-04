<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Announcement;
use App\Models\AnnouncementComment;
use App\Models\AnnouncementReaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AnnouncementCommentController
{
    /**
     * Get all comments for an announcement
     */
    public function getComments($announcementId): JsonResponse
    {
        try {
            $comments = AnnouncementComment::where('announcement_id', $announcementId)
                ->with('user:id,name,email,profile_picture')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'data' => $comments,
                'message' => 'Comments retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving comments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add a comment to an announcement
     */
    public function addComment(Request $request, $announcementId): JsonResponse
    {
        try {
            $user = $request->user();

            // Validate input
            $validated = $request->validate([
                'content' => 'required|string|min:1|max:1000',
            ]);

            // Check if announcement exists
            $announcement = Announcement::find($announcementId);
            if (!$announcement) {
                return response()->json([
                    'message' => 'Announcement not found'
                ], 404);
            }

            // Create comment
            $comment = AnnouncementComment::create([
                'announcement_id' => $announcementId,
                'user_id' => $user->id,
                'content' => $validated['content'],
            ]);

            // Load user relationship
            $comment->load('user:id,name,email,profile_picture');

            return response()->json([
                'data' => $comment,
                'message' => 'Comment added successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error adding comment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a comment
     */
    public function updateComment(Request $request, $commentId): JsonResponse
    {
        try {
            $user = $request->user();

            // Find comment
            $comment = AnnouncementComment::find($commentId);
            if (!$comment) {
                return response()->json([
                    'message' => 'Comment not found'
                ], 404);
            }

            // Check if user owns this comment
            if ($comment->user_id !== $user->id) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Validate input
            $validated = $request->validate([
                'content' => 'required|string|min:1|max:1000',
            ]);

            // Update comment
            $comment->update($validated);
            $comment->load('user:id,name,email,profile_picture');

            return response()->json([
                'data' => $comment,
                'message' => 'Comment updated successfully'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating comment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a comment
     */
    public function deleteComment(Request $request, $commentId): JsonResponse
    {
        try {
            $user = $request->user();

            // Find comment
            $comment = AnnouncementComment::find($commentId);
            if (!$comment) {
                return response()->json([
                    'message' => 'Comment not found'
                ], 404);
            }

            // Check if user owns this comment
            if ($comment->user_id !== $user->id) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Soft delete the comment
            $comment->delete();

            return response()->json([
                'message' => 'Comment deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting comment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
