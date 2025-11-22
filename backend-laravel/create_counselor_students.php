<?php

require 'vendor/autoload.php';
require 'bootstrap/app.php';

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Create Laravel app instance
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Find or create a counselor
$counselor = User::where('email', 'counselor1@example.com')->first();
if (!$counselor) {
    $counselor = User::create([
        'name' => 'Maria Santos',
        'email' => 'counselor1@example.com',
        'password' => Hash::make('password123'),
        'role' => 'guidance',
    ]);
    echo "✓ Created counselor: {$counselor->name}\n";
} else {
    echo "✓ Counselor already exists: {$counselor->name}\n";
}

// Create students assigned to this counselor
$studentsData = [
    ['name' => 'Juan Dela Cruz', 'email' => 'juan.delcruz@example.com'],
    ['name' => 'Maria Santos Student', 'email' => 'maria.santos.student@example.com'],
    ['name' => 'Pedro Reyes', 'email' => 'pedro.reyes@example.com'],
    ['name' => 'Rosa Garcia', 'email' => 'rosa.garcia@example.com'],
    ['name' => 'Carlos Martinez', 'email' => 'carlos.martinez@example.com'],
];

foreach ($studentsData as $studentData) {
    $student = User::where('email', $studentData['email'])->first();
    if (!$student) {
        $student = User::create([
            'name' => $studentData['name'],
            'email' => $studentData['email'],
            'password' => Hash::make('password123'),
            'role' => 'student',
            'counselor_id' => $counselor->id,
        ]);
        echo "✓ Created student: {$student->name} (assigned to {$counselor->name})\n";
    } else {
        if ($student->counselor_id !== $counselor->id) {
            $student->update(['counselor_id' => $counselor->id]);
            echo "✓ Updated student: {$student->name} (assigned to {$counselor->name})\n";
        } else {
            echo "✓ Student already exists: {$student->name}\n";
        }
    }
}

echo "\n✅ Test data created successfully!\n";
echo "Counselor email: {$counselor->email}\n";
echo "Counselor password: password123\n";
echo "Student email examples: juan.delcruz@example.com, maria.santos.student@example.com\n";
