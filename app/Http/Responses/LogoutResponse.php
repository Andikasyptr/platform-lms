<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LogoutResponse implements LogoutResponseContract
{
    public function toResponse($request): Response
    {
        // Jika request dari Inertia, kita paksa redirect ke home (/)
        // supaya browser otomatis pindah halaman tanpa perlu refresh.
        return $request->wantsJson() && !$request->header('X-Inertia')
            ? response()->json([], 204)
            : redirect('/');
    }
}