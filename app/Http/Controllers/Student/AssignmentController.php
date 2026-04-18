<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission; // 1. WAJIB IMPORT INI
use Inertia\Inertia;

class AssignmentController extends Controller
{
    public function show(Assignment $assignment)
    {
        // 2. GANTI $assignment.id MENJADI $assignment->id
        $submission = Submission::where('assignment_id', $assignment->id)
            ->where('user_id', auth()->id())
            ->first();

        return Inertia::render('Student/Assignments/Show', [
            'assignment' => $assignment,
            'submission' => $submission
        ]);
    }
}