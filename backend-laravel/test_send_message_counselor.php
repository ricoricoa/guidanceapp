<?php
// Test sending a message from counselor to student

require 'vendor/autoload.php';

// Get a token for counselor
echo "=== Testing Counselor Message Sending ===\n\n";

echo "Step 1: Logging in as counselor (John Counselor)...\n";
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
if ($info['http_code'] !== 200 || !isset($data['data']['token'])) {
    echo "❌ Login failed! Status: " . $info['http_code'] . "\n";
    echo "Response: " . $response . "\n";
    exit(1);
}

$token = $data['data']['token'];
$counselorId = $data['data']['user']['id'];
echo "✅ Logged in successfully! Token: " . substr($token, 0, 20) . "...\n";
echo "   Counselor ID: " . $counselorId . "\n\n";

// Get a student ID
echo "Step 2: Getting list of students...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/admin/students");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

$data = json_decode($response, true);
if ($info['http_code'] !== 200) {
    echo "❌ Failed to get students! Status: " . $info['http_code'] . "\n";
    echo "Response: " . $response . "\n";
    exit(1);
}

$students = $data['data'] ?? [];
if (empty($students)) {
    echo "❌ No students found!\n";
    exit(1);
}

$studentId = $students[0]['id'];
$studentName = $students[0]['name'];
echo "✅ Found " . count($students) . " students\n";
echo "   Using student: " . $studentName . " (ID: " . $studentId . ")\n\n";

// Send a message
echo "Step 3: Sending message from counselor to student...\n";
$messageText = "Hello! This is a test message from the counselor. Testing at: " . date('Y-m-d H:i:s');

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/messages");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'recipient_id' => $studentId,
    'message' => $messageText
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
echo "Status Code: " . $info['http_code'] . "\n";
echo "Response: " . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n\n";

if ($info['http_code'] !== 201) {
    echo "❌ Failed to send message!\n";
    exit(1);
}

echo "✅ Message sent successfully!\n";
echo "   Message ID: " . $data['data']['id'] . "\n";
echo "   Sender: " . $data['data']['sender'] . "\n";

// Verify message was saved
echo "\nStep 4: Retrieving messages to verify...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/messages/$studentId/$counselorId");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

$data = json_decode($response, true);
$messages = $data['data'] ?? [];

echo "✅ Retrieved " . count($messages) . " messages\n";
if (!empty($messages)) {
    echo "   Last message: " . $messages[count($messages) - 1]['text'] . "\n";
}

echo "\n=== Test Complete ===\n";
