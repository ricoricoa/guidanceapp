<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

// Simulate what the API does with the data
$user_id = 3;
$email = 'a@gmail.comdsds';

echo "Testing validation with email: $email\n";

// This is the exact validation from the API
$validator = Validator::make([
    'name' => 'chawlesss',
    'email' => $email,
    'phone' => '09167070473'
], [
    'name' => ['required', 'string', 'max:255'],
    'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user_id)],
    'phone' => ['nullable', 'string', 'max:20'],
]);

if ($validator->fails()) {
    echo "✗ Validation FAILED\n";
    echo "Errors:\n";
    foreach ($validator->errors()->all() as $error) {
        echo "  - $error\n";
    }
} else {
    echo "✓ Validation PASSED\n";
}

?>
