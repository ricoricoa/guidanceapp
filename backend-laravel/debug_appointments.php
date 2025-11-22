<?php
// Debug: Check database directly

require 'vendor/autoload.php';

// Setup Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Http\Kernel::class);

// Now we can use models
use App\Models\CounselorRequest;
use App\Models\User;

echo "=== DATABASE DEBUG ===\n\n";

echo "All Users:\n";
$users = User::all();
foreach ($users as $user) {
    echo "  ID: {$user->id}, Name: {$user->name}, Role: {$user->role}, Email: {$user->email}\n";
}

echo "\nAll CounselorRequests:\n";
$requests = CounselorRequest::with(['student', 'counselor'])->get();
echo "Total: " . count($requests) . "\n";
foreach ($requests as $req) {
    echo "  ID: {$req->id}\n";
    echo "    Student: {$req->student_id} ({$req->student?->name})\n";
    echo "    Counselor: {$req->counselor_id} ({$req->counselor?->name})\n";
    echo "    Date: {$req->requested_date}\n";
    echo "    Time: {$req->requested_time}\n";
    echo "    Status: {$req->status}\n";
    echo "    Topic: {$req->topic}\n\n";
}

echo "\n=== TESTING QUERY ===\n\n";

// Test student query
$studentId = 5;
echo "Appointments for student $studentId:\n";
$studentAppts = CounselorRequest::where('student_id', $studentId)->get();
echo "  Found: " . count($studentAppts) . "\n";

// Test counselor query
$counselorId = 6;
echo "Appointments for counselor $counselorId:\n";
$counselorAppts = CounselorRequest::where('counselor_id', $counselorId)->get();
echo "  Found: " . count($counselorAppts) . "\n";
