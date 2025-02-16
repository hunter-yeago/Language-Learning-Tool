<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Bucket;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed 10 users
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'test',
            'email' => 'test@test.com',
            'password' => Hash::make('testing123'), // Hash the password
        ]);


        // Seed 5 CreateNewWordBank, each with 5 related Words
        // Bucket::factory(5)
        //     ->withWords(5) // This method is defined in your BucketFactory
        //     ->withEssays(5) // This method is defined in your BucketFactory
        //     ->create();
    }
}
