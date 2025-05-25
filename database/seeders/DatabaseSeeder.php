<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Bucket;
use App\Models\Word;
use App\Models\Essay;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SubmittedEssaysSeeder::class,
        ]);
    }
}
