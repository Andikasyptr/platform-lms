import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, GraduationCap, BookOpen, ChevronRight, 
    Clock, AlertCircle 
} from 'lucide-react';

interface Props {
    teacherStats: {
        my_classes: number;
        pending_students: number;
        total_materials: number;
    };
    myClassrooms: any[];
}

export default function Dashboard({ teacherStats, myClassrooms }: Props) {
    return (
        <div className="p-6 space-y-8 bg-neutral-50/50 dark:bg-neutral-950/50 min-h-screen">
            <Head title="Teacher Dashboard" />

            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                    Dashboard <span className="text-indigo-600">Guru</span>
                </h1>
                <p className="text-neutral-500 font-medium">Pantau aktivitas siswa dan manajemen kelas Anda.</p>
            </div>

            {/* Statistik Utama */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Kartu Siswa Menunggu (Warna Spesial jika > 0) */}
                <div className={`relative overflow-hidden rounded-[2rem] border p-8 transition-all ${
                    teacherStats.pending_students > 0 
                    ? 'bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/30 shadow-lg shadow-orange-100 dark:shadow-none' 
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                }`}>
                    <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-2">
                            <h3 className={`text-[10px] font-black uppercase tracking-widest ${teacherStats.pending_students > 0 ? 'text-orange-600' : 'text-neutral-400'}`}>
                                Siswa Menunggu
                            </h3>
                            <p className={`text-5xl font-black ${teacherStats.pending_students > 0 ? 'text-orange-600' : 'text-neutral-900 dark:text-white'}`}>
                                {teacherStats.pending_students}
                            </p>
                        </div>
                        <div className={`p-4 rounded-2xl ${teacherStats.pending_students > 0 ? 'bg-orange-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800'}`}>
                            {teacherStats.pending_students > 0 ? <AlertCircle className="size-6" /> : <Users className="size-6" />}
                        </div>
                    </div>
                    {teacherStats.pending_students > 0 && (
                        <button className="mt-6 text-[10px] font-black uppercase text-orange-600 flex items-center gap-2 hover:underline">
                            Verifikasi Sekarang <ChevronRight className="size-3" />
                        </button>
                    )}
                </div>

                {/* Kartu Kelas */}
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Kelas Aktif</h3>
                            <p className="text-5xl font-black text-neutral-900 dark:text-white">{teacherStats.my_classes}</p>
                        </div>
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-2xl">
                            <GraduationCap className="size-6" />
                        </div>
                    </div>
                </div>

                {/* Kartu Materi */}
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Materi Unggah</h3>
                            <p className="text-5xl font-black text-neutral-900 dark:text-white">{teacherStats.total_materials}</p>
                        </div>
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl">
                            <BookOpen className="size-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Manajemen Kelas Grid */}
            <div className="space-y-6">
                <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Kelas Anda</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {myClassrooms.map((kls) => (
                        <Link 
                            key={kls.id} 
                            href={`/teacher/classrooms/${kls.id}`}
                            className="p-8 bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 group hover:border-indigo-500 transition-all flex justify-between items-center hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-none"
                        >
                            <div className="space-y-1">
                                <h4 className="text-xl font-black text-neutral-900 dark:text-white uppercase group-hover:text-indigo-600 transition-colors">
                                    {kls.name}
                                </h4>
                                <div className="flex items-center gap-3">
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                                        KODE: <span className="text-neutral-600 dark:text-neutral-300">{kls.code}</span>
                                    </p>
                                    <div className="w-1 h-1 bg-neutral-300 rounded-full" />
                                    <p className="text-[10px] font-black text-indigo-600/60 uppercase tracking-widest">
                                        {kls.subject_assignments?.[0]?.subject?.name || 'Mata Pelajaran'}
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                <ChevronRight className="size-5" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Beranda utama', href: '/teacher/dashboard' }]}>
        {page}
    </AppLayout>
);