<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Enrollment extends Model
{
    use HasFactory;

    // Tambahkan atau pastikan user_id ada di sini
    protected $fillable = [
        'user_id', 
        'subject_assignment_id',
        'status',
    ];

    // Konstanta status (jika kamu menggunakannya)
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';

    /**
     * Relasi ke User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke SubjectAssignment
     */
    public function subjectAssignment()
    {
        return $this->belongsTo(SubjectAssignment::class);
    }

    // Di dalam file Enrollment.php

    // Relasi ke tabel yang mencatat materi selesai (HasMany)
    public function material_Completions()
    {
        // Sesuaikan 'student_id' dengan kolom foreign key di tabel material_completions Anda
        return $this->hasMany(MaterialCompletion::class, 'user_id', 'user_id');
    }

    // Relasi ke tabel pengumpulan tugas (HasMany)
    public function submissions()
    {
        return $this->hasMany(Submission::class, 'user_id', 'user_id');
    }
}