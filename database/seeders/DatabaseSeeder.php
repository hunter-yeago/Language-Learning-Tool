<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\WordBucket;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed 10 users
        User::factory(10)->create();

        // Seed 5 CreateNewWordBank, each with 5 related Words
        WordBucket::factory(5)
            ->withWords(5) // This method is defined in your WordBucketFactory
            ->withEssays(5) // This method is defined in your WordBucketFactory
            ->create();
    }
}
