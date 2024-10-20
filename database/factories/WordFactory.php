<?php

namespace Database\Factories;

use App\Models\Word;
use App\Models\WordBucket;
use Illuminate\Database\Eloquent\Factories\Factory;

class WordFactory extends Factory
{
    protected $model = Word::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'word' => $this->faker->word,  // Generate a random word
            'word_bucket_id' => WordBucket::factory(),  // Associate with a WordBucket
        ];
    }
}
