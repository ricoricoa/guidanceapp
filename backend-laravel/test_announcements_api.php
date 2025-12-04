<?php

// Test API endpoint
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Route;

try {
    // Get counselor 
    $counselor = User::where('role', 'counselor')->first();
    
    if (!$counselor) {
        echo "No counselor found\n";
        exit(1);
    }
    
    echo "Testing API for Counselor: " . $counselor->name . " (ID: " . $counselor->id . ")\n";
    echo "====================================\n\n";
    
    // Create a mock request to test the controller
    $request = app('Illuminate\Http\Request');
    $request->setUserResolver(function () use ($counselor) {
        return $counselor;
    });
    
    // Create controller instance
    $controller = new \App\Http\Controllers\Api\V1\AnnouncementController();
    
    // Call the method
    $response = $controller->getCounselorAnnouncements($request);
    
    // Get response data
    $data = json_decode($response->getContent(), true);
    
    echo "API Response Status: " . $response->getStatusCode() . "\n";
    echo "Message: " . $data['message'] . "\n";
    echo "Announcements Count: " . count($data['data']['data']) . "\n";
    echo "\nAnnouncements:\n";
    
    foreach ($data['data']['data'] as $announcement) {
        echo "  - " . $announcement['title'] . " (" . $announcement['category'] . ")\n";
    }
    
    echo "\nFull Response Structure:\n";
    echo json_encode($data, JSON_PRETTY_PRINT);
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
