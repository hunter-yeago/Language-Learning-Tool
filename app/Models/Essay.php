<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Essay extends Model
{
    use HasFactory;
    protected $table = "essays";
    
    // only these two can be mass assigned
    protected $fillable = [
        'title',
        'content',
        'user_id',
        'bucket_id',
        'tutor_id',
        'primary_reviewer_id',
        'feedback',
        'status',
        'viewed',
        'notes',
        'requires_student_review',
        'student_reviewed_at',
    ];

    protected $casts = [
        'viewed' => 'boolean',
        'requires_student_review' => 'boolean',
        'student_reviewed_at' => 'datetime',
    ];

    public function words()
    {
        // add information from a pivot table that gets sent with the essay
        return $this->belongsToMany(Word::class, 'essay_word_join')->withPivot(['grade', 'comment']);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bucket()
    {
        return $this->belongsTo(Bucket::class);
    }

    public function tutor()
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    /**
     * Check if the essay is in draft status
     */
    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    /**
     * Check if the essay has been submitted
     */
    public function isSubmitted(): bool
    {
        return in_array($this->status, ['submitted', 'under_review', 'graded']);
    }

    /**
     * Return essay to draft status (used when tutor disconnects)
     */
    public function returnToDraft(): void
    {
        $this->update([
            'status' => 'draft',
            'tutor_id' => null,
        ]);
    }

    /**
     * Get the primary reviewer
     */
    public function primaryReviewer()
    {
        return $this->belongsTo(User::class, 'primary_reviewer_id');
    }

    /**
     * Get all reviews for this essay
     */
    public function reviews()
    {
        return $this->hasMany(EssayReview::class);
    }

    /**
     * Get visibility settings
     */
    public function visibility()
    {
        return $this->hasOne(EssayVisibility::class);
    }

    /**
     * Get completed reviews
     */
    public function completedReviews()
    {
        return $this->reviews()->where('status', 'completed');
    }

    /**
     * Check if essay has multiple reviews
     */
    public function hasMultipleReviews(): bool
    {
        return $this->completedReviews()->count() > 1;
    }

    /**
     * Check if essay is publicly accessible
     */
    public function isPublic(): bool
    {
        return $this->visibility && $this->visibility->isAccessible();
    }
}
