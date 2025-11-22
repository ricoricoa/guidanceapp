<?php
// Test message API for counselor with Alice Student
echo "=== Testing Counselor Message API ===\n\n";

// Login as counselor
echo "Step 1: Logging in as counselor...\n";
$loginUrl = "http://localhost:8001/api/login";
$counselorCreds = ["email" => "counselor@example.com", "password" => "password"];

$ch = curl_init($loginUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($counselorCreds));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo "❌ Login failed! Status: " . $httpCode . "\n";
    echo "Response: " . $response . "\n";
    exit(1);
}

$loginData = json_decode($response, true);
$counselorToken = $loginData['data']['token'];
$counselorId = $loginData['data']['user']['id'];
echo "✓ Counselor logged in (ID: $counselorId)\n\n";

// Send a test message to Alice Student (ID 5)
echo "Step 2: Sending test message to Alice Student (ID 5)...\n";
$messageUrl = "http://localhost:8001/api/v1/messages";
$messageData = ["recipient_id" => 5, "message" => "Hello Alice, how are you?"];

$ch = curl_init($messageUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($messageData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $counselorToken
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 201) {
    echo "❌ Message send failed! Status: " . $httpCode . "\n";
    echo "Response: " . $response . "\n";
} else {
    $msgData = json_decode($response, true);
    echo "✓ Message sent successfully!\n";
    echo "  Message ID: " . $msgData['data']['id'] . "\n";
    echo "  Text: " . $msgData['data']['text'] . "\n\n";
}

// Fetch messages between counselor (2) and Alice Student (5)
echo "Step 3: Fetching all messages between counselor (2) and Alice (5)...\n";
$getUrl = "http://localhost:8001/api/v1/messages/5/2";

$ch = curl_init($getUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $counselorToken
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: " . $httpCode . "\n";
if ($response) {
    $getData = json_decode($response, true);
    if ($httpCode === 200 && isset($getData['data'])) {
        echo "✓ Retrieved " . count($getData['data']) . " messages\n";
        foreach ($getData['data'] as $msg) {
            echo "  - [" . $msg['sender'] . "] " . $msg['text'] . " (" . $msg['timestamp'] . ")\n";
        }
    } else {
        echo "Response:\n";
        echo json_encode($getData, JSON_PRETTY_PRINT) . "\n";
    }
}
?>
