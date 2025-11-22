<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StudentDisconnected extends Notification
{
    use Queueable;

    protected $tutor;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $tutor)
    {
        $this->tutor = $tutor;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Tutor Connection Removed')
            ->line($this->tutor->name . ' has disconnected from you.')
            ->line('Any essays that were waiting to be graded have been returned to your drafts.')
            ->action('View Profile', route('profile'))
            ->line('You can still connect with other tutors.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'tutor_name' => $this->tutor->name,
            'tutor_id' => $this->tutor->id,
            'message' => $this->tutor->name . ' has disconnected from you. Any pending essays have been returned to drafts.',
        ];
    }
}
