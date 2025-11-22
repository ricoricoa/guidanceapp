<?php
require 'vendor/autoload.php';

use App\Models\User;
use App\Models\LoginHistory;

$app = require_once 'bootstrap/app.php';

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
    
    echo "✓ Login history created for " . $user->email . "\n";
}

echo "\nLogin history seeding completed!\n";
