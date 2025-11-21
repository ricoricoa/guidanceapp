<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\CounselorRequest;
use Illuminate\Support\Carbon;

// Create a test appointment
$appointment = CounselorRequest::create([
    'student_id' => 1, // rico (student)
    'counselor_id' => null, // Not assigned yet
    'requested_date' => Carbon::now()->addDays(5)->toDateString(),
    'requested_time' => '10:00',
    'topic' => 'Career Planning and Guidance',
    'status' => 'pending',
    'notes' => null,
]);

echo "Test appointment created successfully:\n";
echo "ID: " . $appointment->id . "\n";
echo "Status: " . $appointment->status . "\n";
echo "Date: " . $appointment->requested_date . "\n";
echo "Time: " . $appointment->requested_time . "\n";
echo "Topic: " . $appointment->topic . "\n";
