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
    Schema::create('essays', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->foreignId('user_id')->constrained();
        $table->foreignId('bucket_id')->constrained();
        $table->text('content');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('essays');
    }
};
