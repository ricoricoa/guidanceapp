<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Validator;

echo "Email validation tests:\n\n";

// Test 1: Valid email
echo "Test 1: Valid email (a@gmail.com)\n";
$v1 = Validator::make(['email' => 'a@gmail.com'], ['email' => ['required', 'email']]);
echo $v1->fails() ? "FAILED: " . implode(', ', $v1->errors()->all()) : "PASSED";
echo "\n\n";

// Test 2: Invalid email
echo "Test 2: Invalid email (agmailcom - no @)\n";
$v2 = Validator::make(['email' => 'agmailcom'], ['email' => ['required', 'email']]);
echo $v2->fails() ? "FAILED: " . implode(', ', $v2->errors()->all()) : "PASSED";
echo "\n\n";

// Test 3: Email from screenshot
echo "Test 3: Email from screenshot (a@gmail.comdsds)\n";
$v3 = Validator::make(['email' => 'a@gmail.comdsds'], ['email' => ['required', 'email']]);
echo $v3->fails() ? "FAILED: " . implode(', ', $v3->errors()->all()) : "PASSED";
echo "\n\n";

// Test 4: No validation errors FormData scenario
echo "Test 4: Test FormData with missing profile_picture\n";
$v4 = Validator::make([], [
    'name' => ['required', 'string'],
    'email' => ['required', 'email'],
    'profile_picture' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048']
]);
echo $v4->fails() ? "FAILED: " . implode(', ', $v4->errors()->all()) : "PASSED";

?>
