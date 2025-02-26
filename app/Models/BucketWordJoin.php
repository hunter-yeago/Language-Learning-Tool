<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BucketWordJoin extends Model
{
    use HasFactory;

    protected $table = 'bucket_word_join';
    protected $fillable = [ 'bucket_id', 'word_id', 'times_used_in_essay', 'times_in_word_bank'];
}
