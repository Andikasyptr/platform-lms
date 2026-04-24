<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\User; 
use App\Notifications\NewContentNotification; 
use App\Notifications\ScorePublishedNotification; // 1. IMPORT NOTIFIKASI BARU INI
use Illuminate\Support\Facades\Notification; 
use Illuminate\Support\Str;
use Inertia\Inertia;

class AssignmentController extends Controller
{
    /**
     * Menyimpan tugas baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'subject_assignment_id' => 'required|exists:subject_assignments,id',
            'title'                 => 'required|string|max:255',
            'description'           => 'required|string',
            'due_date'              => 'required',
            'points'                => 'required|integer|min:0',
            'attachment'            => 'nullable|file|mimes:pdf,doc,docx,pptx,xls,xlsx,jpg,jpeg,png|max:10240',
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('assignments/attachments', 'public');
        }

        $assignment = Assignment::create([
            'subject_assignment_id' => $request->subject_assignment_id,
            'title'                 => $request->title,
            'slug'                  => Str::slug($request->title) . '-' . Str::random(5),
            'description'           => $request->description,
            'due_date'              => $request->due_date,
            'points'                => $request->points,
            'attachment'            => $attachmentPath,
        ]);

        // Fix relasi: Gunakan plucked ID agar lebih aman dari error "student_id/user_id"
        $studentIds = \App\Models\Enrollment::where('subject_assignment_id', $request->subject_assignment_id)
            ->where('status', 'approved')
            ->pluck('user_id');

        $students = User::whereIn('id', $studentIds)->get();

        if ($students->count() > 0) {
            Notification::send($students, new NewContentNotification($assignment, 'tugas'));
        }

        return redirect()->back()->with('success', 'Tugas berhasil diterbitkan dan notifikasi email dikirim!');
    }

    /**
     * Menampilkan detail tugas dan daftar pengumpulan siswa
     */
    public function show($id)
    {
        $assignment = Assignment::findOrFail($id);
        
        $submissions = Submission::where('assignment_id', $id)
            ->with('user') 
            ->latest() 
            ->get();
            
        return Inertia::render('Teacher/Assignments/Show', [
            'assignment' => $assignment,
            'submissions' => $submissions
        ]);
    }

    /**
     * Menghapus tugas beserta filenya
     */
    public function destroy($id)
    {
        $assignment = Assignment::findOrFail($id);

        if ($assignment->attachment && Storage::disk('public')->exists($assignment->attachment)) {
            Storage::disk('public')->delete($assignment->attachment);
        }

        $assignment->delete();

        return redirect()->back()->with('success', 'Tugas berhasil dihapus!');
    }

    /**
     * Memberikan nilai ke jawaban siswa
     */
    public function grade(Request $request, $id)
    {
        $request->validate([
            'score' => 'required|integer|min:0',
            'teacher_feedback' => 'nullable|string',
        ]);

        // 2. Load submission beserta user (siswa) dan assignment-nya
        $submission = Submission::with(['user', 'assignment'])->findOrFail($id);
        
        $submission->update([
            'score' => $request->score,
            'teacher_feedback' => $request->teacher_feedback,
            'graded_at' => now(),
        ]);

        // 3. Kirim Notifikasi Email ke Siswa secara personal
        $student = $submission->user;
        if ($student && $student->email) {
            $student->notify(new ScorePublishedNotification($submission));
        }

        return redirect()->back()->with('success', 'Nilai berhasil dipublikasikan dan email terkirim ke siswa!');
    }
}