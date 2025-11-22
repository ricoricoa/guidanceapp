<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

// Get the student user
$student = User::where('email', 'student@example.com')->first();

if ($student) {
    echo "Testing profile update with different field combinations:\n\n";
    
    // Test 1: Update with required fields only
    echo "Test 1: Update with name, email only\n";
    $student->update([
        'name' => 'Test Name Only',
        'email' => 'student@example.com'
    ]);
    echo "✓ Success\n\n";
    
    // Test 2: Update with some optional fields
    echo "Test 2: Update with phone and address\n";
    $student->update([
        'phone' => '09555666777',
        'address' => 'Test Address'
    ]);
    echo "✓ Success\n\n";
    
    // Test 3: Update with date_of_birth
    echo "Test 3: Update with date_of_birth\n";
    $student->update([
        'date_of_birth' => '2005-12-25'
    ]);
    echo "✓ Success\n\n";
    
    // Test 4: Verify all fields
    echo "Final state:\n";
    $refreshed = User::find($student->id);
    echo "Name: {$refreshed->name}\n";
    echo "Email: {$refreshed->email}\n";
    echo "Phone: {$refreshed->phone}\n";
    echo "Address: {$refreshed->address}\n";
    echo "Date of Birth: {$refreshed->date_of_birth}\n";
    
} else {
    echo "Student not found\n";
}

?>
