<?php
require_once 'vendor/autoload.php';

use Illuminate\Http\Request;
use Illuminate\Validation\Validator;

// Load Laravel app and setup
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Simulate Formdata with profile_picture present but empty (this is what FormData does!)
$_POST = [
    'name' => 'chawlesss',
    'email' => 'a@gmail.comdsds',
    'phone' => '09167070473',
];

// Simulate FILES array with empty file (FormData does this with file inputs)
$_FILES['profile_picture'] = [
    'name' => '',
    'type' => '',
    'tmp_name' => '',
    'error' => 4,  // UPLOAD_ERR_NO_FILE
    'size' => 0,
];

// Create a fake request
$request = Request::capture();

// Get the actual validation rules used in the API
$rules = [
    'name' => 'required|string|max:255',
    'email' => 'required|email|max:255',
    'address' => 'nullable|string|max:500',
    'phone' => 'nullable|string|max:20',
    'date_of_birth' => 'nullable|date',
    'grade_level' => 'nullable|string|max:50',
    'guardian_name' => 'nullable|string|max:255',
    'guardian_contact' => 'nullable|string|max:20',
    'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
];

// Test 1: What happens with FormData including empty file field
$validator = app('validator')->make($_POST + $_FILES, $rules);

echo "Test 1: FormData with empty profile_picture field\n";
if ($validator->fails()) {
    echo "VALIDATION FAILED:\n";
    foreach ($validator->errors()->all() as $error) {
        echo "  - $error\n";
    }
} else {
    echo "VALIDATION PASSED\n";
}

echo "\n---\n\n";

// Test 2: JSON data (without any file field)
echo "Test 2: JSON with no profile_picture field at all\n";
$data = [
    'name' => 'chawlesss',
    'email' => 'a@gmail.comdsds',
    'phone' => '09167070473',
];

$validator2 = app('validator')->make($data, $rules);
if ($validator2->fails()) {
    echo "VALIDATION FAILED:\n";
    foreach ($validator2->errors()->all() as $error) {
        echo "  - $error\n";
    }
} else {
    echo "VALIDATION PASSED\n";
}

echo "\n---\n\n";

// Test 3: What if FormData sends profile_picture with a non-image value?
echo "Test 3: FormData with profile_picture containing non-image data\n";
$_FILES['profile_picture'] = [
    'name' => 'test.txt',
    'type' => 'text/plain',
    'tmp_name' => '/tmp/phptestfile',
    'error' => 0,
    'size' => 100,
];

$validator3 = app('validator')->make($_POST + $_FILES, $rules);
if ($validator3->fails()) {
    echo "VALIDATION FAILED:\n";
    foreach ($validator3->errors()->all() as $error) {
        echo "  - $error\n";
    }
} else {
    echo "VALIDATION PASSED\n";
}
