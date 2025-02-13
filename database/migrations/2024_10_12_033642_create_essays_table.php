<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEssaysTable extends Migration
{
    public function up()
    {
        Schema::create('essays', function (Blueprint $table) {

            $table->id();
            $table->foreignIdFor(\App\Models\WordBucket::class);
            $table->string('title');
            $table->text('content');
            $table->timestamps();

        });
    }

    public function down()
    {
        Schema::dropIfExists('essays');
    }
}
