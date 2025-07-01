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
        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('browser_notifications')->default(true);
            $table->boolean('attendance_notifications')->default(true);
            $table->boolean('leave_notifications')->default(true);
            $table->boolean('payroll_notifications')->default(true);
            $table->boolean('system_notifications')->default(true);
            $table->boolean('email_notifications')->default(false);
            $table->boolean('sms_notifications')->default(false);
            $table->time('quiet_hours_start')->nullable();
            $table->time('quiet_hours_end')->nullable();
            $table->string('notification_sound')->default('default');
            $table->timestamps();

            // Ensure one preference record per user
            $table->unique('user_id');
            
            // Index for efficient lookups
            $table->index(['user_id', 'browser_notifications']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_preferences');
    }
};