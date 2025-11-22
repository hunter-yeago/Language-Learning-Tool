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
        Schema::create('essay_visibility', function (Blueprint $table) {
            $table->id();
            $table->foreignId('essay_id')->constrained('essays')->onDelete('cascade');
            $table->enum('visibility_type', ['private', 'public', 'unlisted'])->default('private');
            $table->string('public_url_token', 64)->unique()->nullable();
            $table->boolean('allow_anonymous')->default(true);
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            // One visibility record per essay
            $table->unique('essay_id');

            // Index for public essay discovery
            $table->index(['visibility_type', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('essay_visibility');
    }
};
