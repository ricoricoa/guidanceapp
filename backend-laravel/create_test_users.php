<?php

require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';

use Illuminate\Contracts\Console\Kernel;
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "=== Creating Test Users ===\n\n";

// Delete existing test users to ensure clean state
User::where('email', 'like', '%@example.com')->delete();
User::where('email', '==', 'admin@example.com')->delete();

// Create admin
$admin = User::create([
    'name' => 'Admin User',
    'email' => 'admin@example.com',
    'password' => Hash::make('password123'),
    'role' => 'admin',
]);
echo "✓ Created admin: {$admin->email}\n";

// Create counselors
$counselors = [
    ['name' => 'John Counselor', 'email' => 'john@example.com'],
    ['name' => 'Maria Guidance', 'email' => 'maria@example.com'],
    ['name' => 'Dr. Santos', 'email' => 'santos@example.com'],
];

foreach ($counselors as $counselor) {
    $user = User::create([
        'name' => $counselor['name'],
        'email' => $counselor['email'],
        'password' => Hash::make('password123'),
        'role' => 'counselor',
    ]);
    echo "✓ Created counselor: {$user->email}\n";
}

// Create students
$students = [
    ['name' => 'Alice Student', 'email' => 'alice@example.com'],
    ['name' => 'Bob Smith', 'email' => 'bob@example.com'],
    ['name' => 'Charlie Brown', 'email' => 'charlie@example.com'],
    ['name' => 'Diana Prince', 'email' => 'diana@example.com'],
];

$counselor = User::where('role', 'counselor')->first();
foreach ($students as $student) {
    $user = User::create([
        'name' => $student['name'],
        'email' => $student['email'],
        'password' => Hash::make('password123'),
        'role' => 'student',
        'counselor_id' => $counselor->id,
    ]);
    echo "✓ Created student: {$user->email}\n";
}

echo "\n=== Final Count ===\n";
echo "Admins: " . User::where('role', 'admin')->count() . "\n";
echo "Counselors: " . User::where('role', 'counselor')->count() . "\n";
echo "Students: " . User::where('role', 'student')->count() . "\n";
echo "Total: " . User::count() . "\n";
