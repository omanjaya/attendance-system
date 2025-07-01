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
        Schema::create('face_recognitions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('attendance_id')->nullable()->constrained()->onDelete('cascade');
            $table->text('face_encoding'); // JSON string of face encoding data
            $table->string('image_path')->nullable(); // Path to stored face image
            $table->decimal('confidence_score', 5, 2)->nullable();
            $table->enum('action_type', ['registration', 'verification', 'clock_in', 'clock_out']);
            $table->boolean('liveness_check_passed')->default(false);
            $table->json('liveness_results')->nullable(); // head_shake, nod, smile, blink
            $table->enum('detection_status', ['success', 'failed', 'low_confidence', 'multiple_faces', 'no_face']);
            $table->decimal('location_lat', 10, 8)->nullable();
            $table->decimal('location_lng', 11, 8)->nullable();
            $table->string('device_info')->nullable();
            $table->text('error_message')->nullable();
            $table->json('metadata')->nullable(); // Additional detection data
            $table->timestamps();

            $table->index(['employee_id', 'action_type']);
            $table->index(['detection_status', 'created_at']);
            $table->index(['confidence_score']);
            $table->index(['liveness_check_passed', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('face_recognitions');
    }
};
