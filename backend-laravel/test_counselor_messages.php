<?php
// Test fetching messages for counselor (ID 7) and student (ID 6)
echo "=== Testing Message Retrieval ===\n\n";

// Login as counselor (ID 7)
echo "Step 1: Logging in as counselor (chawles - ID 7)...\n";
$loginUrl = "http://localhost:8001/api/login";
$counselorCreds = ["email" => "cc@gmail.com", "password" => "12345678"];

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

// Get messages between student 6 and counselor 7
echo "Step 2: Fetching messages between student 6 and counselor 7...\n";
$getUrl = "http://localhost:8001/api/v1/messages/6/7";

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
    $msgData = json_decode($response, true);
    echo "Response:\n";
    echo json_encode($msgData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
    
    if ($httpCode === 200 && isset($msgData['data'])) {
        echo "\n✓ Found " . count($msgData['data']) . " messages\n";
        foreach ($msgData['data'] as $msg) {
            echo "  - [" . $msg['sender'] . "] " . $msg['text'] . "\n";
        }
    }
}
?>
