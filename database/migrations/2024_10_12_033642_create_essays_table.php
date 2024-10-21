<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEssaysTable extends Migration
{
    public function up()
    {
        Schema::create('essays', function (Blueprint $table) {
            $table->id(); // This will create an auto-incrementing id column
            
            //given that every essay belongs to a Word Bucket

            // this is one way to do it (just using the id name)
            // $table->unsignedBigInteger('word_bucket_id');

            // this is another cool way to do it!
            $table->foreignIdFor(\App\Models\WordBucket::class);
            
            $table->string('title'); // Example column for essay title
            $table->text('content'); // Example column for essay content
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    public function down()
    {
        Schema::dropIfExists('essays');
    }
}
