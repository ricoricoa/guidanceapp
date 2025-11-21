<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\CounselorRequest;
use Illuminate\Support\Carbon;

// Create completed appointment
CounselorRequest::create([
    'student_id' => 1,
    'counselor_id' => 2,
    'requested_date' => Carbon::now()->subDays(10)->toDateString(),
    'requested_time' => '14:00',
    'topic' => 'Academic Performance Discussion',
    'status' => 'completed',
    'notes' => 'Student showed great improvement in math.',
]);

// Create scheduled appointment
CounselorRequest::create([
    'student_id' => 1,
    'counselor_id' => 2,
    'requested_date' => Carbon::now()->addDays(3)->toDateString(),
    'requested_time' => '11:00',
    'topic' => 'Time Management Workshop',
    'status' => 'scheduled',
    'notes' => null,
]);

// Create another pending
CounselorRequest::create([
    'student_id' => 1,
    'counselor_id' => null,
    'requested_date' => Carbon::now()->addDays(7)->toDateString(),
    'requested_time' => '09:00',
    'topic' => 'Study Skills Training',
    'status' => 'pending',
    'notes' => null,
]);

echo "Additional test appointments created successfully!\n";
