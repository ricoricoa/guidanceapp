<?php
// Simple test to send a message via HTTP request

$ch = curl_init();

// URL to send message
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/messages");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");

// Get a token first - login as student
$loginCh = curl_init();
curl_setopt($loginCh, CURLOPT_URL, "http://localhost:8001/api/v1/login");
curl_setopt($loginCh, CURLOPT_RETURNTRANSFER, true);
curl_setopt($loginCh, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($loginCh, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($loginCh, CURLOPT_POSTFIELDS, json_encode([
    "email" => "student@example.com",
    "password" => "password"
]));

$loginResponse = curl_exec($loginCh);
echo "Login Response: " . $loginResponse . "\n\n";

$loginData = json_decode($loginResponse, true);
$token = $loginData['data']['token'] ?? null;

if ($token) {
    echo "Token obtained: " . substr($token, 0, 50) . "...\n\n";
    
    // Now send a message
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer $token"
    ]);
    
    $messageData = [
        "recipient_id" => 2, // John Counselor
        "message" => "Test message from student"
    ];
    
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($messageData));
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    echo "Send Message Response (HTTP $httpCode):\n";
    echo $response . "\n\n";
} else {
    echo "Failed to get token\n";
    print_r($loginData);
}

curl_close($loginCh);
curl_close($ch);
?>
