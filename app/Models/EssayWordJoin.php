<?php

// app/Models/EssayWordJoin.php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class EssayWordJoin extends Pivot
{
    protected $table = 'essay_word_join';  // Explicitly define the pivot table name
    protected $fillable = ['essay_id', 'word_id', 'attempts', 'times_used'];  // Fillable fields
}
