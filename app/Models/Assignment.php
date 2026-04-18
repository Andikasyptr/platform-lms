<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Assignment extends Model
{
    protected $fillable = [
        'subject_assignment_id',
        'title',
        'slug',
        'description',
        'due_date',
        'points',
        'attachment',
    ];

    /**
     * Relasi balik ke SubjectAssignment
     */
    public function subjectAssignment(): BelongsTo
    {
        return $this->belongsTo(SubjectAssignment::class);
    }

    public function submissions()
{
    return $this->hasMany(Submission::class);
}

// Relasi untuk mengecek apakah user login sudah mengumpulkan
public function userSubmission()
{
    return $this->hasOne(Submission::class)->where('user_id', auth()->id());
}
}