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
        Schema::create('word_status_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('word_id')->constrained();  // Foreign key to words
            $table->foreignId('essay_id')->constrained();  // Foreign key to essays
            $table->string('status');  // Status of the word at that point in time
            $table->timestamp('timestamp');  // The exact time when the status was recorded

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('word_status_history');
    }
};
