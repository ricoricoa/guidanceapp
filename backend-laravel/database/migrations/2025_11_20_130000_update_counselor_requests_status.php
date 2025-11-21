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
        // Update the status enum to include 'scheduled' and 'cancelled'
        Schema::table('counselor_requests', function (Blueprint $table) {
            // Change the enum column to include new statuses
            $table->enum('status', ['pending', 'scheduled', 'completed', 'cancelled', 'approved', 'rejected'])
                  ->default('pending')
                  ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('counselor_requests', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])
                  ->default('pending')
                  ->change();
        });
    }
};
