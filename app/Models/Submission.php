<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'assignment_id',
        'content',
        'file_path',
        'score',
        'teacher_feedback',
        'submitted_at',
    ];

    /**
     * Relasi ke Siswa yang mengumpulkan
     */
    public function user() 
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Tugas terkait
     */
    public function assignment() 
    {
        return $this->belongsTo(Assignment::class);
    }
}