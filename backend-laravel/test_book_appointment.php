<?php
// Test Book Appointment Flow

require 'vendor/autoload.php';

echo "=== TESTING BOOK APPOINTMENT FLOW ===\n\n";

// First, login as student to get token
echo "Step 0: Logging in as student to get token...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/login");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'alice@example.com',
    'password' => 'password'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

$data = json_decode($response, true);
if ($info['http_code'] !== 200) {
    echo "❌ Login failed!\n";
    exit(1);
}

$token = $data['data']['token'];
$studentId = $data['data']['user']['id'];
echo "✅ Logged in as student (ID: $studentId)\n\n";

// Step 1: Get all counselors
echo "Step 1: Fetching all counselors...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/counselors");
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
echo "Response: " . json_encode($data, JSON_PRETTY_PRINT) . "\n";

if (!isset($data['data']) || !is_array($data['data'])) {
    echo "❌ Invalid response format\n";
    exit(1);
}

echo "Counselors: " . count($data['data']) . "\n";

if (!empty($data['data'])) {
    foreach ($data['data'] as $counselor) {
        echo "  - {$counselor['name']} (ID: {$counselor['id']})\n";
    }
}

$counselorId = $data['data'][0]['id'] ?? null;
echo "\nUsing counselor ID: $counselorId\n\n";

// Step 2: Book an appointment
echo "Step 2: Booking appointment...\n";
$tomorrow = date('Y-m-d', strtotime('+1 day'));
$time = '10:00';
$topic = 'Discussion about academic progress';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/student/appointments");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'counselor_id' => $counselorId,
    'date' => $tomorrow,
    'time' => $time,
    'topic' => $topic
]));
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

if ($info['http_code'] === 201) {
    echo "✅ Appointment created successfully!\n";
    echo "   ID: " . $data['appointment']['id'] . "\n";
    echo "   Counselor: " . $data['appointment']['counselor']['name'] . "\n";
    echo "   Date: " . $data['appointment']['requested_date'] . "\n";
    echo "   Time: " . $data['appointment']['requested_time'] . "\n";
    $appointmentId = $data['appointment']['id'];
} else {
    echo "❌ Failed to create appointment!\n";
    echo "Response: " . json_encode($data, JSON_PRETTY_PRINT) . "\n";
    exit(1);
}

echo "\nStep 3: Verifying appointment in student dashboard...\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/appointments");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

$data = json_decode($response, true);
$appointments = $data['data'] ?? [];

echo "✅ Retrieved " . count($appointments) . " appointments for student\n";
if (!empty($appointments)) {
    $latestAppt = $appointments[count($appointments) - 1];
    echo "   Latest: {$latestAppt['topic']} - {$latestAppt['requested_date']} at {$latestAppt['requested_time']}\n";
}

echo "\nStep 4: Verifying appointment in counselor dashboard...\n";

// Login as counselor
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
    echo "❌ Counselor login failed!\n";
    exit(1);
}

$counselorToken = $data['data']['token'];

// Get counselor appointments
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/appointments");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $counselorToken
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

$data = json_decode($response, true);
$appointments = $data['data'] ?? [];

echo "✅ Retrieved " . count($appointments) . " appointments for counselor\n";
if (!empty($appointments)) {
    $latestAppt = $appointments[count($appointments) - 1];
    echo "   Latest: {$latestAppt['topic']} - {$latestAppt['requested_date']} at {$latestAppt['requested_time']}\n";
}

echo "\n=== TEST COMPLETE ===\n";
