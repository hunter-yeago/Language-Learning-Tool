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
        Schema::table('bucket_word_join', function (Blueprint $table) {
            $table->unique(['bucket_id', 'word_id'], 'bucket_word_unique');
        });

        Schema::table('essay_word_join', function (Blueprint $table) {
            $table->unique(['essay_id', 'word_id'], 'essay_word_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bucket_word_join', function (Blueprint $table) {
            $table->dropUnique('bucket_word_unique');
        });

        Schema::table('essay_word_join', function (Blueprint $table) {
            $table->dropUnique('essay_word_unique');
        });
    }
};
