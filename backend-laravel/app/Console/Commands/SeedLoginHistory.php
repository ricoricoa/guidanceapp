<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\LoginHistory;
use Illuminate\Console\Command;

class SeedLoginHistory extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:seed-login-history';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed login history for test accounts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Get existing users and create login history
        $users = User::whereIn('email', [
            'counselor1@example.com',
            'counselor2@example.com',
            'counselor3@example.com',
            'admin@example.com',
        ])->get();

        foreach ($users as $user) {
            // Check if already has login history
            if (LoginHistory::where('user_id', $user->id)->exists()) {
                $this->info("Login history already exists for " . $user->email);
                continue;
            }
            
            // Create various login history entries
            for ($i = 0; $i < 3; $i++) {
                LoginHistory::create([
                    'user_id' => $user->id,
                    'login_time' => now()->subDays($i)->subHours(rand(1, 12)),
                    'logout_time' => now()->subDays($i)->subHours(rand(1, 12))->addMinutes(rand(30, 180)),
                    'ip_address' => '127.0.0.' . rand(1, 255),
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                ]);
            }
            
            $this->info("✓ Login history created for " . $user->email);
        }

        $this->info("\nLogin history seeding completed!");
    }
}
