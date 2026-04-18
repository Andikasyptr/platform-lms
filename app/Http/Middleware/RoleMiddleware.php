<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
  public function handle(Request $request, Closure $next, string $role): Response
{
    $user = $request->user();

    // 1. Cek Login
    if (!$user) {
        return redirect()->route('login');
    }

    // 2. Cek Role (Gunakan trim untuk hapus spasi tak terlihat)
    if (trim(strtolower($user->role)) !== strtolower($role)) {
        // Jika request dari Inertia, kirim respon abort agar tidak stuck
        if ($request->expectsJson()) {
            abort(403, 'Akses Ditolak.');
        }
        
        return redirect('/')->with('error', 'Role tidak sesuai.');
    }

    return $next($request);
}
}