<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Announcement;
use App\Models\AnnouncementReaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;

class AnnouncementReactionController
{
    /**
     * Get all reactions for an announcement, grouped by emoji
     */
    public function getReactions($announcementId): JsonResponse
    {
        try {
            $reactions = AnnouncementReaction::where('announcement_id', $announcementId)
                ->with('user:id,name,email')
                ->get();

            // Group reactions by emoji and count
            $grouped = $reactions->groupBy('emoji')->map(function ($group) {
                return [
                    'emoji' => $group->first()->emoji,
                    'count' => $group->count(),
                    'users' => $group->map(fn($r) => [
                        'id' => $r->user->id,
                        'name' => $r->user->name,
                    ])->values(),
                ];
            })->values();

            return response()->json([
                'data' => $grouped,
                'message' => 'Reactions retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving reactions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add or remove a reaction
     */
    public function toggleReaction(Request $request, $announcementId): JsonResponse
    {
        try {
            $user = $request->user();

            // Validate input
            $validated = $request->validate([
                'emoji' => 'required|string|max:4', // Support multi-char emojis
            ]);

            // Check if announcement exists
            $announcement = Announcement::find($announcementId);
            if (!$announcement) {
                return response()->json([
                    'message' => 'Announcement not found'
                ], 404);
            }

            // Check if user already has ANY reaction on this announcement
            $userReaction = AnnouncementReaction::where('announcement_id', $announcementId)
                ->where('user_id', $user->id)
                ->first();

            if ($userReaction) {
                // If reacting with same emoji, remove it
                if ($userReaction->emoji === $validated['emoji']) {
                    $userReaction->delete();
                    $action = 'removed';
                } else {
                    // If reacting with different emoji, replace it
                    $userReaction->update(['emoji' => $validated['emoji']]);
                    $action = 'changed';
                }
            } else {
                // Add new reaction if user has none
                try {
                    AnnouncementReaction::create([
                        'announcement_id' => $announcementId,
                        'user_id' => $user->id,
                        'emoji' => $validated['emoji'],
                    ]);
                    $action = 'added';
                } catch (QueryException $e) {
                    // Handle unique constraint violation
                    return response()->json([
                        'message' => 'You already have a reaction on this announcement'
                    ], 409);
                }
            }

            // Get updated reactions
            $reactions = AnnouncementReaction::where('announcement_id', $announcementId)
                ->with('user:id,name,email')
                ->get();

            $grouped = $reactions->groupBy('emoji')->map(function ($group) {
                return [
                    'emoji' => $group->first()->emoji,
                    'count' => $group->count(),
                    'users' => $group->map(fn($r) => [
                        'id' => $r->user->id,
                        'name' => $r->user->name,
                    ])->values(),
                ];
            })->values();

            return response()->json([
                'data' => $grouped,
                'message' => 'Reaction ' . $action . ' successfully'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error toggling reaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
