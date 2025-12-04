<?php
// Comprehensive test for the report submission and retrieval flow
require 'backend-laravel/bootstrap/app.php';

use App\Models\User;
use App\Models\Report;
use Illuminate\Support\Facades\DB;

echo "=== REPORT SYSTEM TEST ===\n\n";

// 1. Check database tables
echo "1. Checking database tables...\n";
$tables = DB::select("SHOW TABLES");
$table_names = array_column($tables, 'Tables_in_' . env('DB_DATABASE', 'web_system'));

echo "   Reports table exists: " . (in_array('reports', $table_names) ? "YES ✓" : "NO ✗") . "\n";
echo "   Users table exists: " . (in_array('users', $table_names) ? "YES ✓" : "NO ✗") . "\n";

// 2. Count reports
echo "\n2. Counting reports in database...\n";
$report_count = Report::count();
echo "   Total reports: $report_count\n";

// 3. Display existing reports
echo "\n3. Existing reports:\n";
$reports = Report::with('user:id,name,email')->orderBy('created_at', 'desc')->get();
if ($reports->count() > 0) {
    foreach ($reports as $report) {
        echo "   - ID: {$report->id}\n";
        echo "     Title: {$report->title}\n";
        echo "     Type: {$report->report_type}\n";
        echo "     Status: {$report->status}\n";
        echo "     From: {$report->user->name} ({$report->user->email})\n";
        echo "     Date: {$report->created_at}\n\n";
    }
} else {
    echo "   No reports found.\n";
}

// 4. Simulate pagination response
echo "\n4. Simulating API response (paginated format)...\n";
$paginated = Report::with('user:id,name,email')
    ->orderBy('created_at', 'desc')
    ->paginate(20);

echo "   Pagination structure:\n";
echo "   - Current page: {$paginated->currentPage()}\n";
echo "   - Total items: {$paginated->total()}\n";
echo "   - Items per page: {$paginated->perPage()}\n";
echo "   - Items on this page: " . count($paginated->items()) . "\n";

// Get the JSON response structure
$response = [
    'data' => $paginated,
    'message' => 'Reports retrieved successfully'
];

echo "\n   Response structure (data property type): " . gettype($response['data']) . "\n";
echo "   Response['data']['data'] type: " . gettype($response['data']->items()) . "\n";
echo "   Response['data']['data'] count: " . count($response['data']->items()) . "\n";

// 5. Test data extraction logic (same as frontend)
echo "\n5. Testing data extraction logic (frontend)...\n";
$response_data = $response['data']; // This simulates reportsRes.data

// Simulate frontend extraction logic
$reportsData = [];
if (isset($response_data) && method_exists($response_data, 'items')) {
    // Laravel paginated object
    $reportsData = $response_data->items();
    echo "   Extracted from paginated object ✓\n";
} elseif (is_array($response_data) && isset($response_data['data'])) {
    $reportsData = $response_data['data'];
    echo "   Extracted from nested data property ✓\n";
} elseif (is_array($response_data)) {
    $reportsData = $response_data;
    echo "   Using data array directly ✓\n";
}

echo "   Extracted " . count($reportsData) . " reports\n";

if (count($reportsData) > 0) {
    echo "   First report:\n";
    $report = (array)$reportsData[0];
    echo "   - ID: " . ($report['id'] ?? 'N/A') . "\n";
    echo "   - Title: " . ($report['title'] ?? 'N/A') . "\n";
    echo "   - Status: " . ($report['status'] ?? 'N/A') . "\n";
}

echo "\n=== TEST COMPLETE ===\n";
?>
