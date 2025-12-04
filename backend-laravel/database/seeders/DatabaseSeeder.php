<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Create test counselor user
        User::create([
            'name' => 'John Counselor',
            'email' => 'counselor@example.com',
            'password' => bcrypt('password'),
            'role' => 'counselor',
        ]);

        // Create test student user
        User::create([
            'name' => 'Jane Student',
            'email' => 'student@example.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'counselor_id' => 2,
        ]);

        // Create additional test students
        User::create([
            'name' => 'Bob Student',
            'email' => 'bob@example.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'counselor_id' => 2,
        ]);

        User::create([
            'name' => 'Alice Student',
            'email' => 'alice@example.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'counselor_id' => 2,
        ]);

        // Create car data
        Car::truncate();
        $cars = [
            'Toyota' => ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius'],
            'Honda' => ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V'],
            'Ford' => ['Mustang', 'F-150', 'Explorer', 'Escape', 'Focus'],
            'BMW' => ['3 Series', '5 Series', 'X3', 'X5', 'M3'],
            'Mercedes' => ['C-Class', 'E-Class', 'GLC', 'S-Class', 'A-Class'],
            'Audi' => ['A3', 'A4', 'Q5', 'Q7', 'RS5'],
            'Volkswagen' => ['Golf', 'Passat', 'Tiguan', 'Atlas', 'Jetta'],
            'Nissan' => ['Altima', 'Rogue', 'Sentra', 'Maxima', 'Pathfinder']
        ];

        for ($i = 0; $i < 50; $i++) {
            $brand = array_rand($cars);
            Car::create([
                'name' => $brand,
                'model' => $cars[$brand][array_rand($cars[$brand])],
            ]);
        }
    }
}
