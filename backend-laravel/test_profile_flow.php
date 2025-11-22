<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

// Get the student user
$student = User::where('email', 'student@example.com')->first();

if ($student) {
    echo "=== PROFILE SAVE AND LOAD TEST ===\n\n";
    
    // Step 1: Current profile
    echo "Step 1: Current Profile\n";
    echo "Name: {$student->name}\n";
    echo "Phone: {$student->phone}\n";
    echo "Address: {$student->address}\n";
    echo "Grade Level: {$student->grade_level}\n";
    echo "\n";
    
    // Step 2: Simulate form update
    echo "Step 2: Simulating Profile Update via API\n";
    $student->update([
        'name' => 'Jane New Name',
        'phone' => '09123456777',
        'address' => '789 New Street',
        'grade_level' => 'Grade 10',
        'date_of_birth' => '2005-12-25',
        'guardian_name' => 'John Parent',
        'guardian_contact' => '09777666555'
    ]);
    echo "Fields updated\n\n";
    
    // Step 3: Reload from database
    echo "Step 3: Reloading Profile from Database\n";
    $refreshed = User::find($student->id);
    echo "Name: {$refreshed->name}\n";
    echo "Phone: {$refreshed->phone}\n";
    echo "Address: {$refreshed->address}\n";
    echo "Grade Level: {$refreshed->grade_level}\n";
    echo "Date of Birth: {$refreshed->date_of_birth}\n";
    echo "Guardian Name: {$refreshed->guardian_name}\n";
    echo "Guardian Contact: {$refreshed->guardian_contact}\n";
    echo "\n";
    
    // Step 4: Verify all fields match
    echo "Step 4: Verification\n";
    $match = (
        $refreshed->name === 'Jane New Name' &&
        $refreshed->phone === '09123456777' &&
        $refreshed->address === '789 New Street' &&
        $refreshed->grade_level === 'Grade 10' &&
        $refreshed->guardian_name === 'John Parent'
    );
    echo $match ? "✓ All profile fields saved and loaded correctly!\n" : "✗ Some fields did not match\n";
    
} else {
    echo "Student user not found\n";
}

?>
