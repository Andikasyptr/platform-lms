import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { 
    BookOpen, 
    Clock, 
    CheckCircle2, 
    ArrowRight, 
    Calendar, 
    GraduationCap, 
    LayoutDashboard,
    User,
    School
} from 'lucide-react';

interface Props {
    stats: {
        enrolled_classes: number;
        pending_approvals: number;
        active_assignments: number;
    };
    activeEnrollments: any[];
    schedules: any[]; // Menambahkan prop schedules dari controller
}

export default function Dashboard({ stats, activeEnrollments = [], schedules = [] }: Props) {
    // Helper untuk memformat waktu dari 08:00:00 ke 08:00
    const formatTime = (time: string) => {
        return time ? time.substring(0, 5) : '--:--';
    };

    return (
        <div className="p-6 space-y-8 bg-neutral-50/50 dark:bg-neutral-950/50 min-h-screen font-sans">
            <Head title="Student Dashboard" />

            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-neutral-900 dark:text-neutral-50 uppercase tracking-tight">
                    Dashboard <span className="text-emerald-600 dark:text-emerald-500">Siswa</span>
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 font-medium">Selamat datang kembali! Pantau progres belajarmu di sini.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group relative overflow-hidden rounded-[2rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Kelas Diikuti</h3>
                            <p className="text-5xl font-black text-neutral-900 dark:text-emerald-500">
                                {stats.enrolled_classes}
                            </p>
                        </div>
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                            <GraduationCap className="size-6" />
                        </div>
                    </div>
                    <Link href="/student/classrooms" className="mt-6 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Lihat semua kelas <ArrowRight className="size-3" />
                    </Link>
                </div>

                <div className="group relative overflow-hidden rounded-[2rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Menunggu Approval</h3>
                            <p className="text-5xl font-black text-neutral-900 dark:text-amber-500">
                                {stats.pending_approvals}
                            </p>
                        </div>
                        <div className="p-4 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
                            <Clock className="size-6" />
                        </div>
                    </div>
                    <div className="mt-6 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        Segera hubungi guru pengampu.
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-[2rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Tugas Aktif</h3>
                            <p className="text-5xl font-black text-neutral-900 dark:text-blue-500">
                                {stats.active_assignments}
                            </p>
                        </div>
                        <div className="p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
                            <BookOpen className="size-6" />
                        </div>
                    </div>
                    <div className="mt-6 text-xs text-neutral-500 dark:text-neutral-400 font-medium italic">
                        Jangan sampai terlewat deadline!
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Aktivitas Belajar */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-neutral-900 dark:text-neutral-50 uppercase tracking-tight">Aktivitas Belajar</h2>
                        <Link href="/student/classrooms" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">Cari Kelas Baru</Link>
                    </div>

                    {activeEnrollments.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {activeEnrollments.map((enroll) => (
                                <div key={enroll.id} className="group flex items-center justify-between p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2rem] hover:border-emerald-500/50 transition-all shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center">
                                            <BookOpen className="size-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-neutral-900 dark:text-white uppercase text-sm leading-tight">
                                                {enroll.subject_assignment.subject.name}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase">
                                                    <User className="size-3 text-emerald-500" />
                                                    {enroll.subject_assignment.teacher.name}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase">
                                                    <School className="size-3 text-emerald-500" />
                                                    {enroll.subject_assignment.classroom.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link 
                                        href={`/student/classrooms/${enroll.subject_assignment_id}`}
                                        className="p-3 bg-neutral-50 dark:bg-neutral-800 text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 rounded-xl transition-colors"
                                    >
                                        <ArrowRight className="size-5" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 min-h-[300px] flex flex-col items-center justify-center text-center space-y-4">
                            <div className="size-20 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                                <LayoutDashboard className="size-10 text-neutral-300 dark:text-neutral-700" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Belum Ada Aktivitas</h3>
                            <Link href="/student/classrooms" className="px-6 py-3 bg-neutral-900 dark:bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-lg">
                                Eksplorasi Kelas
                            </Link>
                        </div>
                    )}
                </div>

                {/* Sidebar Info - JADWAL HARI INI */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-neutral-900 dark:text-neutral-50 uppercase tracking-tight">Informasi</h2>
                    
                    <div className="rounded-[2rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm overflow-hidden relative">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="size-5 text-emerald-600" />
                                <h3 className="font-bold text-sm uppercase tracking-tight dark:text-white">Jadwal Hari Ini</h3>
                            </div>
                            <span className="text-[10px] font-black px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg uppercase">
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long' })}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {schedules.length > 0 ? (
                                schedules.map((schedule) => (
                                    <div key={schedule.id} className="relative pl-4 border-l-2 border-emerald-500 py-1 transition-all hover:bg-neutral-50 dark:hover:bg-white/5 rounded-r-xl">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-[11px] font-black text-neutral-900 dark:text-white uppercase leading-tight">
                                                    {schedule.subject.name}
                                                </h4>
                                                <p className="text-[10px] font-bold text-neutral-500 uppercase mt-0.5">
                                                    {schedule.classroom.name}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600">
                                                    <Clock className="size-3" />
                                                    {formatTime(schedule.start_time)}
                                                </div>
                                                <div className="text-[9px] font-bold text-neutral-400 uppercase">
                                                    s/d {formatTime(schedule.end_time)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center flex flex-col items-center">
                                    <div className="size-12 bg-neutral-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mb-3">
                                        <CheckCircle2 className="size-6 text-neutral-300 dark:text-neutral-700" />
                                    </div>
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Tidak ada jadwal</p>
                                </div>
                            )}
                        </div>

                        {schedules.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                                <p className="text-[9px] font-bold text-neutral-400 uppercase text-center italic">
                                    Pastikan hadir tepat waktu di ruang kelas.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Tips Belajar */}
                    <div className="p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                        <h4 className="font-bold text-sm mb-4 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-emerald-500" />
                            Tips Belajar
                        </h4>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">Selesaikan tugas tepat waktu untuk nilai maksimal.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">Gunakan fitur diskusi untuk bertanya pada pengajar.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

Dashboard.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Beranda Utama', href: '/student/dashboard' }]}>
        {page}
    </AppLayout>
);