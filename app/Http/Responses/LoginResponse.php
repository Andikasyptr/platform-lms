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
        $team = $user->currentTeam ?? $user->personalTeam();
        if ($team) {
            URL::defaults(['current_team' => $team->slug]);
        }

        // 3. Tentukan rute berdasarkan ROLE, bukan ke '/dashboard' umum
        $home = match ($role) {
            'admin'   => route('admin.dashboard'),
            'teacher' => route('teacher.dashboard'),
            'student' => route('student.dashboard'),
            default   => '/', 
        };

        // 4. Kirim respon
        return $request->wantsJson()
            ? new JsonResponse(['two_factor' => false], 200)
            : redirect()->intended($home);
    }
}