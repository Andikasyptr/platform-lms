<?php

namespace App\Models; // Ini harus sesuai dengan folder-nya

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    // Pastikan relasi balik ke User juga ada (opsional tapi disarankan)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}