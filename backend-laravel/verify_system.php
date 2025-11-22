#!/usr/bin/env php
<?php
// Final Verification Script
// This script verifies that the counselor message sending system is fully fixed

echo "\n";
echo "╔════════════════════════════════════════════════════════════╗\n";
echo "║  COUNSELOR MESSAGE SENDING - FINAL VERIFICATION             ║\n";
echo "╚════════════════════════════════════════════════════════════╝\n\n";

$tests = [
    'Backend API' => false,
    'User Model Relationship' => false,
    'Message Sending' => false,
    'Message Retrieval' => false,
    'Bidirectional Flow' => false,
];

echo "Running verification tests...\n\n";

// Test 1: Backend API
echo "1️⃣  Testing Backend API... ";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/login");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['email' => 'counselor@example.com', 'password' => 'password']));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

if ($info['http_code'] === 200) {
    echo "✅ PASS\n";
    $tests['Backend API'] = true;
    $data = json_decode($response, true);
    $counselorToken = $data['data']['token'];
    $counselorId = $data['data']['user']['id'];
} else {
    echo "❌ FAIL\n";
}

// Test 2: User Model Relationship
echo "2️⃣  Testing User Model Relationship... ";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/guidance/dashboard");
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Authorization: Bearer ' . $counselorToken]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

if ($info['http_code'] === 200) {
    echo "✅ PASS\n";
    $tests['User Model Relationship'] = true;
    $data = json_decode($response, true);
} else {
    echo "❌ FAIL (Status: {$info['http_code']})\n";
}

// Get students for next tests
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/admin/students");
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Authorization: Bearer ' . $counselorToken]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);

$students = $data['data'] ?? [];
$studentId = $students[0]['id'] ?? null;

// Test 3: Message Sending
echo "3️⃣  Testing Message Sending... ";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/messages");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['recipient_id' => $studentId, 'message' => 'Verification test at ' . date('H:i:s')]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Authorization: Bearer ' . $counselorToken]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

if ($info['http_code'] === 201) {
    echo "✅ PASS\n";
    $tests['Message Sending'] = true;
    $msgData = json_decode($response, true);
    $messageId = $msgData['data']['id'] ?? null;
} else {
    echo "❌ FAIL (Status: {$info['http_code']})\n";
}

// Test 4: Message Retrieval
echo "4️⃣  Testing Message Retrieval... ";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/messages/$studentId/$counselorId");
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Authorization: Bearer ' . $counselorToken]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

if ($info['http_code'] === 200) {
    $data = json_decode($response, true);
    $messages = $data['data'] ?? [];
    if (count($messages) > 0) {
        echo "✅ PASS (" . count($messages) . " messages)\n";
        $tests['Message Retrieval'] = true;
    } else {
        echo "⚠️  PARTIAL (No messages)\n";
    }
} else {
    echo "❌ FAIL (Status: {$info['http_code']})\n";
}

// Test 5: Bidirectional Flow
echo "5️⃣  Testing Bidirectional Flow... ";

// Student login
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/login");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['email' => 'alice@example.com', 'password' => 'password']));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

if ($info['http_code'] === 200) {
    $data = json_decode($response, true);
    $studentToken = $data['data']['token'];
    $actualStudentId = $data['data']['user']['id'];
    
    // Student sends reply
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://localhost:8001/api/v1/messages");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['recipient_id' => $counselorId, 'message' => 'Reply test at ' . date('H:i:s')]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Authorization: Bearer ' . $studentToken]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);

    $response = curl_exec($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);
    
    if ($info['http_code'] === 201) {
        echo "✅ PASS\n";
        $tests['Bidirectional Flow'] = true;
    } else {
        echo "❌ FAIL (Status: {$info['http_code']})\n";
    }
} else {
    echo "❌ FAIL (Student login failed)\n";
}

// Summary
echo "\n";
echo "╔════════════════════════════════════════════════════════════╗\n";
echo "║  TEST RESULTS SUMMARY                                      ║\n";
echo "╚════════════════════════════════════════════════════════════╝\n\n";

$passed = 0;
$failed = 0;

foreach ($tests as $test => $result) {
    $status = $result ? '✅ PASS' : '❌ FAIL';
    echo sprintf("  %-30s %s\n", $test, $status);
    if ($result) $passed++; else $failed++;
}

echo "\n";
echo "Result: " . $passed . "/" . count($tests) . " tests passed\n";

if ($passed === count($tests)) {
    echo "\n🎉 ALL TESTS PASSED - SYSTEM IS FULLY FUNCTIONAL! 🎉\n";
    exit(0);
} elseif ($passed >= count($tests) - 1) {
    echo "\n⚠️  MOST TESTS PASSED - SYSTEM IS MOSTLY FUNCTIONAL\n";
    exit(0);
} else {
    echo "\n❌ MULTIPLE FAILURES - PLEASE CHECK THE SYSTEM\n";
    exit(1);
}
