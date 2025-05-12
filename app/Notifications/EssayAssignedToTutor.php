<?php

namespace App\Notifications;

use App\Models\Essay;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class EssayAssignedToTutor extends Notification
{
    use Queueable;

    protected $essay;

    /**
     * Create a new notification instance.
     */
    public function __construct(Essay $essay)
    {
        $this->essay = $essay;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database']; // Send notification via both mail and database
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {

        Log::info('Sending notification to tutor', ['tutor' => $notifiable->id]);

        return (new MailMessage)
            ->line('You have been assigned a new essay to review.')
            ->line('Essay Title: ' . $this->essay->title)
            ->action('Review Essay', url('/essays/'.$this->essay->id));
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'essay_id' => $this->essay->id,
            'title' => $this->essay->title,
            'message' => 'You have a new essay to review.',
            'status' => $this->essay->status, // Add any additional data here if necessary
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'essay_id' => $this->essay->id,
            'title' => $this->essay->title,
            'message' => 'You have a new essay to review.',
            'status' => $this->essay->status,
        ];
    }
}
