<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('essay_word_join', function (Blueprint $table) {
        $table->id();
        $table->foreignId('essay_id')->constrained();
        $table->foreignId('word_id')->constrained();
        $table->boolean('used_in_essay')->default(false);
        $table->string('grade')->nullable();
        $table->string('comment')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('essay_word_join');
    }
};
