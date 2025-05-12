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

        User::factory()->create([
            'name' => 'test',
            'email' => 'test@test.com',
            'password' => Hash::make('testing123'), // Hash the password
        ]);

        User::factory()->create([
            'name' => 'tutor',
            'email' => 'tutor@tutor.com',
            'role' => 'tutor',
            'password' => Hash::make('tutor123'), // Hash the password
        ]);
    }
}
