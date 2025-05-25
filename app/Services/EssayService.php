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
        ]);

        foreach ($validated['words'] as $word) {
            $this->attachWordToEssay($essay, $word);
        }

        $essay->tutor?->notify(new EssayAssignedToTutor($essay));

        return $essay;
    }

    public function attachWordToEssay(Essay $essay, array $word)
    {
        $essayWordJoin = EssayWordJoin::firstOrNew([
            'essay_id' => $essay->id,
            'word_id' => $word['id'],
        ]);

        $bucketWordJoinWord = BucketWordJoin::where('bucket_id', $essay->bucket_id)
            ->where('word_id', $word['id'])
            ->first();

            dd($essayWordJoin);

        if ($this->shouldUpdateGradeDuringWriteEssay($essayWordJoin->grade)) {
            $essayWordJoin->grade = $bucketWordJoinWord->grade ?? ($word['used'] ? 'used_in_essay' : 'attempted_but_not_used');
        }

        if ($essayWordJoin->isDirty('grade')) {
            $essayWordJoin->save();
        }

        $bucketWordJoin = BucketWordJoin::firstOrCreate([
            'word_id' => $word['id'],
            'bucket_id' => $essay->bucket_id,
        ]);

        dd($essayWordJoin);

        if ($this->shouldUpdateGradeDuringWriteEssay($bucketWordJoin->grade)) {
            $bucketWordJoin->grade = $word['used'] ? 'used_in_essay' : 'attempted_but_not_used';
        }

        if ($bucketWordJoin->isDirty('grade')) {
            $bucketWordJoin->increment('times_used_in_essay');
            $bucketWordJoin->increment('times_in_word_bank');
            $bucketWordJoin->save();
        }
    }

    public function update_essay(Essay $essay, array $words, string $feedback)
    {
        $essay->update([
            'feedback' => $feedback,
            'status' => 'graded',
        ]);

        foreach ($words as $word) {
            $this->updateWordGrades($essay, $word);
        }
    }

    private function updateWordGrades(Essay $essay, array $word)
    {
        
        $bucketWordJoin = BucketWordJoin::where('bucket_id', $essay->bucket_id)
            ->where('word_id', $word['id'])
            ->first();

        if ($this->shouldUpdateGrade($bucketWordJoin->grade, $word['pivot']['grade'])) {
            $bucketWordJoin->grade = $word['pivot']['grade'];
        }

        if ($word['pivot']['comment']) {
            $bucketWordJoin->comment = $word['pivot']['comment'];
        }

        if ($bucketWordJoin->isDirty('grade') || $bucketWordJoin->isDirty('comment')) {
            $bucketWordJoin->save();
        }

        $essayWordJoin = EssayWordJoin::where('essay_id', $essay->id)
            ->where('word_id', $word['id'])
            ->first();

        if ($this->shouldUpdateGrade($essayWordJoin->grade, $word['pivot']['grade'])) {
            $essayWordJoin->grade = $word['pivot']['grade'];
        }

        if ($word['pivot']['comment']) {
            $essayWordJoin->comment = $word['pivot']['comment'];
        }

        if ($essayWordJoin->isDirty('grade') || $essayWordJoin->isDirty('comment')) {
            $essayWordJoin->save();
        }
    }
    private function shouldUpdateGradeDuringWriteEssay($previousGrade): bool
        {
            return !in_array($previousGrade, ['correct', 'partially_correct', 'incorrect', 'used_in_essay']);
        }

    private function shouldUpdateGrade(?string $previousGrade, ?string $newGrade): bool
    {
        return (
            in_array($previousGrade, ['used_in_essay', 'correct', 'incorrect', 'partially_correct', 'not_attempted']) &&
            !in_array($newGrade, ['used_in_essay', 'attempted_but_not_used'])
        );
    }
}