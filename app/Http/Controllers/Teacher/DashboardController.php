<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Enrollment;
use App\Models\SubjectAssignment;
use App\Models\Material; // 1. Tambahkan import Model Material
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Ambil semua ID penugasan (mapel) yang diampu guru ini
        $myAssignmentIds = SubjectAssignment::where('teacher_id', $user->id)->pluck('id');

        // Hitung statistik secara real-time dari database
        $teacherStats = [
            // Hitung berapa kelas unik yang diajar guru ini
            'my_classes' => SubjectAssignment::where('teacher_id', $user->id)
                ->distinct('classroom_id')
                ->count('classroom_id'),

            // Hitung Enrollment yang pending pada mapel milik guru ini
            'pending_students' => Enrollment::whereIn('subject_assignment_id', $myAssignmentIds)
                ->where('status', 'pending')
                ->count(),

            // 2. HITUNG MATERI: Ambil jumlah materi yang dibuat guru ini melalui relasi subject_assignment
            'total_materials' => Material::whereIn('subject_assignment_id', $myAssignmentIds)
                ->count(),
        ];

        // Ambil list kelas untuk ditampilkan di grid bawah
        $myClassrooms = Classroom::whereHas('subjectAssignments', function ($q) use ($user) {
            $q->where('teacher_id', $user->id);
        })->with(['subjectAssignments' => function ($q) use ($user) {
            $q->where('teacher_id', $user->id)->with('subject');
        }])->get();

        return Inertia::render('Teacher/Dashboard', [
            'teacherStats' => $teacherStats,
            'myClassrooms' => $myClassrooms,
        ]);
    }
}