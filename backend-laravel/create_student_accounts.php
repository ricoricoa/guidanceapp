<?php

// Create test student accounts
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

try {
    // Create Student 1
    $student1 = User::firstOrCreate(
        ['email' => 'student1@example.com'],
        [
            'name' => 'John Doe',
            'email' => 'student1@example.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'address' => '123 Student St',
        ]
    );
    echo "✓ Student 1 created: " . $student1->email . " (Password: password)\n";

    // Create Student 2
    $student2 = User::firstOrCreate(
        ['email' => 'student2@example.com'],
        [
            'name' => 'Jane Smith',
            'email' => 'student2@example.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'address' => '456 Student Ave',
        ]
    );
    echo "✓ Student 2 created: " . $student2->email . " (Password: password)\n";

    // Create Student 3
    $student3 = User::firstOrCreate(
        ['email' => 'student3@example.com'],
        [
            'name' => 'Mark Johnson',
            'email' => 'student3@example.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'address' => '789 Education Way',
        ]
    );
    echo "✓ Student 3 created: " . $student3->email . " (Password: password)\n";

    // Create Student 4
    $student4 = User::firstOrCreate(
        ['email' => 'student4@example.com'],
        [
            'name' => 'Sarah Williams',
            'email' => 'student4@example.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'address' => '321 Campus Drive',
        ]
    );
    echo "✓ Student 4 created: " . $student4->email . " (Password: password)\n";

    // Create Student 5
    $student5 = User::firstOrCreate(
        ['email' => 'student5@example.com'],
        [
            'name' => 'Michael Brown',
            'email' => 'student5@example.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'address' => '654 University Blvd',
        ]
    );
    echo "✓ Student 5 created: " . $student5->email . " (Password: password)\n";

    echo "\n====== Test Student Accounts Created ======\n";
    echo "Login with these credentials:\n\n";
    echo "STUDENT 1:\n";
    echo "  Email: student1@example.com\n";
    echo "  Password: password\n\n";
    echo "STUDENT 2:\n";
    echo "  Email: student2@example.com\n";
    echo "  Password: password\n\n";
    echo "STUDENT 3:\n";
    echo "  Email: student3@example.com\n";
    echo "  Password: password\n\n";
    echo "STUDENT 4:\n";
    echo "  Email: student4@example.com\n";
    echo "  Password: password\n\n";
    echo "STUDENT 5:\n";
    echo "  Email: student5@example.com\n";
    echo "  Password: password\n";
    echo "===========================================\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
