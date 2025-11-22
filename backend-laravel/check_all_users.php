<?php

require 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

echo "=== All Users in Database ===\n";
$users = User::select('id', 'name', 'email', 'role', 'created_at')->orderBy('created_at', 'desc')->get();

foreach ($users as $user) {
    echo sprintf(
        "ID: %d | Name: %s | Email: %s | Role: %s | Created: %s\n",
        $user->id,
        $user->name,
        $user->email,
        $user->role,
        $user->created_at->format('Y-m-d H:i:s')
    );
}

echo "\n=== Summary ===\n";
echo "Total Users: " . User::count() . "\n";
echo "Students: " . User::where('role', 'student')->count() . "\n";
echo "Counselors: " . User::whereIn('role', ['guidance', 'counselor'])->count() . "\n";
echo "Admins: " . User::where('role', 'admin')->count() . "\n";
