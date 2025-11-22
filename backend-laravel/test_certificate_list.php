<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\CertificateRequest;
use Illuminate\Support\Carbon;

// Get a student user
$student = User::where('role', 'student')->first();

if ($student) {
    echo "Testing with student: {$student->email} (ID: {$student->id})\n";
    echo "---\n";
    
    // Create test certificate requests
    $cert1 = CertificateRequest::create([
        'user_id' => $student->id,
        'certificate_type' => 'Good Moral',
        'purpose' => 'For college admission',
        'status' => 'pending',
        'notes' => 'Test certificate request #1',
        'submitted_at' => now()
    ]);
    
    echo "✓ Created certificate request #1:\n";
    echo "  ID: {$cert1->id}\n";
    echo "  Type: {$cert1->certificate_type}\n";
    echo "  Status: {$cert1->status}\n";
    echo "  Purpose: {$cert1->purpose}\n";
    echo "\n";
    
    // Create a second request with different type
    $cert2 = CertificateRequest::create([
        'user_id' => $student->id,
        'certificate_type' => 'Referral',
        'purpose' => 'For scholarship application',
        'status' => 'approved',
        'notes' => 'Test certificate request #2',
        'counselor_remarks' => 'Approved - ready for pickup',
        'submitted_at' => now()->subDays(1),
        'completed_at' => now()
    ]);
    
    echo "✓ Created certificate request #2:\n";
    echo "  ID: {$cert2->id}\n";
    echo "  Type: {$cert2->certificate_type}\n";
    echo "  Status: {$cert2->status}\n";
    echo "  Remarks: {$cert2->counselor_remarks}\n";
    echo "---\n";
    
    // Fetch all requests for this student
    $requests = CertificateRequest::where('user_id', $student->id)->get();
    echo "Total requests for this student: {$requests->count()}\n";
    
    foreach ($requests as $req) {
        echo "\n  • {$req->certificate_type} - {$req->status} (ID: {$req->id})\n";
        echo "    Purpose: {$req->purpose}\n";
    }
    
} else {
    echo "No student user found\n";
}

?>
