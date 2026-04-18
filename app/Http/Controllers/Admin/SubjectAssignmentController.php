<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubjectAssignment;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectAssignmentController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Assignments/Index', [
            'assignments' => SubjectAssignment::with(['classroom', 'subject', 'teacher'])->latest()->get(),
            'classrooms' => Classroom::all(['id', 'name']),
            'subjects' => Subject::all(['id', 'name']),
            'teachers' => User::where('role', 'teacher')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'classroom_id' => 'required',
            'subject_id' => 'required',
            'teacher_id' => 'required',
        ]);

        SubjectAssignment::create($request->all());
        return back()->with('success', 'Jadwal berhasil dibuat');
    }

    public function destroy(SubjectAssignment $subjectAssignment)
    {
        $subjectAssignment->delete();
        return back()->with('success', 'Jadwal berhasil dihapus');
    }

    public function update(Request $request, $id) // atau (Request $request, SubjectAssignment $subjectAssignment)
{
    $request->validate([
        'classroom_id' => 'required',
        'subject_id'   => 'required',
        'teacher_id'   => 'required',
        'day'          => 'required',
        'start_time'   => 'required',
        'end_time'     => 'required',
    ]);

    // Jika menggunakan $id
    $assignment = \App\Models\SubjectAssignment::findOrFail($id);
    
    $assignment->update([
        'classroom_id' => $request->classroom_id,
        'subject_id'   => $request->subject_id,
        'teacher_id'   => $request->teacher_id,
        'day'          => $request->day,
        'start_time'   => $request->start_time,
        'end_time'     => $request->end_time,
    ]);

    return redirect()->back();
}
}