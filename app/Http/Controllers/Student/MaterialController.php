<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function show(Material $material)
    {
        // Pastikan siswa terdaftar di kelas ini (Opsional tapi bagus buat security)
        
        return Inertia::render('Student/Materials/Show', [
            'material' => $material
        ]);
    }
}