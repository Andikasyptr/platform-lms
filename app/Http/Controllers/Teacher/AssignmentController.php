<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AssignmentController extends Controller
{
    /**
     * Menyimpan tugas baru
     */
    public function store(Request $request)
    {
        // 1. Tambahkan mimes excel (xls, xlsx) sesuai permintaan lu sebelumnya
        $request->validate([
            'subject_assignment_id' => 'required|exists:subject_assignments,id',
            'title'                 => 'required|string|max:255',
            'description'           => 'required|string', // CKEditor ngirim string HTML
            'due_date'              => 'required',
            'points'                => 'required|integer|min:0', // Max dihapus biar fleksibel kalau mau > 100
            'attachment'            => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png|max:10240',
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            // Simpan file dengan nama asli atau random di folder assignments/attachments
            $attachmentPath = $request->file('attachment')->store('assignments/attachments', 'public');
        }

        // 2. Gunakan create dengan data yang sudah divalidasi
        Assignment::create([
            'subject_assignment_id' => $request->subject_assignment_id,
            'title'                 => $request->title,
            // Slug unik biar nggak tabrakan kalau judulnya sama
            'slug'                  => Str::slug($request->title) . '-' . Str::random(5),
            'description'           => $request->description,
            'due_date'              => $request->due_date,
            'points'                => $request->points,
            'attachment'            => $attachmentPath,
        ]);

        return redirect()->back()->with('success', 'Tugas berhasil diterbitkan!');
    }

    /**
     * Menampilkan detail tugas dan daftar pengumpulan siswa
     */
    public function show($id)
    {
        $assignment = Assignment::findOrFail($id);
        
        // Ambil submissions, urutkan dari yang terbaru mengumpulkan
        $submissions = Submission::where('assignment_id', $id)
            ->with('user') 
            ->latest() // defaultnya created_at/submitted_at
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

        // Hapus file fisik di storage biar nggak menuhi server
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

        $submission = Submission::findOrFail($id);
        
        $submission->update([
            'score' => $request->score,
            'teacher_feedback' => $request->teacher_feedback,
            'graded_at' => now(), // Opsional: catat waktu pemberian nilai
        ]);

        return redirect()->back()->with('success', 'Nilai berhasil diperbarui!');
    }
}