<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Essay;
use App\Notifications\EssayAssignedToTutor;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class EssayService extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Create a new essay
     * 
     * @param array $data Validated essay data
     * @return Essay The created essay
     */
    public function createEssay(array $data): Essay
    {
        $essay = Essay::create([
            'title' => $data['title'],
            'bucket_id' => $data['bucket_id'],
            'content' => $data['content'],
            'user_id' => Auth::id(),
            'tutor_id' => $data['tutor_id'],
            'status' => 'submitted',
        ]);

        return $essay;
    }

    /**
     * Trigger notification about a new essay submission
     * 
     * @param Essay $essay The essay to notify about
     * @return void
     */
    public function notifiyAboutSubmission(Essay $essay): void
    {
        // event(new EssaySubmitted($essay));
    }

    /**
     * Update essay status
     * 
     * @param Essay $essay The essay to update
     * @param string $status New status value
     * @return Essay Updated essay
     */
    public function updateStatus(Essay $essay, string $status): Essay
    {
        $essay->status = $status;
        $essay->save(); 

        return $essay;
    }

    /**
     * Check if the current user is authorized to edit essay
     * 
     * @param Essay $essay - Thee essay to check
     * @return bool Authorization result
     */
    public function canEditEssay(Essay $essay): bool
    {
        return $essay->tutor_id === Auth::id();
    }

}
