<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SubmissionController extends Controller
{
    public function store(Request $request, Assignment $assignment)
{
    $request->validate([
        'content' => 'nullable|string',
        'file' => 'nullable|file|mimes:pdf,zip,jpg,png|max:10240', // Saya naikkan ke 10MB jika perlu
    ]);

    // Cari submission lama jika ada
    $submission = Submission::where('assignment_id', $assignment->id)
        ->where('user_id', auth()->id())
        ->first();

    $filePath = $submission ? $submission->file_path : null;

    // Jika ada file baru yang diunggah
    if ($request->hasFile('file')) {
        // Hapus file lama dari storage agar tidak memenuhi disk
        if ($submission && $submission->file_path) {
            Storage::disk('public')->delete($submission->file_path);
        }
        // Simpan file baru
        $filePath = $request->file('file')->store('submissions', 'public');
    }

    Submission::updateOrCreate(
        [
            'assignment_id' => $assignment->id,
            'user_id' => auth()->id(),
        ],
        [
            'content' => $request->content,
            'file_path' => $filePath,
            'submitted_at' => now(),
        ]
    );

    return back()->with('success', 'Tugas berhasil dikumpulkan!');
}
}