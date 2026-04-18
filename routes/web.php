<?php

use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite; // WAJIB untuk Google Login
use App\Models\User;                    // WAJIB untuk akses tabel User
use Illuminate\Support\Facades\Auth;    // WAJIB untuk proses login

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Teacher\DashboardController as TeacherDashboard;
use App\Http\Controllers\Teacher\ClassroomController as TeacherClassroom;
use App\Http\Controllers\Teacher\EnrollmentController as TeacherEnrollment;
use App\Http\Controllers\Teacher\AssignmentController;

use App\Http\Controllers\Teacher\EnrollmentController;
use App\Http\Controllers\Student\DashboardController as StudentDashboard;
use App\Http\Controllers\Student\ClassroomController as StudentClassroom;


// 1. HALAMAN UTAMA (WELCOME)
Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('/auth/google/redirect', function () {
    return Socialite::driver('google')->redirect();
})->name('google.redirect');

Route::get('/auth/google/callback', function () {
    try {
        $googleUser = Socialite::driver('google')->user();
    } catch (\Exception $e) {
        return redirect('/login')->with('error', 'Gagal masuk dengan Google.');
    }

    // Cari user berdasarkan email
    $user = User::where('email', $googleUser->email)->first();

    if (!$user) {
        // Jika user baru, buat akun baru
        $user = User::create([
            'name' => $googleUser->name,
            'email' => $googleUser->email,
            'google_id' => $googleUser->id,
            'password' => bcrypt(str()->random(24)),
            'role' => 'student', // SET DEFAULT ROLE sebagai student (siswa)
        ]);
    } else {
        // Jika user lama tapi baru pertama kali pakai google login, update ID-nya
        if (!$user->google_id) {
            $user->update(['google_id' => $googleUser->id]);
        }
    }

    Auth::login($user);

    // redirect() intended akan mengirim user ke logic redirect dashboard di bawah
    return redirect()->intended('/dashboard');
});

