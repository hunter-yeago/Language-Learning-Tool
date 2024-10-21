<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\WordBucket;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed 10 users
        User::factory(10)->create();

        // Seed 5 WordBuckets, each with 5 related Words
        WordBucket::factory(5)
            ->withWords(5) // This method is defined in your WordBucketFactory
            ->create();
    }
}
