<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SubjectController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Subjects/Index', [
            'subjects' => Subject::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);

        Subject::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        return back()->with('success', 'Mata pelajaran berhasil ditambahkan');
    }

    public function update(Request $request, Subject $subject)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $subject->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        return back()->with('success', 'Mata pelajaran diperbarui');
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();
        return back()->with('success', 'Mata pelajaran dihapus');
    }
}