// 2. ROUTE GRUP DENGAN AUTH
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
    $user = auth()->user();
    $role = trim(strtolower($user->role));

    if ($role === 'admin') {
        return redirect('/admin/dashboard');
    } elseif ($role === 'teacher') {
        return redirect('/teacher/dashboard');
    } elseif ($role === 'student') {
        return redirect('/student/dashboard'); // Arahkan siswa ke dashboardnya
    }
    
    return redirect('/'); // Default jika role tidak dikenali
})->name('dashboard');

    // DASHBOARD ADMIN UTAMA
    Route::prefix('admin')
        ->middleware(['role:admin'])
        ->group(function () {
            Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard');
            // Route tambahan admin (Kelola Guru, dll) nanti di bawah sini
           Route::get('/users/teachers', [UserController::class, 'teacherIndex'])->name('admin.teachers.index');
           Route::post('/users/teachers', [UserController::class, 'storeTeacher'])->name('admin.teachers.store');
           Route::put('/users/teachers/{user}', [UserController::class, 'updateTeacher'])->name('admin.teachers.update');
           Route::delete('/users/teachers/{user}', [UserController::class, 'destroyTeacher'])->name('admin.teachers.destroy');
        // kelola kelas
            Route::get('/classrooms', [\App\Http\Controllers\Admin\ClassroomController::class, 'index'])->name('admin.classrooms.index');
            Route::post('/classrooms', [\App\Http\Controllers\Admin\ClassroomController::class, 'store'])->name('admin.classrooms.store');
            Route::put('/classrooms/{classroom}', [\App\Http\Controllers\Admin\ClassroomController::class, 'update'])->name('admin.classrooms.update');
            Route::delete('/classrooms/{classroom}', [\App\Http\Controllers\Admin\ClassroomController::class, 'destroy'])->name('admin.classrooms.destroy');
        //    route tambahan admin lainnya (misal: Kelola Siswa, Kelola Kelas, dll) bisa ditambahkan di sini    
            Route::get('/users/students', [UserController::class, 'studentIndex'])->name('admin.students.index');
            Route::post('/users/students', [UserController::class, 'storeStudent'])->name('admin.students.store');
            Route::put('/users/students/{user}', [UserController::class, 'updateStudent'])->name('admin.students.update');
            Route::delete('/users/students/{user}', [UserController::class, 'destroyStudent'])->name('admin.students.destroy');

        // manajemen kelas 
            Route::get('/classrooms', [\App\Http\Controllers\Admin\ClassroomController::class, 'index'])->name('admin.classrooms.index');
            Route::post('/classrooms', [\App\Http\Controllers\Admin\ClassroomController::class, 'store'])->name('admin.classrooms.store');
            Route::put('/classrooms/{classroom}', [\App\Http\Controllers\Admin\ClassroomController::class, 'update'])->name('admin.classrooms.update');
            Route::delete('/classrooms/{classroom}', [\App\Http\Controllers\Admin\ClassroomController::class, 'destroy'])->name('admin.classrooms.destroy');    
        // manajemen mata pelajaran
            Route::get('/subjects', [\App\Http\Controllers\Admin\SubjectController::class, 'index'])->name('admin.subjects.index');
            Route::post('/subjects', [\App\Http\Controllers\Admin\SubjectController::class, 'store'])->name('admin.subjects.store');
            Route::put('/subjects/{subject}', [\App\Http\Controllers\Admin\SubjectController::class, 'update'])->name('admin.subjects.update');
            Route::delete('/subjects/{subject}', [\App\Http\Controllers\Admin\SubjectController::class, 'destroy'])->name('admin.subjects.destroy');
        
        // manajemen penjadwalan (subject assignment)
            Route::get('/assignments', [\App\Http\Controllers\Admin\SubjectAssignmentController::class, 'index'])->name('admin.assignments.index');
            Route::post('/assignments', [\App\Http\Controllers\Admin\SubjectAssignmentController::class, 'store'])->name('admin.assignments.store');
            Route::put('/assignments/{subjectAssignment}', [\App\Http\Controllers\Admin\SubjectAssignmentController::class, 'update'])->name('admin.assignments.update');
            Route::delete('/assignments/{subjectAssignment}', [\App\Http\Controllers\Admin\SubjectAssignmentController::class, 'destroy'])->name('admin.assignments.destroy');  
        });

    // DASHBOARD GURU
  
    // --- GROUP TEACHER ---
    Route::prefix('teacher')->name('teacher.')->middleware(['role:teacher'])->group(function () {
        Route::get('/dashboard', [TeacherDashboard::class, 'index'])->name('dashboard');
        
        // Classrooms
        Route::get('/classrooms', [TeacherClassroom::class, 'index'])->name('classrooms');
        Route::get('/classrooms/{id}', [TeacherClassroom::class, 'show'])->name('classrooms.show');

        // Materials (DI SINI MASALAHNYA TADI)
        Route::post('/materials', [TeacherClassroom::class, 'storeMaterial'])->name('materials.store');
        Route::get('/materials/{id}', [TeacherClassroom::class, 'showMaterial'])->name('materials.show');
        Route::delete('/materials/{id}', [TeacherClassroom::class, 'destroyMaterial'])->name('materials.destroy');
        // Pastikan baris ini ada di dalam group teacher
        Route::put('/materials/{id}', [TeacherClassroom::class, 'updateMaterial'])->name('materials.update');

        // Assignments (Tugas)
        Route::post('/assignments', [AssignmentController::class, 'store'])->name('assignments.store');
        Route::get('/assignments/{id}', [AssignmentController::class, 'show'])->name('assignments.show');
        Route::put('/assignments/{id}', [AssignmentController::class, 'update'])->name('assignments.update');
        Route::delete('/assignments/{id}', [AssignmentController::class, 'destroy'])->name('assignments.destroy');
        Route::post('/submissions/{submission}/grade', [AssignmentController::class, 'grade'])->name('submissions.grade');

    
    Route::post('/materials/upload-image', [TeacherClassroom::class, 'uploadImage'])->name('materials.upload-image');
    Route::post('/assignments/upload-image', [AssignmentController::class, 'uploadImage'])->name('assignments.upload-image');

        // Enrollments & Kick Student
        Route::get('/enrollments', [TeacherEnrollment::class, 'index'])->name('enrollments');
        Route::post('/enrollments/approve', [TeacherEnrollment::class, 'updateStatus'])->name('enrollments.approve');
        Route::delete('/enrollments/{id}', [TeacherEnrollment::class, 'removeStudent'])->name('enrollments.destroy');
    });

    // --- GROUP STUDENT ---
    Route::prefix('student')->name('student.')->middleware(['role:student'])->group(function () {
        Route::get('/dashboard', [StudentDashboard::class, 'index'])->name('dashboard');
        
        Route::get('/classrooms', [StudentClassroom::class, 'index'])->name('classrooms.index');
        Route::get('/my-classrooms', [StudentClassroom::class, 'myClass'])->name('classrooms.my');
        Route::get('/classrooms/{id}', [StudentClassroom::class, 'show'])->name('classrooms.show');
        
        Route::post('/enroll', [StudentClassroom::class, 'enroll'])->name('enroll');
        Route::delete('/enroll/cancel/{id}', [StudentClassroom::class, 'cancelEnroll'])->name('enroll.cancel');

        Route::get('/materials/{material}', [\App\Http\Controllers\Student\MaterialController::class, 'show'])->name('materials.show');
        Route::get('/assignments/{assignment}', [\App\Http\Controllers\Student\AssignmentController::class, 'show'])->name('assignments.show');
        Route::post('/assignments/{assignment}/submit', [\App\Http\Controllers\Student\SubmissionController::class, 'store'])->name('submissions.store');
        Route::post('/materials/{id}/complete', [StudentClassroom::class, 'markAsComplete'])->name('materials.complete');
        });

        // 3. ROUTE JETSTREAM TEAMS (BAWAAN)
    // Tetap dipertahankan jika Anda ingin menggunakan fitur Team nantinya
    Route::prefix('{current_team}')
        ->middleware([EnsureTeamMembership::class])
        ->group(function () {
            // Kita biarkan route dashboard asli ini, namun biasanya tidak terakses 
            // karena sudah ter-redirect oleh route '/dashboard' di atas
            Route::inertia('dashboard', 'dashboard')->name('team.dashboard');
           
        });

    // ROUTE INVITATION TEAM
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

// 4. SETTINGS & PROFILE (BAWAAN)
require __DIR__.'/settings.php';