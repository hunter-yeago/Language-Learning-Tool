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
        Schema::create('essay_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('essay_id')->constrained('essays')->onDelete('cascade');
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('reviewer_name')->nullable(); // For anonymous reviewers
            $table->enum('reviewer_type', ['tutor', 'public', 'ai'])->default('tutor');
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->text('feedback')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Index for faster queries
            $table->index(['essay_id', 'status']);
            $table->index('reviewer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('essay_reviews');
    }
};
