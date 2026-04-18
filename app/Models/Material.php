<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject_assignment_id',
        'title',
        'description',
        'type',
        'content',
        'file_path',
    ];

    // Relasi balik ke SubjectAssignment (opsional tapi disarankan)
    public function subjectAssignment()
    {
        return $this->belongsTo(SubjectAssignment::class);
    }

public function users() {
    return $this->belongsToMany(\App\Models\User::class, 'material_completions');
}
}