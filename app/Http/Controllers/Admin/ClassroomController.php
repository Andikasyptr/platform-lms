<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;



class ClassroomController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Classrooms/Index', [
            'classrooms' => Classroom::with('teacher:id,name')
                ->withCount('students')
                ->latest()
                ->get(),
            'teachers' => User::where('role', 'teacher')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'teacher_id' => 'nullable|exists:users,id',
        ]);

        Classroom::create([
            'name' => $request->name,
            'description' => $request->description,
            'teacher_id' => $request->teacher_id,
            'code' => strtoupper(Str::random(6)), // Generate kode kelas otomatis
        ]);

        return back()->with('success', 'Kelas berhasil dibuat');
    }

    public function update(Request $request, Classroom $classroom)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'teacher_id' => 'nullable|exists:users,id',
        ]);

        $classroom->update($request->only('name', 'description', 'teacher_id'));

        return back()->with('success', 'Data kelas diperbarui');
    }

    public function destroy(Classroom $classroom)
    {
        $classroom->delete();
        return back()->with('success', 'Kelas berhasil dihapus');
    }
}