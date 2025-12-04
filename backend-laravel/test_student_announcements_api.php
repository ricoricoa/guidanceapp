<?php

// Test student announcements API
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

try {
    // Get a student
    $student = User::where('role', 'student')->with('counselor')->first();
    
    if (!$student) {
        echo "No student found\n";
        exit(1);
    }
    
    echo "Testing Student Announcements API\n";
    echo "Student: " . $student->name . " (ID: " . $student->id . ")\n";
    echo "Counselor ID: " . $student->counselor_id . "\n";
    echo "====================================\n\n";
    
    // Create a mock request
    $request = app('Illuminate\Http\Request');
    $request->setUserResolver(function () use ($student) {
        return $student;
    });
    
    // Create controller instance
    $controller = new \App\Http\Controllers\Api\V1\AnnouncementController();
    
    // Call the method
    $response = $controller->getForStudent($request);
    
    // Get response data
    $data = json_decode($response->getContent(), true);
    
    echo "API Response Status: " . $response->getStatusCode() . "\n";
    echo "Message: " . $data['message'] . "\n";
    echo "Announcements Count: " . count($data['data']['data']) . "\n";
    echo "\nAnnouncements:\n";
    
    foreach ($data['data']['data'] as $announcement) {
        echo "  - " . $announcement['title'] . " (" . $announcement['category'] . ")\n";
    }
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
