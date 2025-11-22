<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add new profile fields if they don't exist
            if (!Schema::hasColumn('users', 'date_of_birth')) {
                $table->date('date_of_birth')->nullable();
            }
            if (!Schema::hasColumn('users', 'grade_level')) {
                $table->string('grade_level')->nullable();
            }
            if (!Schema::hasColumn('users', 'guardian_name')) {
                $table->string('guardian_name')->nullable();
            }
            if (!Schema::hasColumn('users', 'guardian_contact')) {
                $table->string('guardian_contact')->nullable();
            }
            if (!Schema::hasColumn('users', 'profile_picture')) {
                $table->longText('profile_picture')->nullable(); // For data URL or path
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'date_of_birth')) {
                $table->dropColumn('date_of_birth');
            }
            if (Schema::hasColumn('users', 'grade_level')) {
                $table->dropColumn('grade_level');
            }
            if (Schema::hasColumn('users', 'guardian_name')) {
                $table->dropColumn('guardian_name');
            }
            if (Schema::hasColumn('users', 'guardian_contact')) {
                $table->dropColumn('guardian_contact');
            }
            if (Schema::hasColumn('users', 'profile_picture')) {
                $table->dropColumn('profile_picture');
            }
        });
    }
};
