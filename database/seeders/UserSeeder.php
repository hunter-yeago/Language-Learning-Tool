<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
           // Create Users
        $student = User::factory()->create([
            'name' => 'test',
            'email' => 'test@test.com',
            'password' => Hash::make('testing123'),
        ]);

        $student->assignRole('student');

        $tutor = User::factory()->create([
            'name' => 'tutor',
            'email' => 'tutor@tutor.com',
            'role' => 'tutor',
            'password' => Hash::make('tutor123'),
        ]);

        $tutor->assignRole('tutor');

        DB::table('student_tutor')->insert([
            'student_id' => $student->id,
            'tutor_id' => $tutor->id,
        ]);
    }
}
