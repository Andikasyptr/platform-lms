import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { 
    BookOpen, 
    FileText, 
    Youtube,
    ArrowRight,
    ClipboardCheck,
    Clock,
    Trophy,
    Info,
    Lock,
    CheckCircle2,
    GraduationCap
} from 'lucide-react';
import React from 'react';

// --- DEFINISI INTERFACE ---
interface Material {
    id: number;
    title: string;
    type: 'video' | 'file' | 'text';
    is_completed: boolean;
    subject_assignment_id: number;
    content?: string;
    file_path?: string;
}

interface AssignmentItem {
    id: number;
    title: string;
    due_date: string;
    points: number;
    is_submitted: boolean;
}

interface Props {
    assignment: {
        id: number;
        subject?: { name: string };
        classroom?: { name: string };
        teacher?: { name: string };
        materials: Material[];
        assignments: AssignmentItem[];
    };
}

export default function Show({ assignment }: Props) {
    // 1. Mengurutkan materi dengan tipe data eksplisit (a, b)
    const materials = [...(assignment.materials || [])].sort((a: Material, b: Material) => a.id - b.id);
    const classAssignments = assignment.assignments || [];

    // 2. Logika Perhitungan Progress dengan tipe data eksplisit
    const totalMaterials = materials.length;
    const completedMaterials = materials.filter((m: Material) => m.is_completed).length;
    
    const totalTasks = classAssignments.length;
    const submittedTasks = classAssignments.filter((a: AssignmentItem) => a.is_submitted).length;

    const totalItems = totalMaterials + totalTasks;
    const completedItems = completedMaterials + submittedTasks;
    const totalProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return (
        <div className="p-6 lg:p-10 space-y-10 bg-[#f8fafc] dark:bg-[#050505] min-h-screen">
            <Head title={`Kelas ${assignment.subject?.name}`} />

            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-tighter">
                                {assignment.classroom?.name}
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white uppercase tracking-tight leading-none">
                            {assignment.subject?.name}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4 p-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <div className="size-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <BookOpen className="size-6" />
                        </div>
                        <div className="pr-4">
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Guru Pengampu</p>
                            <p className="text-sm font-bold text-neutral-900 dark:text-white">{assignment.teacher?.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN: CONTENT */}
                <div className="lg:col-span-8 space-y-12">
                    
                    {/* SECTION: MATERI DENGAN SISTEM GEMBOK */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="size-2 bg-emerald-600 rounded-full animate-pulse" />
                                Alur Materi Pembelajaran
                            </h2>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase">{materials.length} Tahap</span>
                        </div>

                        <div className="space-y-4 relative">
                            {materials.map((m: Material, index: number) => {
                                const isFirst = index === 0;
                                const isCompleted = m.is_completed;
                                const prevMaterial = materials[index - 1];
                                const isLocked = !isFirst && !prevMaterial?.is_completed;

                                return (
                                    <div key={m.id} className={`group relative flex items-center gap-5 p-5 rounded-[2.5rem] border transition-all duration-300 ${
                                        isLocked 
                                        ? 'bg-neutral-50/50 dark:bg-neutral-900/20 border-neutral-200 dark:border-neutral-800 opacity-60' 
                                        : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 hover:shadow-xl'
                                    }`}>
                                        
                                        <div className={`size-14 shrink-0 rounded-2xl flex items-center justify-center border-2 transition-all ${
                                            isLocked 
                                            ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-400' 
                                            : isCompleted
                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-600'
                                            : 'bg-white dark:bg-neutral-800 border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                                        }`}>
                                            {isLocked ? <Lock className="size-6" /> : isCompleted ? <CheckCircle2 className="size-6" /> : <span className="font-black text-lg italic">{index + 1}</span>}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {m.type === 'video' ? <Youtube className="size-3 text-red-500" /> : <FileText className="size-3 text-blue-500" />}
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">{m.type}</span>
                                            </div>
                                            <h4 className={`font-black uppercase text-sm leading-tight truncate tracking-tight ${isLocked ? 'text-neutral-400' : 'text-neutral-900 dark:text-white'}`}>
                                                {m.title}
                                            </h4>
                                        </div>

                                        {isLocked ? (
                                            <div className="px-5 py-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-[10px] font-black uppercase text-neutral-400 tracking-widest border border-neutral-200 dark:border-neutral-700">
                                                Terkunci
                                            </div>
                                        ) : (
                                            <Link 
                                                href={`/student/materials/${m.id}`} 
                                                className={`p-4 rounded-2xl transition-all shadow-sm ${
                                                    isCompleted 
                                                    ? 'bg-emerald-600 text-white shadow-emerald-200' 
                                                    : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-emerald-600 hover:text-white'
                                                }`}
                                            >
                                                <ArrowRight className="size-5" />
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* SECTION: TUGAS */}
                    <div className="space-y-6">
                        <h2 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="size-2 bg-blue-600 rounded-full" />
                            Tugas & Proyek
                        </h2>
                        
                        <div className="space-y-3">
                            {classAssignments.map((item: AssignmentItem) => (
                                <div key={item.id} className="group bg-white dark:bg-neutral-900 p-2 pl-6 rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between hover:border-blue-500 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className={`hidden md:flex size-12 rounded-2xl items-center justify-center font-black transition-colors ${
                                            item.is_submitted 
                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' 
                                            : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600'
                                        }`}>
                                            {item.is_submitted ? <CheckCircle2 className="size-5" /> : <ClipboardCheck className="size-5" />}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-neutral-900 dark:text-white uppercase text-sm tracking-tight">{item.title}</h4>
                                            <div className="flex items-center gap-4 mt-1">
                                                <div className="flex items-center gap-1.5 text-[9px] font-black text-neutral-400 uppercase">
                                                    <Clock className="size-3" />
                                                    {item.is_submitted ? 'Sudah Dikumpulkan' : `Deadline: ${new Date(item.due_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}`}
                                                </div>
                                                <div className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">
                                                    {item.points} Poin
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/student/assignments/${item.id}`} className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                                        item.is_submitted 
                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white' 
                                        : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-blue-600 hover:text-white'
                                    }`}>
                                        {item.is_submitted ? 'Lihat Jawaban' : 'Buka Tugas'}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: SIDEBAR PROGRESS */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden sticky top-10">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <GraduationCap className="size-24" />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-neutral-900 dark:text-white mb-6">Progress Belajar</h3>
                        
                        <div className="space-y-8">
                            {/* Circle/Total Progress */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                    <span>Total Penyelesaian</span>
                                    <span className="text-emerald-600">{totalProgress}%</span>
                                </div>
                                <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden p-1 border border-neutral-200 dark:border-neutral-700">
                                    <div 
                                        className="h-full bg-emerald-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(5,150,105,0.5)]" 
                                        style={{ width: `${totalProgress}%` }} 
                                    />
                                </div>
                            </div>
                            
                            {/* Detailed Stats */}
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 rounded-lg flex items-center justify-center">
                                            <FileText className="size-4" />
                                        </div>
                                        <span className="text-[10px] font-black text-neutral-400 uppercase">Materi</span>
                                    </div>
                                    <p className="font-black text-neutral-900 dark:text-white">{completedMaterials} <span className="text-neutral-400 text-[10px]">/ {totalMaterials}</span></p>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 bg-blue-100 dark:bg-blue-500/10 text-blue-600 rounded-lg flex items-center justify-center">
                                            <ClipboardCheck className="size-4" />
                                        </div>
                                        <span className="text-[10px] font-black text-neutral-400 uppercase">Tugas</span>
                                    </div>
                                    <p className="font-black text-neutral-900 dark:text-white">{submittedTasks} <span className="text-neutral-400 text-[10px]">/ {totalTasks}</span></p>
                                </div>
                            </div>

                            {totalProgress === 100 && (
                                <div className="p-4 bg-emerald-600 rounded-2xl text-white text-center animate-bounce shadow-lg shadow-emerald-200">
                                    <Trophy className="size-6 mx-auto mb-2" />
                                    <p className="text-[9px] font-black uppercase tracking-widest">Kelas Selesai!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-neutral-900 dark:bg-white rounded-[2.5rem] p-8 text-white dark:text-neutral-900 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <Info className="size-5 text-emerald-500" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Tips Belajar</h3>
                        </div>
                        <p className="text-[11px] font-medium leading-relaxed opacity-80 italic">
                            Sistem "Gembok Alur" memastikan Anda memahami materi dasar sebelum lanjut ke tingkat berikutnya. Jangan terburu-buru!
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

Show.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Kelas Saya', href: '/student/my-classrooms' }, { title: 'Materi & Tugas Pembelajaran', href: '#' }]}>
        {page}
    </AppLayout>
);