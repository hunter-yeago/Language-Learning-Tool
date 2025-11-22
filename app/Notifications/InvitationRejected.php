<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class InvitationRejected extends Notification
{
    use Queueable;

    protected User $student;

    public function __construct(User $student)
    {
        $this->student = $student;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => "{$this->student->name} ({$this->student->email}) has rejected your invitation.",
            'student_id' => $this->student->id,
            'student_name' => $this->student->name,
            'student_email' => $this->student->email,
        ];
    }
}
