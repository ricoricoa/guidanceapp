<?php

$baseUrl = "http://localhost:8001";

echo "=== DETAILED ADMIN API DEBUG ===\n\n";

// Login
$loginData = json_encode(['email' => 'admin@example.com', 'password' => 'password123']);
$ch = curl_init("$baseUrl/api/login");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json', 'Content-Type: application/json']);
$response = curl_exec($ch);
curl_close($ch);

$loginResponse = json_decode($response, true);
$token = $loginResponse['data']['token'];
$user = $loginResponse['data']['user'];

echo "Logged in as:\n";
echo "  Name: {$user['name']}\n";
echo "  Email: {$user['email']}\n";
echo "  Role: {$user['role']}\n\n";

// Test each admin endpoint
$endpoints = [
    '/api/v1/admin/users' => 'Get All Users',
    '/api/v1/admin/counselors' => 'Get Counselors',
    '/api/v1/admin/students' => 'Get Students',
    '/api/v1/admin/dashboard-summary' => 'Get Dashboard Summary',
];

foreach ($endpoints as $endpoint => $description) {
    echo "Testing: $description\n";
    echo "Endpoint: GET $endpoint\n";
    
    $ch = curl_init("$baseUrl$endpoint");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $token",
        'Accept: application/json',
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_HEADER, true); // Include headers in response
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    // Extract body from response
    $header_size = curl_getinfo(curl_init(), CURLINFO_HEADER_SIZE);
    $body = substr($response, $header_size);
    
    echo "HTTP $httpCode\n";
    $data = json_decode($body, true);
    
    if ($httpCode === 200) {
        if (isset($data['data'])) {
            if (is_array($data['data'])) {
                echo "✓ Count: " . count($data['data']) . " items\n";
            } else {
                echo "✓ Data: " . json_encode($data['data'], JSON_PRETTY_PRINT) . "\n";
            }
        }
    } else {
        echo "✗ Error: " . json_encode($data, JSON_PRETTY_PRINT) . "\n";
    }
    echo "\n";
}
