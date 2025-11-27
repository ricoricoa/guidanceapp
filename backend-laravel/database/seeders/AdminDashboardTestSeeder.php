<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminDashboardTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $adminCount = User::where('role', 'admin')->count();
        if ($adminCount === 0) {
            User::create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]);
            echo "Created admin user\n";
        }
        
        // Check and add counselors
        $counselorCount = User::where('role', 'counselor')->count();
        if ($counselorCount < 3) {
            $counselorsToAdd = 3 - $counselorCount;
            
            $counselors = [
                ['name' => 'John Counselor', 'email' => 'john.counselor@example.com'],
                ['name' => 'Maria Guidance', 'email' => 'maria.guidance@example.com'],
                ['name' => 'Dr. Santos', 'email' => 'dr.santos@example.com'],
            ];
            
            foreach (array_slice($counselors, 0, $counselorsToAdd) as $counselor) {
                if (!User::where('email', $counselor['email'])->exists()) {
                    User::create([
                        'name' => $counselor['name'],
                        'email' => $counselor['email'],
                        'password' => Hash::make('password123'),
                        'role' => 'counselor',
                    ]);
                    echo "Created counselor: {$counselor['name']}\n";
                }
            }
        }
        
        // Check and add students
        $studentCount = User::where('role', 'student')->count();
        if ($studentCount < 4) {
            $studentsToAdd = 4 - $studentCount;
            
            $students = [
                ['name' => 'Alice Student', 'email' => 'alice.student@example.com'],
                ['name' => 'Bob Smith', 'email' => 'bob.smith@example.com'],
                ['name' => 'Charlie Brown', 'email' => 'charlie.brown@example.com'],
                ['name' => 'Diana Prince', 'email' => 'diana.prince@example.com'],
            ];
            
            $counselor = User::where('role', 'counselor')->first();
            $counselorId = $counselor ? $counselor->id : null;
            
            foreach (array_slice($students, 0, $studentsToAdd) as $student) {
                if (!User::where('email', $student['email'])->exists()) {
                    User::create([
                        'name' => $student['name'],
                        'email' => $student['email'],
                        'password' => Hash::make('password123'),
                        'role' => 'student',
                        'counselor_id' => $counselorId,
                    ]);
                    echo "Created student: {$student['name']}\n";
                }
            }
        }
        
        echo "\n=== Final User Counts ===\n";
        echo "Counselors: " . User::where('role', 'counselor')->count() . "\n";
        echo "Students: " . User::where('role', 'student')->count() . "\n";
    }
}
