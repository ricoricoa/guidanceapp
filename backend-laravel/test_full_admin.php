<?php

$baseUrl = "http://localhost:8001";

echo "=== ADMIN API TEST ===\n\n";

// Step 1: Login as admin
echo "STEP 1: Login as admin\n";
echo "POST /api/login\n";

$loginData = json_encode([
    'email' => 'admin@example.com',
    'password' => 'password123',
]);

$ch = curl_init("$baseUrl/api/login");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP $httpCode\n";
$loginResponse = json_decode($response, true);

if (isset($loginResponse['data']['token'])) {
    $token = $loginResponse['data']['token'];
    echo "✓ Login successful\n";
    echo "Token: " . substr($token, 0, 20) . "...\n";
} else {
    echo "✗ Login failed\n";
    echo json_encode($loginResponse, JSON_PRETTY_PRINT) . "\n";
    exit(1);
}

echo "\n";

// Step 2: Get counselors with token
echo "STEP 2: Get counselors\n";
echo "GET /api/v1/admin/counselors\n";

$ch = curl_init("$baseUrl/api/v1/admin/counselors");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    'Accept: application/json',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP $httpCode\n";
$data = json_decode($response, true);

if ($httpCode === 200) {
    echo "✓ Got counselors\n";
    echo "Count: " . count($data['data'] ?? []) . "\n";
    foreach ($data['data'] ?? [] as $counselor) {
        echo "  - {$counselor['name']} ({$counselor['email']}) - Role: {$counselor['role']}\n";
    }
} else {
    echo "✗ Failed to get counselors\n";
    echo json_encode($data, JSON_PRETTY_PRINT) . "\n";
}

echo "\n";

// Step 3: Get students with token
echo "STEP 3: Get students\n";
echo "GET /api/v1/admin/students\n";

$ch = curl_init("$baseUrl/api/v1/admin/students");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    'Accept: application/json',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP $httpCode\n";
$data = json_decode($response, true);

if ($httpCode === 200) {
    echo "✓ Got students\n";
    echo "Count: " . count($data['data'] ?? []) . "\n";
    foreach ($data['data'] ?? [] as $student) {
        echo "  - {$student['name']} ({$student['email']}) - Role: {$student['role']}\n";
    }
} else {
    echo "✗ Failed to get students\n";
    echo json_encode($data, JSON_PRETTY_PRINT) . "\n";
}

echo "\n";

// Step 4: Get all users
echo "STEP 4: Get all users\n";
echo "GET /api/v1/admin/users\n";

$ch = curl_init("$baseUrl/api/v1/admin/users");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    'Accept: application/json',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP $httpCode\n";
$data = json_decode($response, true);

if ($httpCode === 200) {
    echo "✓ Got all users\n";
    echo "Count: " . count($data['data'] ?? []) . "\n";
    
    $roleGroups = [];
    foreach ($data['data'] ?? [] as $user) {
        if (!isset($roleGroups[$user['role']])) {
            $roleGroups[$user['role']] = [];
        }
        $roleGroups[$user['role']][] = $user['name'];
    }
    
    foreach ($roleGroups as $role => $names) {
        echo "  $role (" . count($names) . "): " . implode(', ', $names) . "\n";
    }
} else {
    echo "✗ Failed to get all users\n";
    echo json_encode($data, JSON_PRETTY_PRINT) . "\n";
}

echo "\n=== TEST COMPLETE ===\n";
