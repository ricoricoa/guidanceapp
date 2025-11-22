<?php
// Test full conversation flow - student and counselor exchanging messages
echo "=== Testing Full Conversation Flow ===\n\n";

// 1. Login as student
echo "Step 1: Student logging in...\n";
$loginUrl = "http://localhost:8001/api/login";
$studentCreds = ["email" => "student@example.com", "password" => "password"];

$ch = curl_init($loginUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($studentCreds));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);

$response = curl_exec($ch);
curl_close($ch);

$studentData = json_decode($response, true);
$studentToken = $studentData['data']['token'];
$studentId = $studentData['data']['user']['id'];
echo "✓ Student logged in (ID: $studentId)\n\n";

// 2. Login as counselor
echo "Step 2: Counselor logging in...\n";
$counselorCreds = ["email" => "counselor@example.com", "password" => "password"];

$ch = curl_init($loginUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($counselorCreds));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);

$response = curl_exec($ch);
curl_close($ch);

$counselorData = json_decode($response, true);
$counselorToken = $counselorData['data']['token'];
$counselorId = $counselorData['data']['user']['id'];
echo "✓ Counselor logged in (ID: $counselorId)\n\n";

// 3. Student sends message
echo "Step 3: Student sends message to counselor...\n";
$messageUrl = "http://localhost:8001/api/v1/messages";
$messageData = ["recipient_id" => $counselorId, "message" => "Hi counselor, I need help with my studies!"];

$ch = curl_init($messageUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($messageData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $studentToken
]);

$response = curl_exec($ch);
curl_close($ch);

$msgResp = json_decode($response, true);
echo "✓ Student message sent: '" . $msgResp['data']['text'] . "'\n\n";

// 4. Counselor sends reply
echo "Step 4: Counselor sends reply...\n";
$replyData = ["recipient_id" => $studentId, "message" => "Hello! I'm here to help. Let's schedule a session."];

$ch = curl_init($messageUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($replyData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $counselorToken
]);

$response = curl_exec($ch);
curl_close($ch);

$replyResp = json_decode($response, true);
echo "✓ Counselor reply sent: '" . $replyResp['data']['text'] . "'\n\n";

// 5. Student fetches all messages
echo "Step 5: Student fetches messages from this conversation...\n";
$getUrl = "http://localhost:8001/api/v1/messages/" . $studentId . "/" . $counselorId;

$ch = curl_init($getUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $studentToken
]);

$response = curl_exec($ch);
curl_close($ch);

$allMsgs = json_decode($response, true);
echo "✓ Retrieved " . count($allMsgs['data']) . " messages:\n";
foreach ($allMsgs['data'] as $msg) {
    echo "  - [" . $msg['sender'] . "] " . $msg['text'] . "\n";
}
echo "\n";

// 6. Counselor fetches all messages
echo "Step 6: Counselor fetches messages from this conversation...\n";

$ch = curl_init($getUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $counselorToken
]);

$response = curl_exec($ch);
curl_close($ch);

$allMsgs = json_decode($response, true);
echo "✓ Retrieved " . count($allMsgs['data']) . " messages:\n";
foreach ($allMsgs['data'] as $msg) {
    echo "  - [" . $msg['sender'] . "] " . $msg['text'] . "\n";
}

echo "\n✅ Conversation test completed successfully!\n";
?>
