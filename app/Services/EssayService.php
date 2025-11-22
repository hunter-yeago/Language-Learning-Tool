<?php

namespace App\Services;

use App\Models\BucketWordJoin;
use App\Models\Essay;
use App\Models\EssayWordJoin;
use App\Models\User;
use App\Notifications\EssayAssignedToTutor;

class EssayService
{
    public function storeEssay(array $validated, User $user): Essay
    {
        $essay = Essay::create([
            'title' => $validated['title'],
            'bucket_id' => $validated['bucket_id'],
            'content' => $validated['content'],
            'feedback' => '',
            'user_id' => $user->id,
            'tutor_id' => $validated['tutor_id'],
            'status' => 'submitted',
            'notes' => $validated['notes'] ?? null,
        ]);

        $this->attachWordToEssay($essay->id, $validated['words']);
        $essay->tutor?->notify(new EssayAssignedToTutor($essay));

        return $essay;
    }

    public function attachWordToEssay(int $essay_id, array $words): void
    {

        foreach ($words as $word) {

            if (!$word['used']) continue;

            EssayWordJoin::updateOrCreate(
                ['essay_id' => $essay_id, 'word_id' => $word['id']],
                ['used_in_essay' => true]
            );
        }

    }

    public function update_essay(Essay $essay, array $words, string $feedback)
    {
        $essay->update([
            'feedback' => $feedback,
            'status' => 'graded',
        ]);

        $this->updateWordGrades($essay, $words);
    }

    private function updateWordGrades(Essay $essay, array $words)
    {

        foreach ($words as $word) {
            
            $essay_word_join = EssayWordJoin::where('essay_id', $essay->id)
            ->where('word_id', $word['id'])
            ->first();
            
            $bucket_word_join = BucketWordJoin::where('bucket_id', $essay->bucket_id)
                ->where('word_id', $word['id'])
                ->first();

            $new_grade = $word['pivot']['grade'];
            $previous_grade = $essay_word_join->grade;
            
            
            if ($new_grade !== $previous_grade) {
                $essay_word_join->grade = $word['pivot']['grade'];
                $bucket_word_join->grade = $word['pivot']['grade'];
            }

            if ($word['pivot']['comment']) {
                $essay_word_join->comment = $word['pivot']['comment'];
            }

            if ($essay_word_join->isDirty('grade') || $essay_word_join->isDirty('comment')) {
                $essay_word_join->save();
            }

            if ($bucket_word_join->isDirty('grade')) {
                $bucket_word_join->save();
            }
        }
    }   

}