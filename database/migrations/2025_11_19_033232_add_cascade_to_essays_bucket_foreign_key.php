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
        Schema::table('essays', function (Blueprint $table) {
            // Drop the existing foreign key constraint
            $table->dropForeign(['bucket_id']);

            // Add the foreign key with cascade delete
            $table->foreign('bucket_id')
                  ->references('id')
                  ->on('buckets')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('essays', function (Blueprint $table) {
            // Drop the cascade foreign key
            $table->dropForeign(['bucket_id']);

            // Restore the original foreign key without cascade
            $table->foreign('bucket_id')
                  ->references('id')
                  ->on('buckets');
        });
    }
};
