<?php

namespace App\Models;

use App\Concerns\HasTeams;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, HasTeams, Notifiable, TwoFactorAuthenticatable;

    // Gunakan properti standar agar lebih stabil
    protected $fillable = [
        'name', 
        'email', 
        'password', 
        'current_team_id', 
        'role',
        'classroom_id' // Tambahkan ini jika user/siswa punya classroom_id
    ];

    protected $hidden = [
        'password', 
        'two_factor_secret', 
        'two_factor_recovery_codes', 
        'remember_token'
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    // Role Helpers
    public function isAdmin(): bool { return $this->role === 'admin'; }
    public function isTeacher(): bool { return $this->role === 'teacher'; }
    public function isStudent(): bool { return $this->role === 'student'; }

    /**
     * Relasi: Guru memiliki banyak Kelas
     */
    public function classrooms(): HasMany
    {
        return $this->hasMany(Classroom::class, 'teacher_id');
    }

    public function enrollments()
{
    return $this->hasMany(Enrollment::class, 'student_id');
}

public function student()
{
    return $this->hasOne(Student::class); 
    // Pastikan 'student_id' ada di tabel students yang merujuk ke 'id' di tabel users
}

public function teacher()
{
    return $this->belongsTo(User::class, 'teacher_id');
}

public function completedMaterials() {
    return $this->belongsToMany(\App\Models\Material::class, 'material_completions')
                ->withTimestamps();
}
}