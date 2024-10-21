<?php

namespace Database\Factories;

use App\Models\WordBucket;
use Illuminate\Database\Eloquent\Factories\Factory;

class WordBucketFactory extends Factory
{
    protected $model = WordBucket::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->sentence(3),  // Generate a random title
        ];
    }

    /**
     * Create a word bucket with related words.
     *
     * @param int $count Number of words to generate
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withWords($count = 5)
    {
        return $this->afterCreating(function (WordBucket $bucket) use ($count) {
            \App\Models\Word::factory()
                ->count($count)
                ->create(['word_bucket_id' => $bucket->id]);
        });
    }
}
