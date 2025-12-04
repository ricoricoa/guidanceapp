<?php
// Test the API endpoint to see what it returns
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8000/api/v1/reports");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Accept: application/json",
    "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $http_code\n";
echo "Response:\n";
$decoded = json_decode($response, true);
echo json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";

// Check the structure
if (isset($decoded['data'])) {
    echo "\nData structure: " . gettype($decoded['data']) . "\n";
    if (is_array($decoded['data'])) {
        echo "Number of items in data: " . count($decoded['data']) . "\n";
    }
}
?>
