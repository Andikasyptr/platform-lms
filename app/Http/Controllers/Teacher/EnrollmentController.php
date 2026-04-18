<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\SubjectAssignment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    /**
     * Menampilkan daftar pendaftaran yang berstatus 'pending' 
     * untuk divalidasi oleh Guru.
     */
    public function index()
    {
        $user = auth()->user();

        $enrollments = Enrollment::with([
                'user', 
                'subjectAssignment.classroom', 
                'subjectAssignment.subject'
            ])
            ->whereHas('subjectAssignment', function ($q) use ($user) {
                $q->where('teacher_id', $user->id);
            })
            ->where('status', 'pending')
            ->latest()
            ->get();

        return Inertia::render('Teacher/Enrollments/Index', [
            'enrollments' => $enrollments
        ]);
    }

    /**
     * Menyetujui atau Menolak pendaftaran siswa (hanya untuk status pending).
     */
    public function updateStatus(Request $request)
    {
        $request->validate([
            'enrollment_id' => 'required|exists:enrollments,id',
            'status' => 'required|in:approved,rejected'
        ]);

        $enrollment = Enrollment::findOrFail($request->enrollment_id);
        
        // Proteksi: pastikan guru yang approve adalah pemilik kelas/mapel tersebut
        $assignment = SubjectAssignment::findOrFail($enrollment->subject_assignment_id);
        if ($assignment->teacher_id !== auth()->id()) {
            abort(403, 'Tindakan tidak diizinkan.');
        }

        if ($request->status === 'rejected') {
            // Hapus data pendaftaran jika ditolak agar siswa bisa mendaftar ulang jika perlu
            $enrollment->delete();
            return back()->with('success', 'Pendaftaran siswa telah ditolak.');
        }

        // Update status menjadi 'approved'
        $enrollment->update(['status' => 'approved']);

        return back()->with('success', 'Siswa berhasil bergabung ke kelas!');
    }

    /**
     * FITUR KICK: Mengeluarkan siswa dari kelas.
     * Digunakan pada tombol "UserMinus" di halaman Dashboard Guru (Show.tsx).
     */
    public function removeStudent($id)
    {
        // Cari data berdasarkan ID Enrollment
        $enrollment = Enrollment::findOrFail($id);
        
        // Keamanan: Load relasi untuk verifikasi pemilik kelas
        $enrollment->load('subjectAssignment');

        // Pastikan hanya guru yang mengajar di kelas tersebut yang bisa mengeluarkan siswa
        if ($enrollment->subjectAssignment->teacher_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki akses untuk mengeluarkan siswa dari kelas ini.');
        }

        // Hapus record pendaftaran (Kick)
        $enrollment->delete();

        return back()->with('success', 'Siswa berhasil dikeluarkan dari kelas.');
    }

    /**
     * Fitur untuk Siswa: Membatalkan permintaan pendaftaran yang masih pending.
     */
    public function cancel($subject_assignment_id)
    {
        $enrollment = Enrollment::where('user_id', auth()->id())
            ->where('subject_assignment_id', $subject_assignment_id)
            ->where('status', 'pending') 
            ->first();

        if (!$enrollment) {
            return back()->with('error', 'Data pendaftaran tidak ditemukan.');
        }

        $enrollment->delete();

        return back()->with('success', 'Pendaftaran berhasil dibatalkan.');
    }
}