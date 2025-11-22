<?php
// Test message sending API
echo "=== Testing Message API ===\n\n";

// 1. Login first
echo "Step 1: Logging in...\n";
$loginUrl = "http://localhost:8001/api/login";
$credentials = [
    "email" => "student@example.com",
    "password" => "password"
];

$ch = curl_init($loginUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($credentials));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Accept: application/json"
]);

$loginResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo "Login failed! Status: " . $httpCode . "\n";
    echo "Response: " . $loginResponse . "\n";
    exit(1);
}

$loginData = json_decode($loginResponse, true);
$token = $loginData['data']['token'];
$userId = $loginData['data']['user']['id'];
echo "✓ Login successful! Token: " . substr($token, 0, 10) . "...\n";
echo "  User ID: " . $userId . " (Jane Student)\n\n";

// 2. Send message to counselor
echo "Step 2: Sending message to counselor (ID 2)...\n";
$messageUrl = "http://localhost:8001/api/v1/messages";
$messageData = [
    "recipient_id" => 2,
    "message" => "Hello counselor, I need help with my studies!"
];

$ch = curl_init($messageUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($messageData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Accept: application/json",
    "Authorization: Bearer " . $token
]);

$messageResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: " . $httpCode . "\n";
if ($messageResponse) {
    $msgData = json_decode($messageResponse, true);
    echo "Response:\n";
    echo json_encode($msgData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n\n";
}

// 3. Get messages between student and counselor
echo "Step 3: Fetching messages between student ($userId) and counselor (2)...\n";
$getUrl = "http://localhost:8001/api/v1/messages/" . $userId . "/2";

$ch = curl_init($getUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Accept: application/json",
    "Authorization: Bearer " . $token
]);

$getResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: " . $httpCode . "\n";
if ($getResponse) {
    $getData = json_decode($getResponse, true);
    echo "Response:\n";
    echo json_encode($getData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
}
?>
