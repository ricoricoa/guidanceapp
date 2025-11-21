<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = App\Models\User::where('email', 'rico@gmail.com')->first();
if ($user) {
    echo "User found: " . $user->email . "\n";
    echo "Password hash: " . $user->password . "\n";
    echo "Is bcrypt hash (starts with \$2): " . (strpos($user->password, '$2') === 0 ? 'YES' : 'NO') . "\n";
    
    // Try to verify password
    if (Hash::check('Ricorico1', $user->password)) {
        echo "Password verification: SUCCESS\n";
    } else {
        echo "Password verification: FAILED\n";
    }
} else {
    echo "User not found\n";
}
?>
