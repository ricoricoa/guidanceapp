<?php

// Test document request API endpoints

// Get a student token first by logging in
$login_url = "http://localhost:8001/api/auth/login";
$login_data = [
    'email' => 'student@example.com',
    'password' => 'password'
];

$ch = curl_init($login_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($login_data));

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$login_response = json_decode($response, true);
if (!isset($login_response['data']['token'])) {
    echo "❌ Login failed\n";
    echo "Response: " . $response . "\n";
    exit(1);
}

$token = $login_response['data']['token'];
echo "✅ Student logged in, token: " . substr($token, 0, 20) . "...\n";

// Test 1: Submit a document request
echo "\n📝 Test 1: Submit Document Request\n";
$submit_url = "http://localhost:8001/api/v1/documents";
$submit_data = [
    'request_type' => 'good_moral',
    'purpose' => 'For scholarship application',
    'notes' => 'Needed urgently'
];

$ch = curl_init($submit_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($submit_data));

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 201 || $http_code === 200) {
    echo "✅ Document request submitted (HTTP $http_code)\n";
    $submit_response = json_decode($response, true);
    $doc_request_id = $submit_response['data']['request']['id'];
    echo "   Request ID: $doc_request_id\n";
} else {
    echo "❌ Failed to submit document request (HTTP $http_code)\n";
    echo "   Response: " . $response . "\n";
    exit(1);
}

// Test 2: Get student's document requests
echo "\n📋 Test 2: Get Student Document Requests\n";
$get_url = "http://localhost:8001/api/v1/documents";

$ch = curl_init($get_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200) {
    echo "✅ Retrieved student document requests (HTTP $http_code)\n";
    $get_response = json_decode($response, true);
    echo "   Count: " . count($get_response['data']['requests']) . "\n";
} else {
    echo "❌ Failed to get document requests (HTTP $http_code)\n";
    echo "   Response: " . $response . "\n";
}

// Test 3: Get counselor's view of all document requests
echo "\n👨‍💼 Test 3: Get Counselor's Document Requests\n";

// First login as counselor
$counselor_login_data = [
    'email' => 'alice@example.com',
    'password' => 'password'
];

$ch = curl_init($login_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($counselor_login_data));

$response = curl_exec($ch);
curl_close($ch);

$counselor_login_response = json_decode($response, true);
if (!isset($counselor_login_response['data']['token'])) {
    echo "⚠️  Could not login as counselor, skipping counselor tests\n";
} else {
    $counselor_token = $counselor_login_response['data']['token'];
    echo "✅ Counselor logged in\n";

    // Get all document requests
    $counselor_requests_url = "http://localhost:8001/api/v1/counselor/student-requests";
    
    $ch = curl_init($counselor_requests_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $counselor_token
    ]);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code === 200) {
        echo "✅ Retrieved counselor document requests (HTTP $http_code)\n";
        $counselor_response = json_decode($response, true);
        echo "   Count: " . count($counselor_response['data']) . "\n";
        
        // Test 4: Approve a document request
        if (isset($doc_request_id)) {
            echo "\n✅ Test 4: Approve Document Request\n";
            $approve_url = "http://localhost:8001/api/v1/documents/$doc_request_id/approve";
            $approve_data = [
                'remarks' => 'Approved by counselor'
            ];

            $ch = curl_init($approve_url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $counselor_token
            ]);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($approve_data));

            $response = curl_exec($ch);
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($http_code === 200 || $http_code === 201) {
                echo "✅ Document request approved (HTTP $http_code)\n";
            } else {
                echo "❌ Failed to approve (HTTP $http_code)\n";
                echo "   Response: " . $response . "\n";
            }
        }
    } else {
        echo "❌ Failed to get counselor document requests (HTTP $http_code)\n";
        echo "   Response: " . $response . "\n";
    }
}

echo "\n✅ Document request API tests completed!\n";
?>
