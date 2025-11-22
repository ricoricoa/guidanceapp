<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

// Get the counselor user
$counselor = User::where('role', 'guidance')->first();

if ($counselor) {
    // Create a token
    $token = $counselor->createToken('test-counselor-token')->plainTextToken;
    
    echo "Counselor User: {$counselor->email}\n";
    echo "User ID: {$counselor->id}\n";
    echo "Auth Token: $token\n";
    echo "\n";
    echo "Use this token to test certificate approval:\n";
    echo "curl -X PUT -H \"Authorization: Bearer $token\" -H \"Content-Type: application/json\" -d '{\"counselor_remarks\": \"Approved\"}' http://localhost:8001/api/v1/certificate-requests/3/approve\n";
    
} else {
    echo "Counselor user not found\n";
}

?>
