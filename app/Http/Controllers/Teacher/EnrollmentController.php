<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\SubjectAssignment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Notifications\EnrollmentApprovedNotification;

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

        // 1. Load Enrollment beserta semua data yang dibutuhkan untuk email
        $enrollment = Enrollment::with([
            'user', 
            'subjectAssignment.subject', 
            'subjectAssignment.classroom', 
            'subjectAssignment.teacher'
        ])->findOrFail($request->enrollment_id);
        
        // Proteksi: pastikan guru yang approve adalah pemilik kelas/mapel tersebut
        if ($enrollment->subjectAssignment->teacher_id !== auth()->id()) {
            abort(403, 'Tindakan tidak diizinkan.');
        }

        if ($request->status === 'rejected') {
            $enrollment->delete();
            return back()->with('success', 'Pendaftaran siswa telah ditolak.');
        }

        // 2. Update status menjadi 'approved'
        $enrollment->update(['status' => 'approved']);

        // 3. LOGIC NOTIFIKASI: Kirim email ke siswa
        $student = $enrollment->user;
        if ($student && $student->email) {
            $student->notify(new EnrollmentApprovedNotification($enrollment));
        }

        return back()->with('success', 'Siswa berhasil bergabung ke kelas dan email konfirmasi telah dikirim!');
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