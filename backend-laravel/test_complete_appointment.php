<?php
// Complete test: Book appointment with John Counselor and verify it appears

require 'vendor/autoload.php';

echo "=== COMPLETE APPOINTMENT TEST ===\n\n";

// Step 1: Student books appointment with John Counselor (ID 2)
echo "Step 1: Booking appointment with John Counselor...\n";

// Login as student
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/login");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'bob@example.com',
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

$studentToken = $data['data']['token'];
$studentId = $data['data']['user']['id'];
echo "✅ Student logged in (ID: $studentId)\n";

// Book appointment
$tomorrow = date('Y-m-d', strtotime('+1 day'));
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/student/appointments");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'counselor_id' => 2,
    'date' => $tomorrow,
    'time' => '14:00',
    'topic' => 'Academic counseling'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $studentToken
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

$data = json_decode($response, true);
if ($info['http_code'] !== 201) {
    echo "❌ Failed to book appointment!\n";
    echo "Response: " . json_encode($data) . "\n";
    exit(1);
}

$appointmentId = $data['appointment']['id'];
echo "✅ Appointment booked (ID: $appointmentId)\n";
echo "   Counselor: " . $data['appointment']['counselor']['name'] . "\n";
echo "   Date: " . $data['appointment']['requested_date'] . "\n\n";

// Step 2: Verify in student dashboard
echo "Step 2: Checking student dashboard...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/appointments");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $studentToken
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

$data = json_decode($response, true);
$appointments = $data['data'] ?? [];
echo "✅ Student has " . count($appointments) . " appointment(s)\n";
if (!empty($appointments)) {
    $appt = end($appointments);
    echo "   Latest: {$appt['topic']} with {$appt['counselor']['name']}\n";
}

echo "\nStep 3: Checking counselor dashboard...\n";

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
$counselorToken = $data['data']['token'];

// Get counselor appointments
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/appointments");
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
echo "✅ Counselor has " . count($appointments) . " appointment(s)\n";
if (!empty($appointments)) {
    foreach ($appointments as $appt) {
        echo "   - {$appt['topic']} with {$appt['student']['name']} on {$appt['requested_date']} at {$appt['requested_time']}\n";
    }
} else {
    echo "❌ No appointments showing for counselor!\n";
}

echo "\n=== TEST COMPLETE ===\n";
