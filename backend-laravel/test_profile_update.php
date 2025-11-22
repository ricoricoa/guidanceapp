<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

// Get the student user
$student = User::where('email', 'student@example.com')->first();

if ($student) {
    echo "Current Student Profile:\n";
    echo "ID: {$student->id}\n";
    echo "Name: {$student->name}\n";
    echo "Email: {$student->email}\n";
    echo "Phone: {$student->phone}\n";
    echo "Address: {$student->address}\n";
    echo "Date of Birth: {$student->date_of_birth}\n";
    echo "Grade Level: {$student->grade_level}\n";
    echo "Guardian Name: {$student->guardian_name}\n";
    echo "Guardian Contact: {$student->guardian_contact}\n";
    echo "Profile Picture: {$student->profile_picture}\n";
    echo "Profile Picture Path: {$student->profile_picture_path}\n";
    echo "\n";
    
    // Update some fields
    $student->update([
        'name' => 'Student Updated',
        'phone' => '09123456789',
        'date_of_birth' => '2005-05-15',
        'grade_level' => '12',
        'address' => '123 Main Street',
        'guardian_name' => 'Parent Name',
        'guardian_contact' => '09987654321'
    ]);
    
    echo "Updated Student Profile:\n";
    $refreshed = User::find($student->id);
    echo "Name: {$refreshed->name}\n";
    echo "Phone: {$refreshed->phone}\n";
    echo "Date of Birth: {$refreshed->date_of_birth}\n";
    echo "Grade Level: {$refreshed->grade_level}\n";
    echo "Address: {$refreshed->address}\n";
    echo "Guardian Name: {$refreshed->guardian_name}\n";
    echo "Guardian Contact: {$refreshed->guardian_contact}\n";
    
} else {
    echo "Student user not found\n";
}

?>
