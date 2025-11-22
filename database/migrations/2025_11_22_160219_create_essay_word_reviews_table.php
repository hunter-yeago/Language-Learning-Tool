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
        Schema::create('essay_word_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('essay_review_id')->constrained('essay_reviews')->onDelete('cascade');
            $table->foreignId('word_id')->constrained('words')->onDelete('cascade');
            $table->string('grade'); // correct, partially_correct, incorrect, not_used, not_graded
            $table->text('comment')->nullable();
            $table->timestamps();

            // Ensure one grade per word per review
            $table->unique(['essay_review_id', 'word_id']);

            // Index for faster queries
            $table->index('essay_review_id');
            $table->index('word_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('essay_word_reviews');
    }
};
