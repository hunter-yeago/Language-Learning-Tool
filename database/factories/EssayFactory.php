<?php

namespace Database\Factories;

use App\Models\WordBucket;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Essay>
 */
class EssayFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->jobTitle(),
            // laravel will reach this point and say ah yes
            // we need a word bucket factory so I'll generate that
            // word bucket for oyu and then give you its id here
            'word_bucket_id' => WordBucket::factory(),
            'content' => fake()->paragraph(),
        ];
    }
}
