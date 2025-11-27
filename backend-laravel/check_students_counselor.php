<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\CounselorRequest;

// Get all students
$students = User::where('role', 'student')->get();
echo "Total Students: " . $students->count() . "\n";
echo "===================================\n";

foreach ($students as $s) {
    echo "\nStudent: " . $s->name . " (Email: " . $s->email . ")\n";
    echo "  - counselor_id: " . ($s->counselor_id ?? 'NULL') . "\n";
    
    // Check if has requests
    $requests = CounselorRequest::where('student_id', $s->id)->get();
    echo "  - Counselor Requests: " . $requests->count() . "\n";
    foreach ($requests as $req) {
        $c = User::find($req->counselor_id);
        echo "    - To: " . ($c?->name ?? 'Unknown') . "\n";
    }
}

echo "\n===================================\n";
echo "COUNSELOR (chaw - aaa@gmail.com):\n";
$counselor = User::where('email', 'aaa@gmail.com')->first();
if ($counselor) {
    echo "ID: " . $counselor->id . "\n";
    
    // Students with counselor_id set
    $assigned = User::where('counselor_id', $counselor->id)->get();
    echo "\nAssigned Students (via counselor_id): " . $assigned->count() . "\n";
    foreach ($assigned as $s) {
        echo "  - " . $s->name . " (" . $s->email . ")\n";
    }
    
    // Students via requests
    $requestedIds = CounselorRequest::where('counselor_id', $counselor->id)->distinct()->pluck('student_id');
    $requested = User::whereIn('id', $requestedIds)->get();
    echo "\nStudents via Requests: " . $requested->count() . "\n";
    foreach ($requested as $s) {
        echo "  - " . $s->name . " (" . $s->email . ")\n";
    }
}
?>
