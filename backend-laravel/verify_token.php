<?php

$baseUrl = "http://localhost:8001";

echo "=== VERIFY ADMIN TOKEN ===\n\n";

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

echo "Token received\n\n";

// Check user endpoint
echo "GET /api/user\n";
$ch = curl_init("$baseUrl/api/user");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token", 'Accept: application/json']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP $httpCode\n";
$userData = json_decode($response, true);
echo json_encode($userData, JSON_PRETTY_PRINT);
