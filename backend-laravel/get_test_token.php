<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

// Get the student user
$user = User::where('email', 'student@example.com')->first();

if ($user) {
    // Create a token
    $token = $user->createToken('test-token')->plainTextToken;
    
    echo "Student User: {$user->email}\n";
    echo "User ID: {$user->id}\n";
    echo "Auth Token: $token\n";
    echo "\n";
    echo "Use this token to test the API:\n";
    echo "curl -H \"Authorization: Bearer $token\" http://localhost:8001/api/v1/student/certificate-requests\n";
    
} else {
    echo "Student user not found\n";
}

?>
