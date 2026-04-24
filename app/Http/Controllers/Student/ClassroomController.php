<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Enrollment;
use App\Models\SubjectAssignment;
use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;


class ClassroomController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = auth()->id();
        $search = $request->input('search');

        $classrooms = Classroom::with(['subjectAssignments.subject', 'subjectAssignments.teacher'])
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->latest()
            ->get();

        $myEnrollments = Enrollment::where('user_id', $userId)
            ->pluck('status', 'subject_assignment_id')
            ->toArray();

        return Inertia::render('Student/Classrooms/Index', [
            'classrooms' => $classrooms,
            'myEnrollments' => (object) $myEnrollments, 
            'filters' => $request->only(['search']),
        ]);
    }

    public function myClass(): Response
    {
        $userId = auth()->id();

        $myClasses = Enrollment::where('user_id', $userId)
            ->where('status', Enrollment::STATUS_APPROVED)
            ->with([
                'subjectAssignment.subject', 
                'subjectAssignment.teacher', 
                'subjectAssignment.classroom'
            ])
            ->latest()
            ->get();

        return Inertia::render('Student/Classrooms/MyClass', [
            'myClasses' => $myClasses
        ]);
    }

    public function show($id): Response
    {
        $userId = auth()->id();

        Enrollment::where('user_id', $userId)
            ->where('subject_assignment_id', $id)
            ->where('status', Enrollment::STATUS_APPROVED)
            ->firstOrFail();

        $assignment = SubjectAssignment::with([
            'subject', 
            'teacher',
            'classroom',
            'materials' => function($query) use ($userId) {
                $query->orderBy('id', 'asc')
                    ->withExists(['users as is_completed' => function($q) use ($userId) {
                        $q->where('user_id', $userId);
                    }]);
            }, 
            'assignments' => function($query) use ($userId) {
                $query->latest()
                    // PENAMBAHAN: Cek apakah tugas sudah dikumpulkan oleh siswa ini
                    ->withExists(['submissions as is_submitted' => function($q) use ($userId) {
                        $q->where('user_id', $userId);
                    }]);
            }
        ])->findOrFail($id);

        return Inertia::render('Student/Classrooms/Show', [
            'assignment' => $assignment
        ]);
    }

    public function markAsComplete(Request $request, $materialId)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        Material::findOrFail($materialId);
        $user->completedMaterials()->syncWithoutDetaching([$materialId]);

        return back()->with('success', 'Materi berhasil diselesaikan!');
    }

    public function enroll(Request $request): RedirectResponse
    {
        $request->validate(['subject_assignment_id' => 'required|exists:subject_assignments,id']);
        $userId = auth()->id();
        $assignmentId = $request->subject_assignment_id;

        if (Enrollment::where('user_id', $userId)->where('subject_assignment_id', $assignmentId)->exists()) {
            return back()->with('error', 'Kamu sudah mengirim permintaan pendaftaran.');
        }

        Enrollment::create([
            'user_id' => $userId,
            'subject_assignment_id' => $assignmentId,
            'status' => Enrollment::STATUS_PENDING,
        ]);

        return back()->with('success', 'Pendaftaran berhasil dikirim!');
    }

    public function cancelEnroll($id): RedirectResponse
    {
        Enrollment::where('user_id', auth()->id())
            ->where('subject_assignment_id', $id)
            ->where('status', Enrollment::STATUS_PENDING)
            ->firstOrFail()->delete();

        return back()->with('success', 'Pendaftaran berhasil dibatalkan.');
    }
}