<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$student = User::where('email', 'student@example.com')->first();

if ($student) {
    echo "Current user state:\n";
    echo "Name: " . $student->name . "\n";
    echo "Email: " . $student->email . "\n";
    echo "Phone: " . $student->phone . "\n";
    echo "Date of Birth: " . $student->date_of_birth . "\n";
    echo "Grade Level: " . $student->grade_level . "\n";
    echo "\n";
    
    // Try updating with the data from the screenshot
    try {
        $student->update([
            'name' => 'chawlesss',
            'email' => 'a@gmail.comdsds',
            'phone' => '09167070473'
        ]);
        echo "✓ Update successful\n";
        
        $refreshed = User::find($student->id);
        echo "After update:\n";
        echo "Name: " . $refreshed->name . "\n";
        echo "Email: " . $refreshed->email . "\n";
        echo "Phone: " . $refreshed->phone . "\n";
    } catch (Exception $e) {
        echo "✗ Error: " . $e->getMessage() . "\n";
    }
}

?>
