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
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailVerification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

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
        // Create user but don't auto-verify email yet
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'] ?? 'student',
            'password' => Hash::make($data['password']),
            'address' => $data['address'] ?? null,
            'counselor_id' => $data['counselor_id'] ?? null,
        ]);

        // Generate 6-digit OTP
        $code = str_pad((string) rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiry = Carbon::now()->addMinutes(15);

        $user->email_verification_code = $code;
        $user->email_verification_expires_at = $expiry;
        $user->save();

        // Send verification email (best-effort)
        try {
            Mail::to($user->email)->send(new EmailVerification($code));
        } catch (\Exception $e) {
            \Log::error('Failed to send verification email', ['error' => $e->getMessage()]);
        }

        return $this->ok(
            'User registered successfully. Please check your MinSU email for the verification code.',
            ['user' => ['id' => $user->id, 'email' => $user->email]]
        );
    }

    /**
     * Verify email with OTP code and issue token
     */
    public function verifyEmail(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->input('email'))->first();
        if (!$user) {
            return $this->error('User not found', 404);
        }

        if (!$user->email_verification_code || !$user->email_verification_expires_at) {
            return $this->error('No verification code found. Please request a new code.', 400);
        }

        if (Carbon::now()->gt(Carbon::parse($user->email_verification_expires_at))) {
            return $this->error('Verification code expired. Please request a new code.', 400);
        }

        if (hash_equals($user->email_verification_code, $request->input('code'))) {
            $user->email_verified_at = Carbon::now();
            $user->email_verification_code = null;
            $user->email_verification_expires_at = null;
            $user->save();

            // Issue token upon verification
            $token = $user->createToken('api-token')->plainTextToken;

            return $this->ok('Email verified', ['token' => $token, 'user' => $user]);
        }

        return $this->error('Invalid verification code', 400);
    }

    /**
     * Resend verification OTP
     */
    public function resendVerification(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        $user = User::where('email', $request->input('email'))->first();
        if (!$user) {
            return $this->error('User not found', 404);
        }

        // Generate new code
        $code = str_pad((string) rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiry = Carbon::now()->addMinutes(15);

        $user->email_verification_code = $code;
        $user->email_verification_expires_at = $expiry;
        $user->save();

        try {
            Mail::to($user->email)->send(new EmailVerification($code));
        } catch (\Exception $e) {
            \Log::error('Failed to resend verification email', ['error' => $e->getMessage()]);
        }

        return $this->ok('Verification code resent');
    }

    /**
     * Send password reset link to a user's email
     */
    public function sendPasswordReset(Request $request)
    {
        $request->validate(['email' => ['required','email']]);
        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return $this->ok('Password reset link sent');
        }

        return $this->error('Unable to send password reset link', 500);
    }

    /**
     * Reset user's password using token
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->ok('Password has been reset');
        }

        return $this->error('Failed to reset password', 400);
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
