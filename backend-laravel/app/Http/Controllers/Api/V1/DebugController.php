<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;

class DebugController extends Controller
{
    public function getUserInfo(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'role_check_counselor' => ($user->role === 'counselor'),
                'role_check_student' => ($user->role === 'student'),
            ],
            'message' => 'Current user info'
        ]);
    }

    public function allUsers()
    {
        $users = \App\Models\User::select('id', 'name', 'email', 'role')->get();
        return response()->json([
            'users' => $users,
            'count' => count($users)
        ]);
    }
}
?>
