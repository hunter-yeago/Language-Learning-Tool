<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Bucket;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB as FacadesDB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        $student = User::factory()->create([
            'name' => 'test',
            'email' => 'test@test.com',
            'password' => Hash::make('testing123'),
        ]);

        $tutor = User::factory()->create([
            'name' => 'tutor',
            'email' => 'tutor@tutor.com',
            'role' => 'tutor',
            'password' => Hash::make('tutor123'),
        ]);
        
        FacadesDB::table('student_tutor')->insert([
            'student_id' => $student->id,
            'tutor_id' => $tutor->id,
        ]);
    }

}
