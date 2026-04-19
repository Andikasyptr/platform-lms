<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\URL;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): Response
    {
        $user = $request->user();
        
        // 1. Ambil role dan bersihkan (hapus spasi & kecilkan huruf)
        $role = trim(strtolower($user->role));

        // 2. Logika Jetstream Teams (Opsional, agar URL tetap punya context team)
        // Tetap dipertahankan sesuai kode awal kamu
        $team = $user->currentTeam ?? $user->personalTeam();
        if ($team) {
            URL::defaults(['current_team' => $team->slug]);
        }

        // 3. Tentukan rute berdasarkan ROLE
        $home = match ($role) {
            'admin'   => route('admin.dashboard'),
            'teacher' => route('teacher.dashboard'),
            'student' => route('student.dashboard'),
            default   => route('dashboard'), // Pastikan route default ini ada
        };

        // 4. Kirim respon - PERBAIKAN DI SINI
        // Jika request dari Inertia, kita PAKSA redirect agar UI berganti otomatis.
        // Jika request JSON murni (biasanya dari API/Mobile), baru kasih JsonResponse.
        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return new JsonResponse(['two_factor' => false], 200);
        }

        return redirect()->intended($home);
    }
}