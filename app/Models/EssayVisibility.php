<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class EssayVisibility extends Model
{
    protected $table = 'essay_visibility';

    protected $fillable = [
        'essay_id',
        'visibility_type',
        'public_url_token',
        'allow_anonymous',
        'expires_at',
    ];

    protected $casts = [
        'allow_anonymous' => 'boolean',
        'expires_at' => 'datetime',
    ];

    /**
     * Get the essay this visibility belongs to
     */
    public function essay(): BelongsTo
    {
        return $this->belongsTo(Essay::class);
    }

    /**
     * Check if essay is public
     */
    public function isPublic(): bool
    {
        return $this->visibility_type === 'public' && !$this->isExpired();
    }

    /**
     * Check if essay is unlisted (accessible via link but not discoverable)
     */
    public function isUnlisted(): bool
    {
        return $this->visibility_type === 'unlisted' && !$this->isExpired();
    }

    /**
     * Check if essay is private
     */
    public function isPrivate(): bool
    {
        return $this->visibility_type === 'private';
    }

    /**
     * Check if visibility has expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Check if essay is accessible (public or unlisted and not expired)
     */
    public function isAccessible(): bool
    {
        return ($this->isPublic() || $this->isUnlisted()) && !$this->isExpired();
    }

    /**
     * Generate a new public URL token
     */
    public function generateToken(): string
    {
        $this->public_url_token = Str::random(32);
        $this->save();

        return $this->public_url_token;
    }

    /**
     * Get the public URL for this essay
     */
    public function getPublicUrl(): ?string
    {
        if (!$this->public_url_token) {
            return null;
        }

        return route('public.essay', ['token' => $this->public_url_token]);
    }

    /**
     * Make essay public
     */
    public function makePublic(): void
    {
        $this->update([
            'visibility_type' => 'public',
            'public_url_token' => $this->public_url_token ?? Str::random(32),
        ]);
    }

    /**
     * Make essay unlisted
     */
    public function makeUnlisted(): void
    {
        $this->update([
            'visibility_type' => 'unlisted',
            'public_url_token' => $this->public_url_token ?? Str::random(32),
        ]);
    }

    /**
     * Make essay private
     */
    public function makePrivate(): void
    {
        $this->update(['visibility_type' => 'private']);
    }

    /**
     * Set expiration date
     */
    public function setExpiration($days): void
    {
        $this->update([
            'expires_at' => now()->addDays($days),
        ]);
    }
}
