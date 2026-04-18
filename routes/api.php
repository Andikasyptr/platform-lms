<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Submission;

Route::post('/sync-google-form', function (Request $request) {
    // Cari user berdasarkan email dari Google
    $user = User::where('email', $request->email)->first();

    if ($user) {
        // Update atau buat data nilai
        Submission::updateOrCreate(
            [
                'user_id' => $user->id,
                'assignment_id' => $request->assignment_id
            ],
            [
                'score' => $request->score,
                'submitted_at' => now(),
                'teacher_feedback' => 'Dinilai otomatis oleh Google Form'
            ]
        );
        return response()->json(['status' => 'success', 'message' => 'Nilai berhasil sinkron']);
    }

    return response()->json(['status' => 'error', 'message' => 'Email siswa tidak terdaftar'], 404);
});