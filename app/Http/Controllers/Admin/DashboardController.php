<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Classroom;
use App\Models\Subject;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [ // Ubah jalur render ke Admin/Dashboard
            'stats' => [
                'total_teachers' => User::where('role', 'teacher')->count() ?? 0,
                'total_students' => User::where('role', 'student')->count() ?? 0,
                'total_classrooms' => Classroom::count() ?? 0,
                'total_subjects' => Subject::count() ?? 0,
            ]
        ]);
    }
}