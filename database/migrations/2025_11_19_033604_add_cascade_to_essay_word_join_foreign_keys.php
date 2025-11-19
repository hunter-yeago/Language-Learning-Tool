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
        Schema::table('essay_word_join', function (Blueprint $table) {
            // Drop existing foreign keys
            $table->dropForeign(['essay_id']);
            $table->dropForeign(['word_id']);

            // Add foreign keys with cascade delete
            $table->foreign('essay_id')
                  ->references('id')
                  ->on('essays')
                  ->onDelete('cascade');

            $table->foreign('word_id')
                  ->references('id')
                  ->on('words')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('essay_word_join', function (Blueprint $table) {
            // Drop cascade foreign keys
            $table->dropForeign(['essay_id']);
            $table->dropForeign(['word_id']);

            // Restore original foreign keys without cascade
            $table->foreign('essay_id')
                  ->references('id')
                  ->on('essays');

            $table->foreign('word_id')
                  ->references('id')
                  ->on('words');
        });
    }
};
