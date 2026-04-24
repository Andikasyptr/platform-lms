<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Enrollment; 
use App\Models\Material;
use App\Models\Assignment;
use Illuminate\Http\Request;
use App\Notifications\NewContentNotification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Notification;

class ClassroomController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $classrooms = Classroom::whereHas('subjectAssignments', function ($q) use ($user) {
            $q->where('teacher_id', $user->id);
        })
        ->with(['subjectAssignments' => function ($q) use ($user) {
            $q->where('teacher_id', $user->id)->with('subject');
        }])
        ->get()
        ->map(function ($classroom) use ($user) {
            $subjectAssignmentIds = $classroom->subjectAssignments->pluck('id');

            $classroom->total_students = Enrollment::whereIn('subject_assignment_id', $subjectAssignmentIds)
                ->where('status', 'approved')
                ->distinct('user_id')
                ->count();

            return $classroom;
        });

        return Inertia::render('Teacher/Classrooms/Index', [
            'classrooms' => $classrooms
        ]);
    }

    public function show($id)
    {
        $user = auth()->user();

        $classroom = Classroom::with(['subjectAssignments' => function ($q) use ($user) {
            $q->where('teacher_id', $user->id)->with('subject');
        }])->findOrFail($id);

        $assignmentId = $classroom->subjectAssignments->first()?->id;

        $materials = Material::where('subject_assignment_id', $assignmentId)->latest()->get();
        $materialIds = $materials->pluck('id');
        $totalMaterials = $materials->count();

        $assignments = Assignment::where('subject_assignment_id', $assignmentId)->latest()->get();
        $assignmentIds = $assignments->pluck('id');
        $totalAssignments = $assignments->count();

        $students = Enrollment::with('user')
            ->whereHas('subjectAssignment', function ($q) use ($user, $id) {
                $q->where('teacher_id', $user->id)->where('classroom_id', $id);
            })
            ->where('status', 'approved')
            ->get()
            ->map(function ($enrollment) use ($totalMaterials, $totalAssignments, $materialIds, $assignmentIds) {
                
                $completedMaterialsCount = DB::table('material_completions')
                    ->where('user_id', $enrollment->user_id)
                    ->whereIn('material_id', $materialIds)
                    ->count();

                $materiPercent = $totalMaterials > 0 
                    ? round(($completedMaterialsCount / $totalMaterials) * 100) 
                    : 0;

                $submittedAssignmentsCount = DB::table('submissions') 
                    ->where('user_id', $enrollment->user_id)
                    ->whereIn('assignment_id', $assignmentIds)
                    ->count();

                $tugasPercent = $totalAssignments > 0 
                    ? round(($submittedAssignmentsCount / $totalAssignments) * 100) 
                    : 0;

                return [
                    'id' => $enrollment->id,
                    'user' => [
                        'name' => $enrollment->user->name,
                    ],
                    'materi_progress_percent' => $materiPercent,
                    'tugas_progress_percent' => $tugasPercent,
                ];
            });

        return Inertia::render('Teacher/Classrooms/Show', [
            'classroom' => $classroom,
            'students' => $students,
            'materials' => $materials,
            'assignments' => $assignments,
        ]);
    }

   public function storeMaterial(Request $request)
    {
        $request->validate([
            'subject_assignment_id' => 'required|exists:subject_assignments,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:video,image,text,file,link',
            'content' => 'nullable|string',
            'file' => 'nullable|file|max:10240',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('materials', 'public');
        }

        // 1. Simpan Materi
        $material = Material::create([
            'subject_assignment_id' => $request->subject_assignment_id,
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'content' => $request->content,
            'file_path' => $filePath,
        ]);

        // 2. Ambil semua siswa yang "approved" di kelas ini (lewat Enrollment)
        $students = User::whereHas('enrollments', function ($query) use ($request) {
            $query->where('subject_assignment_id', $request->subject_assignment_id)
                  ->where('status', 'approved');
        })->get();

        // 3. Kirim Notifikasi Email
        if ($students->count() > 0) {
            Notification::send($students, new NewContentNotification($material, 'materi'));
        }

        return back()->with('success', 'Materi berhasil ditambahkan dan notifikasi terkirim!');
    }
    
    public function updateMaterial(Request $request, $id)
    {
        $material = Material::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:video,image,text,file,link',
            'content' => 'nullable|string',
            'file' => 'nullable|file|max:10240',
        ]);

        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'content' => $request->content,
        ];

        if ($request->hasFile('file')) {
            if ($material->file_path) {
                Storage::disk('public')->delete($material->file_path);
            }
            $data['file_path'] = $request->file('file')->store('materials', 'public');
        }

        $material->update($data);

        return back()->with('success', 'Materi berhasil diperbarui!');
    }

    public function destroyMaterial($id)
    {
        $material = Material::findOrFail($id);
        
        if ($material->file_path && Storage::disk('public')->exists($material->file_path)) {
            Storage::disk('public')->delete($material->file_path);
        }

        $material->delete();

        return back()->with('success', 'Materi berhasil dihapus!');
    }

    public function showMaterial($id)
    {
        $material = Material::findOrFail($id);
        
        return Inertia::render('Teacher/Materials/Show', [
            'material' => $material
        ]);
    }

    public function uploadImage(Request $request)
    {
        if ($request->hasFile('upload')) {
            $file = $request->file('upload');
            $fileName = time() . '_' . $file->getClientOriginalName();
            
            // Simpan ke folder public/media agar bisa diakses langsung lewat URL
            $file->move(public_path('media'), $fileName);

            $url = asset('media/' . $fileName);

            return response()->json([
                'uploaded' => true,
                'url' => $url
            ]);
        }

        return response()->json(['uploaded' => false, 'error' => ['message' => 'Upload gagal.']], 400);
    }

    public function createZoomMeeting(Request $request)
{
    // Logic mendapatkan Access Token dari Zoom
    // Lalu kirim POST request ke https://api.zoom.us/v2/users/me/meetings
    $response = Http::withToken($accessToken)->post('...', [
        'topic' => $request->title,
        'type' => 1, // Instant meeting
        'settings' => [
            'join_before_host' => true,
            'waiting_room' => false,
        ]
    ]);

    return $response->json(); // Ini akan berisi 'join_url'
}
}