<?php

// Quick test script to create a test announcement
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Announcement;
use App\Models\User;

try {
    // Get first counselor
    $counselor = User::where('role', 'counselor')->first();
    
    if (!$counselor) {
        echo "No counselor found. Creating test data...\n";
        exit(1);
    }
    
    echo "Creating test announcement for counselor: " . $counselor->name . "\n";
    
    // Create test announcement
    $announcement = Announcement::create([
        'counselor_id' => $counselor->id,
        'title' => 'Welcome to Announcements!',
        'content' => 'This is a test announcement. Your students will see important news, wellness tips, and alerts here.',
        'category' => 'news',
        'is_active' => true,
        'published_at' => now(),
    ]);
    
    echo "✓ Announcement created successfully!\n";
    echo "Announcement ID: " . $announcement->id . "\n";
    echo "Title: " . $announcement->title . "\n";
    echo "Category: " . $announcement->category . "\n";
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}
