<?php

// Quick test script to verify Announcements
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\Announcement;
use App\Models\User;

try {
    // Check if table exists
    if (Schema::hasTable('announcements')) {
        echo "✓ Announcements table exists\n";
        
        // List columns
        $columns = Schema::getColumnListing('announcements');
        echo "Columns: " . implode(", ", $columns) . "\n";
        
        // Count announcements
        $count = Announcement::count();
        echo "Total announcements: $count\n";
        
        // Get counselor count
        $counselors = User::where('role', 'counselor')->count();
        echo "Total counselors: $counselors\n";
        
    } else {
        echo "✗ Announcements table does NOT exist\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
