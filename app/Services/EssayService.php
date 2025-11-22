<?php

namespace App\Services;

use App\Models\BucketWordJoin;
use App\Models\Essay;
use App\Models\EssayWordJoin;
use App\Models\EssayVisibility;
use App\Models\User;
use App\Notifications\EssayAssignedToTutor;

class EssayService
{
    protected ?ReviewService $reviewService = null;

    public function __construct(?ReviewService $reviewService = null)
    {
        $this->reviewService = $reviewService;
    }
    public function storeEssay(array $validated, User $user): Essay
    {
        $status = $validated['status'] ?? 'submitted';

        $essay = Essay::create([
            'title' => $validated['title'],
            'bucket_id' => $validated['bucket_id'],
            'content' => $validated['content'],
            'feedback' => '',
            'user_id' => $user->id,
            'tutor_id' => $validated['tutor_id'] ?? null,
            'primary_reviewer_id' => $validated['tutor_id'] ?? null,
            'status' => $status,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Create visibility record (defaults to private)
        EssayVisibility::create([
            'essay_id' => $essay->id,
            'visibility_type' => 'private',
            'allow_anonymous' => true,
        ]);

        $this->attachWordToEssay($essay->id, $validated['words']);

        // Only notify tutor if essay is submitted (not draft)
        if ($status === 'submitted' && $essay->tutor) {
            $essay->tutor->notify(new EssayAssignedToTutor($essay));

            // Create review session for backward compatibility
            if ($this->reviewService) {
                $this->reviewService->createReview(
                    $essay,
                    $essay->tutor_id,
                    'tutor'
                );
            }
        }

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