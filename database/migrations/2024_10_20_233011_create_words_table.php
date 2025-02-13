<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWordsTable extends Migration
{
    public function up()
    {
        Schema::create('words', function (Blueprint $table) {
            $table->id();
            $table->string('word');
            $table->foreignId('word_bucket_id') // Foreign key to word_buckets table
                  ->constrained()
                  ->onDelete('cascade'); // Cascade delete to remove words if the bucket is deleted
            $table->unsignedInteger('times_used')->default(0);
            $table->unsignedInteger('attempts')->default(0);
            $table->unsignedInteger('marked_correct')->default(0);
            $table->unsignedInteger('marked_partially_correct')->default(0);
            $table->unsignedInteger('marked_incorrect')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('words');
    }
}
