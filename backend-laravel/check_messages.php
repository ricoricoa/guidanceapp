<?php
require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);

use App\Models\Message;
use App\Models\User;

// Get all messages
$messages = Message::with(['student', 'counselor'])->get();

echo "\n=== All Messages in Database ===\n";
foreach ($messages as $msg) {
    echo "ID: {$msg->id} | Student: {$msg->student->name} ({$msg->student_id}) | Counselor: {$msg->counselor->name} ({$msg->counselor_id}) | Sender: {$msg->sender} | Message: {$msg->message} | Read: " . ($msg->read ? 'Yes' : 'No') . " | Created: {$msg->created_at}\n";
}

if ($messages->isEmpty()) {
    echo "No messages found in database.\n";
} else {
    echo "\nTotal Messages: " . $messages->count() . "\n";
}

echo "\n=== Summary ===\n";
$studentMessages = Message::where('sender', 'student')->count();
$counselorMessages = Message::where('sender', 'counselor')->count();
echo "Student Messages: $studentMessages\n";
echo "Counselor Messages: $counselorMessages\n";
?>
