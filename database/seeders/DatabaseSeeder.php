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
        // Create Users
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

        DB::table('student_tutor')->insert([
            'student_id' => $student->id,
            'tutor_id' => $tutor->id,
        ]);

        // Create Words
        $wordList = [
            'analyze', 'evaluate', 'synthesize', 'compare', 'contrast',
            'argue', 'define', 'illustrate', 'interpret', 'justify',
            'explore', 'assess', 'construct', 'debate', 'differentiate',
            'describe', 'summarize', 'criticize', 'deduce', 'conclude',
            'paraphrase', 'elaborate', 'support', 'formulate', 'predict',
            'outline', 'discuss', 'highlight', 'propose', 'revise',
        ];

        // create a bucket
            
            //  bucket table
                // id
                // user_id
                // title
                // description
            
            // words table
                // id
                // words
            
            // bucket word join 
                // id
                // bucket_id
                // word_id
                // times used in essay / times in word bank
                // grade
                // comment

        // create an essay

            // essay table
                // id
                // title
                // user_id
                // bucket_id
                // content
                // feedback
                // tutor_id
                // status
            
            // essay word join table
                // id
                // essay_id
                // word_id
                // grade
                // comment
            
            


        $words = collect($wordList)->map(fn ($text) => Word::create(['word' => $text]))->keyBy('id');

        // Create Buckets with associated words
        $bucketTitles = ['Analysis', 'Argument', 'Definition', 'Evaluation', 'Interpretation', 'Synthesis'];
        $buckets = collect();

        foreach ($bucketTitles as $category) {
            $bucket = Bucket::create([
                'title' => $category . ' Bucket',
                'description' => $category . ' related tasks',
                'user_id' => $student->id,
            ]);

            // Assign 3 random words to the bucket
            $randomWords = $words->random(3);
            foreach ($randomWords as $word) {
                DB::table('bucket_word_join')->insert([
                    'bucket_id' => $bucket->id,
                    'word_id' => $word->id,
                    'times_used_in_essay' => rand(0, 5),
                    'times_in_word_bank' => rand(1, 3),
                    'grade' => 'not_attempted',
                    'comment' => '',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $buckets->push($bucket);
        }

        // Essay statuses
        $statuses = ['submitted', 'under_review', 'graded'];

        // Create Essays and attach words from their bucket
        for ($i = 1; $i <= 15; $i++) {
            $status = $statuses[array_rand($statuses)];

            // Select random bucket for this essay
            $bucket = $buckets->random();

            $essay = Essay::create([
                'user_id' => $student->id,
                'tutor_id' => $tutor->id,
                'status' => $status,
                'title' => "Essay $i",
                'content' => "This is the content of essay $i filled with advanced vocabulary and structured arguments.",
                'feedback' => $status === 'graded' ? 'Excellent progression and vocabulary use.' : '',
                'bucket_id' => $bucket->id,
            ]);

            // Get word IDs from this bucket
            $bucketWordIds = DB::table('bucket_word_join')
                ->where('bucket_id', $bucket->id)
                ->pluck('word_id');

            if ($bucketWordIds->count() > 0) {
                $essayWordIds = $bucketWordIds->random(min(5, max(2, $bucketWordIds->count())));
                foreach ($essayWordIds as $wordId) {
                    DB::table('essay_word_join')->insert([
                        'essay_id' => $essay->id,
                        'word_id' => $wordId,
                        'grade' => 'not_attempted',
                        'comment' => '',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
