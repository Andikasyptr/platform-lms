<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class SubjectAssignment extends Model
{
    protected $fillable = [
        'classroom_id', 
        'subject_id', 
        'teacher_id', 
        'day', 
        'start_time', 
        'end_time'
    ];

    // --- RELASI DASAR ---

    public function classroom(): BelongsTo 
    { 
        return $this->belongsTo(Classroom::class); 
    }

    public function subject(): BelongsTo 
    { 
        return $this->belongsTo(Subject::class); 
    }

    public function teacher(): BelongsTo 
    { 
        return $this->belongsTo(User::class, 'teacher_id'); 
    }

    // --- RELASI FUNGSIONAL ---

    /**
     * Melihat semua materi yang diunggah untuk penugasan ini
     */
    public function materials(): HasMany 
    { 
        return $this->hasMany(Material::class); 
    }

    /**
     * Melihat data pendaftaran (raw pivot data)
     */
    public function enrollments(): HasMany 
    { 
        return $this->hasMany(Enrollment::class); 
    }

    /**
     * Langsung mengambil data Siswa yang terdaftar di penugasan ini
     */
    public function students(): HasManyThrough
    {
        return $this->hasManyThrough(
            User::class,
            Enrollment::class,
            'subject_assignment_id', // Foreign key di tabel enrollments
            'id',                    // Foreign key di tabel users
            'id',                    // Local key di tabel subject_assignments
            'student_id'             // Local key di tabel enrollments
        );
    }

    // app/Models/SubjectAssignment.php

    public function assignments()
    {
        // Sesuaikan 'Assignment' dengan nama model tugas yang kamu buat sebelumnya
        return $this->hasMany(Assignment::class, 'subject_assignment_id');
    }
}