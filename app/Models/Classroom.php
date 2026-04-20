<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Classroom extends Model
{
    use HasFactory;

    // Menentukan nama tabel secara eksplisit sesuai database kamu
    protected $table = 'classrooms';

    protected $fillable = [
        'name',
        'description',
        'teacher_id',
        'code',
    ];

    /**
     * Relasi ke Guru (User yang memiliki role teacher)
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Relasi ke Siswa
     * Method ini WAJIB ada karena ClassroomController@index memanggil withCount('students')
     */
    public function students(): HasMany
    {
        // Mencari di tabel users berdasarkan kolom classroom_id
        return $this->hasMany(User::class, 'classroom_id');
    }

    public function subjectAssignments(): HasMany
    {
        // Pastikan nama model Target adalah SubjectAssignment
        return $this->hasMany(SubjectAssignment::class);
    }
}