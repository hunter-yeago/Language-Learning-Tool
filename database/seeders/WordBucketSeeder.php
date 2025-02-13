<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WordBucket;
use App\Models\Word;

class WordBucketSeeder extends Seeder
{
    public function run()
    {
        // Define some example word buckets with words
        $buckets = [
            [
                'title' => 'Nature Words',
                'words' => ['tree', 'river', 'mountain', 'cloud', 'flower'],
            ],
            [
                'title' => 'Action Words',
                'words' => ['run', 'jump', 'swim', 'climb', 'throw'],
            ],
        ];

        // Loop through each bucket and create the corresponding records
        foreach ($buckets as $bucketData) {
            $bucket = WordBucket::create(['title' => $bucketData['title']]);

            foreach ($bucketData['words'] as $word) {
                Word::create([
                    'word' => $word,
                    'word_bucket_id' => $bucket->id,
                ]);
            }
        }
    }
}
