<?php

namespace Database\Factories;

use App\Models\Word;
use Illuminate\Database\Eloquent\Factories\Factory;

class WordFactory extends Factory
{
    protected $model = Word::class;

    public function definition()
    {
        return [
            'word' => $this->faker->word(),
        ];
    }
}
