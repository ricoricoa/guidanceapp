<?php

// Create announcement for the student's actual counselor
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Announcement;

try {
    // Get a student
    $student = User::where('role', 'student')->first();
    
    if (!$student) {
        echo "No student found\n";
        exit(1);
    }
    
    // Get student's counselor
    $counselor = User::find($student->counselor_id);
    
    if (!$counselor) {
        echo "Student has no counselor assigned\n";
        exit(1);
    }
    
    echo "Creating announcement for Counselor: " . $counselor->name . "\n";
    
    // Create announcement for student's counselor
    $announcement = Announcement::create([
        'counselor_id' => $counselor->id,
        'title' => 'Wellness Tips for Mental Health',
        'content' => 'Remember to take time for yourself. Meditation, exercise, and spending time with loved ones are great ways to maintain your mental health.',
        'category' => 'tips',
        'is_active' => true,
        'published_at' => now(),
    ]);
    
    echo "✓ Announcement created!\n";
    echo "Student " . $student->name . " should now see this in their announcements\n";
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
