<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Get messages between student and counselor
     */
    public function getMessages($studentId, $counselorId, Request $request)
    {
        $user = $request->user();
        $studentId = (int) $studentId;
        $counselorId = (int) $counselorId;
        
        // Verify the user is either the student or counselor
        if ($user->id !== $studentId && $user->id !== $counselorId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $messages = Message::where(function ($query) use ($studentId, $counselorId) {
            $query->where('student_id', $studentId)
                  ->where('counselor_id', $counselorId);
        })
        ->orderBy('created_at', 'asc')
        ->get()
        ->map(function ($msg) {
            return [
                'id' => $msg->id,
                'sender' => $msg->sender,
                'text' => $msg->message,
                'timestamp' => $msg->created_at->format('H:i'),
                'created_at' => $msg->created_at,
            ];
        });

        return response()->json(['data' => $messages], 200);
    }

    /**
     * Send a message
     */
    public function sendMessage(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
        ]);

        // Determine sender and recipient
        $isStudent = $user->role === 'student';
        $isCounselor = in_array($user->role, ['counselor', 'guidance']);

        if (!$isStudent && !$isCounselor) {
            return response()->json(['message' => 'Invalid user role'], 400);
        }

        $studentId = $isStudent ? $user->id : $validated['recipient_id'];
        $counselorId = $isCounselor ? $user->id : $validated['recipient_id'];
        $sender = $isStudent ? 'student' : 'counselor';

        $message = Message::create([
            'student_id' => $studentId,
            'counselor_id' => $counselorId,
            'message' => $validated['message'],
            'sender' => $sender,
        ]);

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => [
                'id' => $message->id,
                'sender' => $message->sender,
                'text' => $message->message,
                'timestamp' => $message->created_at->format('H:i'),
                'created_at' => $message->created_at,
            ]
        ], 201);
    }

    /**
     * Mark messages as read
     */
    public function markAsRead($id, Request $request)
    {
        $user = $request->user();
        
        $message = Message::find($id);
        
        if (!$message) {
            return response()->json(['message' => 'Message not found'], 404);
        }

        // Verify user is either student or counselor in this conversation
        if ($user->id !== $message->student_id && $user->id !== $message->counselor_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message->update(['read' => true]);

        return response()->json(['message' => 'Message marked as read', 'data' => $message], 200);
    }

    /**
     * Get unread message count
     */
    public function getUnreadCount(Request $request)
    {
        $user = $request->user();
        $count = 0;

        if ($user->role === 'student') {
            $count = Message::where('student_id', $user->id)
                           ->where('sender', 'counselor')
                           ->where('read', false)
                           ->count();
        } elseif (in_array($user->role, ['counselor', 'guidance'])) {
            $count = Message::where('counselor_id', $user->id)
                           ->where('sender', 'student')
                           ->where('read', false)
                           ->count();
        }

        return response()->json(['unread_count' => $count], 200);
    }

    /**
     * Get all messages for current user
     */
    public function getUserMessages(Request $request)
    {
        $user = $request->user();
        
        $messages = collect();
        
        if ($user->role === 'student') {
            // Get all conversations with counselors
            $messages = Message::where('student_id', $user->id)
                ->with(['student', 'counselor'])
                ->orderBy('created_at', 'desc')
                ->get();
        } elseif (in_array($user->role, ['counselor', 'guidance'])) {
            // Get all conversations with students
            $messages = Message::where('counselor_id', $user->id)
                ->with(['student', 'counselor'])
                ->orderBy('created_at', 'desc')
                ->get();
        }

        $formatted = $messages->map(function ($msg) {
            return [
                'id' => $msg->id,
                'student_id' => $msg->student_id,
                'counselor_id' => $msg->counselor_id,
                'sender' => $msg->sender,
                'text' => $msg->message,
                'read' => $msg->read,
                'created_at' => $msg->created_at,
            ];
        });

        return response()->json(['data' => $formatted], 200);
    }
}
