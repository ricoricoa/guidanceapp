<?php
// Comprehensive test - send message from counselor and retrieve from student

require 'vendor/autoload.php';

echo "=== COMPREHENSIVE MESSAGE TEST ===\n\n";

// Step 1: Counselor sends message
echo "PART 1: COUNSELOR SENDS MESSAGE\n";
echo "================================\n";

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
$counselorId = $data['data']['user']['id'];
echo "✅ Counselor logged in (ID: $counselorId)\n";

// Get students
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/admin/students");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $counselorToken
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
$students = $data['data'] ?? [];
$studentId = $students[0]['id'];
echo "✅ Retrieved students, using: " . $students[0]['name'] . " (ID: $studentId)\n\n";

// Send message from counselor
$messageText = "This is a test from counselor at " . date('Y-m-d H:i:s');

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/messages");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'recipient_id' => $studentId,
    'message' => $messageText
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $counselorToken
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

$data = json_decode($response, true);
if ($info['http_code'] !== 201) {
    echo "❌ Failed to send message! Status: " . $info['http_code'] . "\n";
    exit(1);
}

echo "✅ Message sent from counselor\n";
echo "   Message: \"$messageText\"\n";
echo "   To Student ID: $studentId\n\n";

// Step 2: Student logs in and retrieves messages
echo "PART 2: STUDENT RETRIEVES MESSAGE\n";
echo "==================================\n";

// Get a student account and login
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
    echo "❌ Student login failed!\n";
    exit(1);
}

$studentToken = $data['data']['token'];
$actualStudentId = $data['data']['user']['id'];
echo "✅ Student logged in (ID: $actualStudentId)\n";

// Retrieve messages
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/messages/$actualStudentId/$counselorId");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $studentToken
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

$data = json_decode($response, true);
$messages = $data['data'] ?? [];

echo "✅ Retrieved " . count($messages) . " messages\n";

// Find the most recent message from counselor
$counselorMessage = null;
foreach (array_reverse($messages) as $msg) {
    if ($msg['sender'] === 'counselor') {
        $counselorMessage = $msg;
        break;
    }
}

if ($counselorMessage) {
    echo "✅ Found counselor message: \"" . $counselorMessage['text'] . "\"\n\n";
} else {
    echo "❌ Could not find counselor message!\n";
    exit(1);
}

// Step 3: Student sends reply
echo "PART 3: STUDENT SENDS REPLY\n";
echo "============================\n";

$replyText = "This is a reply from student at " . date('Y-m-d H:i:s');

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/messages");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'recipient_id' => $counselorId,
    'message' => $replyText
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
    echo "❌ Failed to send reply! Status: " . $info['http_code'] . "\n";
    exit(1);
}

echo "✅ Reply sent from student\n";
echo "   Reply: \"$replyText\"\n";
echo "   To Counselor ID: $counselorId\n\n";

// Step 4: Counselor retrieves all messages including reply
echo "PART 4: COUNSELOR RETRIEVES ALL MESSAGES\n";
echo "========================================\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/messages/$actualStudentId/$counselorId");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $counselorToken
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

$data = json_decode($response, true);
$messages = $data['data'] ?? [];

echo "✅ Retrieved " . count($messages) . " total messages\n";

// Display all messages in conversation
echo "\nFull Conversation:\n";
echo "------------------\n";
foreach ($messages as $msg) {
    $sender = ucfirst($msg['sender']);
    echo "[$sender] " . $msg['text'] . "\n";
    echo "  @ " . $msg['timestamp'] . "\n\n";
}

echo "=== TEST COMPLETE - ALL SYSTEMS WORKING ✅ ===\n";
