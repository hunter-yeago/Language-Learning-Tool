<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class TutorInvitation extends Model
{
    protected $fillable = [
        'tutor_id',
        'email',
        'token',
        'status',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Get the tutor who sent the invitation
     */
    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    /**
     * Check if the invitation has expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Check if the invitation is still pending and valid
     */
    public function isPending(): bool
    {
        return $this->status === 'pending' && !$this->isExpired();
    }

    /**
     * Mark invitation as accepted
     */
    public function markAsAccepted(): void
    {
        $this->update(['status' => 'accepted']);
    }

    /**
     * Mark invitation as rejected
     */
    public function markAsRejected(): void
    {
        $this->update(['status' => 'rejected']);
    }

    /**
     * Mark invitation as cancelled
     */
    public function markAsCancelled(): void
    {
        $this->update(['status' => 'cancelled']);
    }
}
