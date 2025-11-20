<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Convert legacy 'user' role to 'student' for consistency
        DB::table('users')->where('role', 'user')->update(['role' => 'student']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert 'student' back to 'user' if needed
        DB::table('users')->where('role', 'student')->update(['role' => 'user']);
    }
};
