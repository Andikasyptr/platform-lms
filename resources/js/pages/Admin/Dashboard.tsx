import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Users, Presentation, School, ArrowUpRight, Activity, Zap, ShieldCheck } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function Dashboard({ stats = { total_teachers: 0, total_students: 0, total_classrooms: 0 } }: any) {
    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-neutral-50/50 dark:bg-neutral-950/50">
            <Head title="Beranda utama" />

            {/* Header section dengan Welcome Message */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Statistik Akademik</h1>
                <p className="text-sm text-neutral-500">Ikhtisar data operasional platform LMS hari ini.</p>
            </div>
            
            <div className="grid auto-rows-min gap-6 md:grid-cols-3">
                {/* Statistik Guru */}
                <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-md">
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                <Presentation className="size-6" />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-500/10 px-2.5 py-1 rounded-full border border-green-100 dark:border-green-500/20">
                                <Activity className="size-3" />
                                <span>LIVE</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Total Guru</h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-black mt-1 text-neutral-900 dark:text-white">{stats.total_teachers}</p>
                                <span className="text-xs text-neutral-400 font-medium font-mono">Personel</span>
                            </div>
                        </div>
                    </div>
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/[0.03] dark:stroke-white/[0.03]" />
                </div>

                {/* Statistik Siswa */}
                <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-md">
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                <Users className="size-6" />
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Total Siswa</h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-black mt-1 text-neutral-900 dark:text-white">{stats.total_students}</p>
                                <span className="text-xs text-neutral-400 font-medium font-mono">Terdaftar</span>
                            </div>
                        </div>
                    </div>
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/[0.03] dark:stroke-white/[0.03]" />
                </div>

                {/* Statistik Kelas */}
                <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-md">
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                <School className="size-6" />
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Kelas Aktif</h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-black mt-1 text-neutral-900 dark:text-white">{stats.total_classrooms}</p>
                                <span className="text-xs text-neutral-400 font-medium font-mono">Ruangan</span>
                            </div>
                        </div>
                    </div>
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/[0.03] dark:stroke-white/[0.03]" />
                </div>
            </div>

            {/* Area Kontrol & Info Sistem */}
            <div className="relative min-h-[350px] flex-1 overflow-hidden rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 p-8 md:p-12 bg-white dark:bg-neutral-900 shadow-sm">
                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-12">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold mb-6 border border-violet-100 dark:border-violet-500/20">
                            <Zap className="size-3 fill-current" />
                            <span>Learning Management System V1.0</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
                            Panel Kendali <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Administrator.</span>
                        </h2>
                        <p className="mt-6 text-base md:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">
                            Kelola seluruh ekosistem pembelajaran digital Anda dari satu tempat. Pantau perkembangan siswa, atur penugasan guru, dan pastikan kurikulum berjalan tepat waktu.
                        </p>
                        
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 hover:border-violet-200 transition-colors">
                                <div className="p-2 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                                    <ShieldCheck className="size-5 text-violet-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Keamanan Data</h4>
                                    <p className="text-xs text-neutral-500 italic">Terproteksi SSL</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 hover:border-violet-200 transition-colors">
                                <div className="p-2 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                                    <Activity className="size-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Status Server</h4>
                                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-tighter">Normal & Stabil</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col justify-center items-center gap-2 opacity-20 hover:opacity-40 transition-opacity select-none pointer-events-none">
                         <School className="size-32 text-neutral-400" strokeWidth={1} />
                         <span className="font-black text-2xl tracking-[0.5em] text-neutral-400">LMS PLATFORM</span>
                    </div>
                </div>
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/[0.02] dark:stroke-white/[0.02]" />
            </div>
        </div>
    );
}

Dashboard.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Beranda utama', href: '/admin/dashboard' }]}>
        {page}
    </AppLayout>
);