<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CounselorReview;
use App\Models\User;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Get all counselors (guidance staff)
     */
    public function getCounselors()
    {
        $counselors = User::where('role', 'guidance')
            ->orWhere('role', 'counselor')
            ->select('id', 'name', 'email', 'bio')
            ->withAvg('reviews', 'rating') // Get average rating
            ->withCount('reviews') // Get review count
            ->get()
            ->map(function ($counselor) {
                return [
                    'id' => $counselor->id,
                    'name' => $counselor->name,
                    'email' => $counselor->email,
                    'bio' => $counselor->bio ?? '',
                    'average_rating' => round($counselor->reviews_avg_rating ?? 0, 2),
                    'review_count' => $counselor->reviews_count ?? 0,
                ];
            });

        return response()->json([
            'data' => $counselors,
            'message' => 'Counselors retrieved successfully',
            'status' => 200,
        ]);
    }

    /**
     * Store a review for a counselor
     */
    public function storeReview(Request $request)
    {
        $user = $request->user();

        // Only students can submit reviews
        if ($user->role !== 'student') {
            return response()->json([
                'message' => 'Only students can submit reviews',
            ], 403);
        }

        $validated = $request->validate([
            'counselor_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Check if counselor exists and has guidance/counselor role
        $counselor = User::find($validated['counselor_id']);
        if (!$counselor || ($counselor->role !== 'guidance' && $counselor->role !== 'counselor')) {
            return response()->json([
                'message' => 'Invalid counselor',
            ], 404);
        }

        // Update or create review (upsert)
        $review = CounselorReview::updateOrCreate(
            [
                'student_id' => $user->id,
                'counselor_id' => $validated['counselor_id'],
            ],
            [
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? null,
            ]
        );

        return response()->json([
            'data' => $review,
            'message' => 'Review submitted successfully',
            'status' => 200,
        ]);
    }

    /**
     * Get all reviews (for admin dashboard)
     */
    public function getAllReviews()
    {
        $reviews = CounselorReview::with([
            'student:id,name,email',
            'counselor:id,name,email,role'
        ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'student_name' => $review->student->name ?? 'Unknown',
                    'student_email' => $review->student->email ?? '',
                    'counselor_name' => $review->counselor->name ?? 'Unknown',
                    'counselor_email' => $review->counselor->email ?? '',
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'submitted_at' => $review->created_at,
                    'updated_at' => $review->updated_at,
                ];
            });

        return response()->json([
            'data' => $reviews,
            'message' => 'All reviews retrieved successfully',
            'status' => 200,
        ]);
    }

    /**
     * Get reviews for a specific counselor
     */
    public function getCounselorReviews($counselorId)
    {
        $counselor = User::find($counselorId);

        if (!$counselor || ($counselor->role !== 'guidance' && $counselor->role !== 'counselor')) {
            return response()->json([
                'message' => 'Counselor not found',
            ], 404);
        }

        $reviews = CounselorReview::where('counselor_id', $counselorId)
            ->with('student:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'student_name' => $review->student->name ?? 'Unknown',
                    'student_email' => $review->student->email ?? '',
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'submitted_at' => $review->created_at,
                ];
            });

        $averageRating = CounselorReview::where('counselor_id', $counselorId)
            ->avg('rating');

        return response()->json([
            'data' => [
                'counselor_name' => $counselor->name,
                'average_rating' => round($averageRating ?? 0, 2),
                'review_count' => count($reviews),
                'reviews' => $reviews,
            ],
            'message' => 'Counselor reviews retrieved successfully',
            'status' => 200,
        ]);
    }

    /**
     * Get student's own review (if exists)
     */
    public function getStudentReview(Request $request, $counselorId)
    {
        $user = $request->user();

        $review = CounselorReview::where('student_id', $user->id)
            ->where('counselor_id', $counselorId)
            ->first();

        if (!$review) {
            return response()->json([
                'data' => null,
                'message' => 'No review found',
                'status' => 200,
            ]);
        }

        return response()->json([
            'data' => [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'submitted_at' => $review->created_at,
            ],
            'message' => 'Review retrieved successfully',
            'status' => 200,
        ]);
    }
}
