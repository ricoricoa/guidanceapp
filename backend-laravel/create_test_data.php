<?php

require 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Create a counselor
$counselor = User::firstOrCreate(
    ['email' => 'counselor1@example.com'],
    [
        'name' => 'Maria Santos',
        'password' => Hash::make('password123'),
        'role' => 'guidance',
    ]
);
echo "✓ Counselor: {$counselor->email}\n";

// Create students
$students = [
    ['name' => 'Juan Dela Cruz', 'email' => 'juan@example.com'],
    ['name' => 'Maria Student', 'email' => 'maria.student@example.com'],
    ['name' => 'Pedro Reyes', 'email' => 'pedro@example.com'],
    ['name' => 'Rosa Garcia', 'email' => 'rosa@example.com'],
];

foreach ($students as $data) {
    $student = User::firstOrCreate(
        ['email' => $data['email']],
        [
            'name' => $data['name'],
            'password' => Hash::make('password123'),
            'role' => 'student',
        ]
    );
    echo "✓ Student: {$student->email}\n";
}

echo "\n✅ Test accounts created!\n";
echo "Counselor: counselor1@example.com / password123\n";
echo "Student: juan@example.com / password123\n";
