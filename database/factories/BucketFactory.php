<?php

namespace Database\Factories;

use App\Models\Bucket;
use App\Models\Word;
use App\Models\Essay;
use Illuminate\Database\Eloquent\Factories\Factory;

class BucketFactory extends Factory
{
    protected $model = Bucket::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->sentence(3),
        ];
    }

    /**
     * Create a bucket with related words.
     *
     * @param int $count Number of words to generate
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withWords($count = 5)
    {
        return $this->afterCreating(function (Bucket $bucket) use ($count) {
            
            // Create words and attach them to the bucket through the pivot table (bucket_word_join)
            $words = Word::factory()->count($count)->create();

            // Attach the words to the bucket using the pivot table (bucket_word_join)
            $bucket->words()->attach($words->pluck('id')->toArray());
        });
    }

    /**
     * Create a bucket with related essays.
     *
     * @param int $count Number of essays to generate
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withEssays($count = 5)
    {
        return $this->afterCreating(function (Bucket $bucket) use ($count) {
            Essay::factory()->count($count)->create(['bucket_id' => $bucket->id]);
        });
    }
}
