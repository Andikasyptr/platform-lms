<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function teacherIndex()
    {
        $teachers = User::where('role', 'teacher')->latest()->get();

        // Mengarah ke: resources/js/pages/Admin/Users/Teachers/Index.tsx
        return Inertia::render('Admin/Users/Teachers/Index', [
            'teachers' => $teachers
        ]);
    }

    public function storeTeacher(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'teacher',
        ]);

        return redirect()->back()->with('success', 'Guru berhasil didaftarkan!');
    }

        public function updateTeacher(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8', // Password opsional saat edit
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->password) {
            $user->update(['password' => \Illuminate\Support\Facades\Hash::make($request->password)]);
        }

        return back()->with('success', 'Data guru berhasil diperbarui');
    }
    public function destroyTeacher(User $user)
    {
        $user->delete();
        return back()->with('success', 'Akun berhasil dihapus');
    }

    // siswa
    // Menampilkan Daftar Siswa
public function studentIndex()
{
    $students = User::where('role', 'student')->latest()->get();
    return Inertia::render('Admin/Users/Students/Index', [
        'students' => $students
    ]);
}

// Simpan Siswa Baru
public function storeStudent(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8',
    ]);

    User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'student', // <--- Penting!
    ]);

    return back()->with('success', 'Akun siswa berhasil dibuat');
}
}