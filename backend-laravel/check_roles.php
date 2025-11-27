<?php
require_once 'vendor/autoload.php';
require_once 'bootstrap/app.php';

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Check existing roles
echo "=== CURRENT USERS BY ROLE ===\n\n";
$roles = ['admin', 'counselor', 'student'];
foreach ($roles as $role) {
    $count = User::where('role', $role)->count();
    echo "$role: $count users\n";
}

echo "\n=== ALL USERS ===\n";
$users = User::all()->map(function($u) {
    return [
        'id' => $u->id,
        'name' => $u->name,
        'email' => $u->email,
        'role' => $u->role,
    ];
});
foreach ($users as $user) {
    echo "ID: {$user['id']}, Name: {$user['name']}, Email: {$user['email']}, Role: {$user['role']}\n";
}

// Add test counselors if none exist
$counselorCount = User::where('role', 'counselor')->count();
if ($counselorCount === 0) {
    echo "\n=== ADDING TEST COUNSELORS ===\n";
    
    $counselors = [
        ['name' => 'John Counselor', 'email' => 'john.counselor@example.com', 'password' => 'password123'],
        ['name' => 'Maria Guidance', 'email' => 'maria.guidance@example.com', 'password' => 'password123'],
        ['name' => 'Dr. Santos', 'email' => 'dr.santos@example.com', 'password' => 'password123'],
    ];
    
    foreach ($counselors as $counselor) {
        $user = User::create([
            'name' => $counselor['name'],
            'email' => $counselor['email'],
            'password' => Hash::make($counselor['password']),
            'role' => 'counselor',
        ]);
        echo "Created: {$user->name} ({$user->email})\n";
    }
}

// Add test students if none exist
$studentCount = User::where('role', 'student')->count();
if ($studentCount === 0) {
    echo "\n=== ADDING TEST STUDENTS ===\n";
    
    // Get a counselor to assign
    $counselor = User::where('role', 'counselor')->first();
    $counselorId = $counselor ? $counselor->id : null;
    
    $students = [
        ['name' => 'Alice Student', 'email' => 'alice.student@example.com'],
        ['name' => 'Bob Smith', 'email' => 'bob.smith@example.com'],
        ['name' => 'Charlie Brown', 'email' => 'charlie.brown@example.com'],
        ['name' => 'Diana Prince', 'email' => 'diana.prince@example.com'],
    ];
    
    foreach ($students as $student) {
        $user = User::create([
            'name' => $student['name'],
            'email' => $student['email'],
            'password' => Hash::make('password123'),
            'role' => 'student',
            'counselor_id' => $counselorId,
        ]);
        echo "Created: {$user->name} ({$user->email})\n";
    }
}

echo "\n=== FINAL USER COUNT BY ROLE ===\n";
foreach ($roles as $role) {
    $count = User::where('role', $role)->count();
    echo "$role: $count users\n";
}
