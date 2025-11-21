<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\CounselorRequest;

echo "=== ALL USERS ===\n";
$users = User::all(['id', 'name', 'email', 'role']);
foreach ($users as $u) {
    echo $u->id . '. ' . $u->name . ' (' . $u->email . ') - ' . $u->role . "\n";
}

echo "\n=== ALL COUNSELOR REQUESTS ===\n";
$appointments = CounselorRequest::all(['id', 'student_id', 'counselor_id', 'topic', 'status', 'requested_date']);
foreach ($appointments as $apt) {
    echo "ID: {$apt->id}, Student: {$apt->student_id}, Counselor: {$apt->counselor_id}, Status: {$apt->status}, Topic: {$apt->topic}\n";
}
