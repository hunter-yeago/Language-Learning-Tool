<?php

namespace Database\Factories;

use App\Models\Essay;
use App\Models\WordBank;
use Illuminate\Database\Eloquent\Factories\Factory;

class IterationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'essay_id' => Essay::factory(),
            'word_bank_id' => WordBank::factory(),
            'notes' => $this->faker->sentence(),
        ];
    }
}
