<?php

namespace Database\Factories;

use App\Models\bucket;
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
     * Create a word bucket with related words.
     *
     * @param int $count Number of words to generate
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withWords($count = 5)
    {
        return $this->afterCreating(function (bucket $bucket) use ($count) {
            \App\Models\Word::factory()
                ->count($count)
                ->create(['bucket_id' => $bucket->id]);
        });
    }
    public function withEssays($count = 5)
    {
        return $this->afterCreating(function (bucket $bucket) use ($count) {
            \App\Models\Essay::factory()
                ->count($count)
                ->create(['bucket_id' => $bucket->id]);
        });
    }
}
