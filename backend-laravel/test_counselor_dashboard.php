<?php
// Test: Check counselor dashboard appointments

require 'vendor/autoload.php';

echo "=== TESTING COUNSELOR DASHBOARD ===\n\n";

// Login as counselor
echo "Step 1: Logging in as counselor...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/login");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'counselor@example.com',
    'password' => 'password'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

$data = json_decode($response, true);
if ($info['http_code'] !== 200) {
    echo "❌ Login failed! Status: " . $info['http_code'] . "\n";
    echo "Response: " . json_encode($data) . "\n";
    exit(1);
}

$token = $data['data']['token'];
$counselorId = $data['data']['user']['id'];
echo "✅ Logged in as counselor (ID: $counselorId)\n";
echo "   Name: " . $data['data']['user']['name'] . "\n";
echo "   Role: " . $data['data']['user']['role'] . "\n\n";

// Get appointments
echo "Step 2: Fetching appointments...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/appointments");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

$data = json_decode($response, true);
echo "Status: " . $info['http_code'] . "\n";
echo "Full Response: " . json_encode($data, JSON_PRETTY_PRINT) . "\n";

$appointments = $data['data'] ?? [];
echo "\nTotal appointments: " . count($appointments) . "\n";

if (!empty($appointments)) {
    foreach ($appointments as $appt) {
        echo "\n  Appointment ID: {$appt['id']}\n";
        echo "    Student: {$appt['student']['name']}\n";
        echo "    Date: {$appt['requested_date']}\n";
        echo "    Time: {$appt['requested_time']}\n";
        echo "    Status: {$appt['status']}\n";
    }
}
