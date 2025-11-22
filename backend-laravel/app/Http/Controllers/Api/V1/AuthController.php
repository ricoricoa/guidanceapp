<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\LoginUserRequest;
use App\Http\Requests\Api\V1\RegisterUserRequest;
use App\Models\User;
use App\Models\LoginHistory;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

//php artisan make:controller Api/V1/AuthController
class AuthController extends Controller
{
    use ApiResponses;
    public function login(LoginUserRequest $request)
    {
        $request->validated($request->all());

        $credentials = $request->only('email', 'password');
        \Log::info('Login attempt', ['email' => $credentials['email']]);
        
        if (!Auth::attempt($credentials)) {
            \Log::warning('Login failed - invalid credentials', ['email' => $credentials['email']]);
            return $this->error('Invalid credentials', 401);
        }

        $user = Auth::user();
        \Log::info('Login successful', ['user_id' => $user->id, 'email' => $user->email, 'role' => $user->role]);
        
        // Record login history
        LoginHistory::create([
            'user_id' => $user->id,
            'login_time' => now(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
        
        // Create a Sanctum token for API authentication
        $token = $user->createToken('api-token')->plainTextToken;
        
        return $this->ok('Authenticated', [
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ]);
    }
    
    public function logout(Request $request)
    {
        $user = $request->user();
        
        // Update the latest login history record with logout time
        LoginHistory::where('user_id', $user->id)
            ->whereNull('logout_time')
            ->latest('login_time')
            ->first()
            ?->update(['logout_time' => now()]);
        
        // Delete the current token
        $user->currentAccessToken()->delete();

        return $this->ok('Logged out successfully');
    }

    public function register(RegisterUserRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'] ?? 'student',
            'password' => Hash::make($data['password']),
            'address' => $data['address'] ?? null,
            'counselor_id' => $data['counselor_id'] ?? null,
        ]);

        return $this->ok(
            'User registered successfully',
            ['user' => $user]
        );
    }



    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
