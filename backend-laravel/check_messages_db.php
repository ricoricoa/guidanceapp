<?php
// Check database directly for message records
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Message;

$messages = Message::all();
echo "=== Messages in Database ===\n";
echo "Count: " . count($messages) . "\n\n";

foreach ($messages as $msg) {
    echo "ID: " . $msg->id . "\n";
    echo "  Student ID: " . $msg->student_id . "\n";
    echo "  Counselor ID: " . $msg->counselor_id . "\n";
    echo "  Sender: " . $msg->sender . "\n";
    echo "  Message: " . substr($msg->message, 0, 60) . "...\n";
    echo "  Read: " . ($msg->read ? "Yes" : "No") . "\n";
    echo "  Created: " . $msg->created_at . "\n";
    echo "\n";
}
?>
