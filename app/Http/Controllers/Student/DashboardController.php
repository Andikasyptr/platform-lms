<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\SubjectAssignment; // Pastikan Model ini diimport
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $userId = Auth::id();
        $user = Auth::user();

        // 1. Ambil nama hari ini dalam Bahasa Indonesia (untuk dicocokkan dengan DB)
        // Jika di DB kamu hari disimpan dalam Bahasa Inggris, gunakan ->format('l')
        $today = Carbon::now()->locale('id')->isoFormat('dddd');

        /**
         * 2. Ambil pendaftaran yang sudah disetujui (Approved)
         */
        $allEnrollments = Enrollment::with([
                'subjectAssignment.classroom', 
                'subjectAssignment.subject', 
                'subjectAssignment.teacher'
            ])
            ->where('user_id', $userId)
            ->latest()
            ->get();

        $approvedEnrollments = $allEnrollments->where('status', 'approved');

        /**
         * 3. Ambil Jadwal Hari Ini
         * Filter berdasarkan Classroom yang diikuti oleh user dan statusnya approved
         */
        $classroomIds = $approvedEnrollments->pluck('subjectAssignment.classroom_id')->unique();

        $schedules = SubjectAssignment::with(['subject', 'teacher', 'classroom'])
            ->whereIn('classroom_id', $classroomIds)
            ->where('day', $today) // Mencocokkan kolom 'day'
            ->orderBy('start_time', 'asc')
            ->get();

        /**
         * 4. Kalkulasi Stats
         */
        $stats = [
            'enrolled_classes'   => $approvedEnrollments->count(),
            'pending_approvals'  => $allEnrollments->where('status', 'pending')->count(),
            'active_assignments' => 0, // Placeholder
        ];

        return Inertia::render('Student/Dashboard', [
            'activeEnrollments' => $approvedEnrollments->values(), // values() untuk me-reset index array
            'enrollments'       => $allEnrollments,
            'schedules'         => $schedules, // Data jadwal baru
            'stats'             => $stats,
            'user'              => [
                'name' => $user->name,
            ]
        ]);
    }
}