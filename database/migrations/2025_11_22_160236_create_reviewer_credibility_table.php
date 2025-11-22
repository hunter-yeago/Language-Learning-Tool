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
        Schema::create('reviewer_credibility', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->decimal('credibility_score', 3, 2)->default(0.50); // 0.00 to 1.00
            $table->integer('total_reviews')->default(0);
            $table->integer('approved_reviews')->default(0);
            $table->integer('helpful_votes')->default(0);
            $table->timestamps();

            // One credibility record per reviewer
            $table->unique('reviewer_id');

            // Index for leaderboards
            $table->index('credibility_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviewer_credibility');
    }
};
