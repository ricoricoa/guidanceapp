<?php

// Create test accounts for counselor and admin
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

try {
    // Create Counselor Account 1
    $counselor1 = User::firstOrCreate(
        ['email' => 'counselor1@example.com'],
        [
            'name' => 'Maria Santos',
            'email' => 'counselor1@example.com',
            'password' => Hash::make('password123'),
            'role' => 'guidance',
            'address' => '123 Counselor St',
        ]
    );
    echo "✓ Counselor 1 created: " . $counselor1->email . " (Password: password123)\n";

    // Create Counselor Account 2
    $counselor2 = User::firstOrCreate(
        ['email' => 'counselor2@example.com'],
        [
            'name' => 'John Cruz',
            'email' => 'counselor2@example.com',
            'password' => Hash::make('password123'),
            'role' => 'guidance',
            'address' => '456 Guidance Ave',
        ]
    );
    echo "✓ Counselor 2 created: " . $counselor2->email . " (Password: password123)\n";

    // Create Counselor Account 3
    $counselor3 = User::firstOrCreate(
        ['email' => 'counselor3@example.com'],
        [
            'name' => 'Anna Garcia',
            'email' => 'counselor3@example.com',
            'password' => Hash::make('password123'),
            'role' => 'guidance',
            'address' => '789 Support Road',
        ]
    );
    echo "✓ Counselor 3 created: " . $counselor3->email . " (Password: password123)\n";

    // Create Admin Account
    $admin = User::firstOrCreate(
        ['email' => 'admin@example.com'],
        [
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'address' => 'Admin Building',
        ]
    );
    echo "✓ Admin account created: " . $admin->email . " (Password: password123)\n";

    echo "\n====== Test Accounts Created ======\n";
    echo "Login with these credentials:\n\n";
    echo "COUNSELOR 1:\n";
    echo "  Email: counselor1@example.com\n";
    echo "  Password: password123\n\n";
    echo "COUNSELOR 2:\n";
    echo "  Email: counselor2@example.com\n";
    echo "  Password: password123\n\n";
    echo "COUNSELOR 3:\n";
    echo "  Email: counselor3@example.com\n";
    echo "  Password: password123\n\n";
    echo "ADMIN:\n";
    echo "  Email: admin@example.com\n";
    echo "  Password: password123\n";
    echo "====================================\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
