<?php
// This file helps debug the user roles in the database
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';

$db = $app->make('db');

echo "=== All Users ===\n";
$users = $db->table('users')->select('id', 'name', 'email', 'role')->get();
foreach ($users as $user) {
    echo sprintf("ID: %d | Name: %-20s | Email: %-25s | Role: '%s'\n", 
        $user->id, $user->name, $user->email, $user->role);
}

echo "\n=== User 'chaw' Details ===\n";
$chaw = $db->table('users')->where('name', 'chaw')->first();
if ($chaw) {
    echo "Found: ID=$chaw->id, Name=$chaw->name, Email=$chaw->email, Role='$chaw->role'\n";
    echo "Role comparison: (\$user->role !== 'counselor') = " . ($chaw->role !== 'counselor' ? 'TRUE (BLOCKED)' : 'FALSE (ALLOWED)') . "\n";
} else {
    echo "User 'chaw' not found\n";
}

echo "\n=== Users with 'counsel' in role ===\n";
$counselors = $db->table('users')->whereRaw("role LIKE '%counsel%'")->select('id', 'name', 'email', 'role')->get();
foreach ($counselors as $user) {
    echo sprintf("ID: %d | Name: %-20s | Email: %-25s | Role: '%s'\n", 
        $user->id, $user->name, $user->email, $user->role);
}
?>
