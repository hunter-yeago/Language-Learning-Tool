<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Bucket;
use App\Models\Word;
use App\Models\Essay;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SubmittedEssaysSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // check if theres a student and tutor, and if not then use them for this
        $student = \App\Models\User::where('email', 'test@test.com')->first();
        $tutor = \App\Models\User::where('email', 'tutor@tutor.com')->first();


        if (!$student || !$tutor) {
            $this->command->error("Student or tutor user not found. Please run UserSeeder first.");
            return;
        }

        // Central config: buckets, words, and essays
        $bucketConfig = [
            'Analysis' => [
                'words' => ['analyze', 'compare', 'explore', 'deduce', 'highlight'],
                'essays' => [
                    ['title' => 'Analyzing the Modern Economy'],
                    ['title' => 'Exploring Patterns in History'],
                ],
            ],
            'Argument' => [
                'words' => ['argue', 'justify', 'support', 'debate', 'propose'],
                'essays' => [
                    ['title' => 'The Ethics of AI Decision-Making'],
                    ['title' => 'Supporting Renewable Energy Initiatives'],
                ],
            ],
            'Definition' => [
                'words' => ['define', 'describe', 'outline', 'summarize', 'illustrate'],
                'essays' => [
                    ['title' => 'Defining Cultural Identity'],
                ],
            ],
            'Evaluation' => [
                'words' => ['evaluate', 'assess', 'criticize', 'conclude', 'discuss'],
                'essays' => [
                    ['title' => 'Evaluating Social Media’s Impact'],
                    ['title' => 'Assessing Climate Change Policies'],
                    ['title' => 'Criticizing Fast Fashion Trends'],
                ],
            ],
            'Interpretation' => [
                'words' => ['interpret', 'paraphrase', 'elaborate', 'differentiate', 'conclude'],
                'essays' => [
                    ['title' => 'Interpreting Shakespearean Tragedy'],
                ],
            ],
            'Synthesis' => [
                'words' => ['synthesize', 'construct', 'formulate', 'predict', 'revise'],
                'essays' => [
                    ['title' => 'Synthesizing Data in the Digital Age'],
                    ['title' => 'Predicting the Future of Work'],
                ],
            ],
        ];

        // Create all unique words (normalized to lowercase)
        $uniqueWords = collect($bucketConfig)
            ->flatMap(fn ($bucket) => $bucket['words'])
            ->map(fn ($word) => trim(strtolower($word)))
            ->unique()
            ->values();

        // Create words using firstOrCreate to prevent duplicates
        // Index by normalized word for consistent lookup
        $words = collect();
        foreach ($uniqueWords as $normalizedWord) {
            $words[$normalizedWord] = Word::firstOrCreate(['word' => $normalizedWord]);
        }

        // Loop through bucket config and build buckets, bucket_word_joins, essays, and essay_word_joins
        foreach ($bucketConfig as $bucketTitle => $config) {
            // Create Bucket
            $bucket = Bucket::create([
                'title' => $bucketTitle . ' Bucket',
                'description' => $bucketTitle . ' related tasks',
                'user_id' => $student->id,
            ]);

            // Attach words to bucket using Eloquent relationship
            foreach ($config['words'] as $wordText) {
                $normalizedWord = trim(strtolower($wordText));
                // Only attach if not already attached (respects unique constraint)
                if (!$bucket->words()->where('word_id', $words[$normalizedWord]->id)->exists()) {
                    $bucket->words()->attach($words[$normalizedWord]->id);
                }
            }

            // Create essays and attach same words
            foreach ($config['essays'] as $essayData) {
                $essay = Essay::create([
                    'user_id' => $student->id,
                    'tutor_id' => $tutor->id,
                    'bucket_id' => $bucket->id,
                    'title' => $essayData['title'],
                    'content' => $essayData['content'] ?? 'This is a submitted essay for review.',
                    'feedback' => '',
                    'status' => 'submitted',
                ]);

                // Attach words to essay using Eloquent relationship
                foreach ($config['words'] as $wordText) {
                    $normalizedWord = trim(strtolower($wordText));
                    // Only attach if not already attached (respects unique constraint)
                    if (!$essay->words()->where('word_id', $words[$normalizedWord]->id)->exists()) {
                        $essay->words()->attach($words[$normalizedWord]->id);
                    }
                }
            }
        }
    }
}
