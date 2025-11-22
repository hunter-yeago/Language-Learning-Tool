<?php

namespace App\Notifications;

use App\Models\TutorInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TutorInvitationSent extends Notification
{
    use Queueable;

    protected $invitation;

    /**
     * Create a new notification instance.
     */
    public function __construct(TutorInvitation $invitation)
    {
        $this->invitation = $invitation;
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
        $acceptUrl = route('invitation.accept', ['token' => $this->invitation->token]);

        return (new MailMessage)
            ->subject('New Tutor Invitation')
            ->line($this->invitation->tutor->name . ' has invited you to connect as their student!')
            ->line('This will allow them to review and grade your essays.')
            ->action('View Invitation', $acceptUrl)
            ->line('This invitation will expire in 14 days.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'invitation_id' => $this->invitation->id,
            'tutor_name' => $this->invitation->tutor->name,
            'tutor_id' => $this->invitation->tutor_id,
            'message' => $this->invitation->tutor->name . ' has invited you to connect as their student.',
            'token' => $this->invitation->token,
        ];
    }
}
