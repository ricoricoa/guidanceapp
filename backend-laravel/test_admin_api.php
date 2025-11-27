<?php

// Test the API endpoints
$baseUrl = "http://localhost:8001";

echo "=== TESTING ADMIN API ENDPOINTS ===\n\n";

// Test 1: Get all users
echo "1. GET /api/v1/admin/users\n";
$ch = curl_init("$baseUrl/api/v1/admin/users");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer test_admin_token',
    'Accept: application/json'
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo "HTTP $httpCode\n";
$data = json_decode($response, true);
echo "Users count: " . count($data['data'] ?? []) . "\n";
if (isset($data['data'][0])) {
    echo "First user: " . json_encode($data['data'][0], JSON_PRETTY_PRINT) . "\n";
}
echo "\n";

// Test 2: Get counselors
echo "2. GET /api/v1/admin/counselors\n";
$ch = curl_init("$baseUrl/api/v1/admin/counselors");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer test_admin_token',
    'Accept: application/json'
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo "HTTP $httpCode\n";
$data = json_decode($response, true);
echo "Counselors count: " . count($data['data'] ?? []) . "\n";
if (isset($data['data'][0])) {
    echo "First counselor: " . json_encode($data['data'][0], JSON_PRETTY_PRINT) . "\n";
}
echo "\n";

// Test 3: Get students
echo "3. GET /api/v1/admin/students\n";
$ch = curl_init("$baseUrl/api/v1/admin/students");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer test_admin_token',
    'Accept: application/json'
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo "HTTP $httpCode\n";
$data = json_decode($response, true);
echo "Students count: " . count($data['data'] ?? []) . "\n";
if (isset($data['data'][0])) {
    echo "First student: " . json_encode($data['data'][0], JSON_PRETTY_PRINT) . "\n";
}
