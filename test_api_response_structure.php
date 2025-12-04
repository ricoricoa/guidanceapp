<?php
// Test to see exact API response format for reports
require 'backend-laravel/vendor/autoload.php';
$app = require 'backend-laravel/bootstrap/app.php';

use App\Models\Report;

try {
    $reports = Report::with('user:id,name,email')
        ->orderBy('created_at', 'desc')
        ->paginate(20);
    
    echo "=== Response Structure ===\n";
    echo "Type of paginated object: " . get_class($reports) . "\n\n";
    
    // This is what gets returned in the API response
    $response = [
        'data' => $reports,
        'message' => 'Reports retrieved successfully'
    ];
    
    echo "Response structure:\n";
    echo json_encode([
        'data' => [
            'type' => get_class($response['data']),
            'has_data_method' => method_exists($response['data'], 'items'),
            'items_count' => count($response['data']->items()),
            'first_item' => $response['data']->first() ? [
                'id' => $response['data']->first()->id,
                'title' => $response['data']->first()->title,
                'status' => $response['data']->first()->status,
            ] : null,
        ],
        'message' => $response['message']
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
    
    // What the frontend receives after axios wraps it
    echo "\n=== What Frontend Receives (in axios) ===\n";
    $json_response = json_encode($response, JSON_UNESCAPED_SLASHES);
    echo "JSON (truncated): " . substr($json_response, 0, 200) . "...\n";
    
    echo "\n=== Manual Test ===\n";
    $decoded = json_decode($json_response, true);
    echo "Decoded data type: " . gettype($decoded['data']) . "\n";
    echo "Is array: " . (is_array($decoded['data']) ? 'YES' : 'NO') . "\n";
    if (isset($decoded['data']['data'])) {
        echo "Has data.data: YES\n";
        echo "data.data type: " . gettype($decoded['data']['data']) . "\n";
        echo "data.data is array: " . (is_array($decoded['data']['data']) ? 'YES' : 'NO') . "\n";
        echo "data.data count: " . count($decoded['data']['data']) . "\n";
    }
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
