<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

// Get the counselor
$counselor = User::where('email', 'aaa@gmail.com')->first();
if (!$counselor) {
    echo "Counselor not found\n";
    exit;
}

echo "Assigning all students to counselor: " . $counselor->name . " (ID: " . $counselor->id . ")\n";

// Get all students without a counselor
$students = User::where('role', 'student')
    ->whereNull('counselor_id')
    ->get();

echo "Students to assign: " . $students->count() . "\n";

foreach ($students as $student) {
    $student->counselor_id = $counselor->id;
    $student->save();
    echo "✓ Assigned: " . $student->name . " (" . $student->email . ")\n";
}

echo "\nDone! All students assigned to " . $counselor->name . "\n";

// Now show summary
$total = User::where('role', 'student')
    ->where('counselor_id', $counselor->id)
    ->count();

echo "\nTotal students now assigned to this counselor: " . $total . "\n";
?>
