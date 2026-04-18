import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { School, User, BookOpen, ArrowRight, Clock, LayoutGrid } from 'lucide-react';

interface Props {
    myClasses: any[];
}

export default function MyClass({ myClasses = [] }: Props) {
    return (
        <div className="p-6 lg:p-10 space-y-8 bg-[#f8fafc] dark:bg-[#050505] min-h-screen">
            <Head title="Kelas Saya" />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-neutral-900 dark:text-white uppercase tracking-tight leading-none">
                        Kelas <span className="text-emerald-600">Saya</span>
                    </h1>
                    <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest leading-none">
                        Ruang belajar aktif yang kamu ikuti.
                    </p>
                </div>
                
                <Link 
                    href="/student/classrooms" 
                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 transition-all shadow-sm"
                >
                    <LayoutGrid className="size-4 text-emerald-600" />
                    Eksplorasi Kelas
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {myClasses.length > 0 ? (
                    myClasses.map((enrollment: any) => {
                        const assignment = enrollment.subject_assignment;
                        return (
                            <div key={enrollment.id} className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-500 overflow-hidden">
                                
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-100 dark:shadow-none transition-transform group-hover:scale-110">
                                        <School className="size-6" />
                                    </div>
                                    <span className="text-[10px] font-black px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg uppercase tracking-widest">
                                        {assignment.classroom?.name}
                                    </span>
                                </div>

                                <div className="space-y-1 mb-8">
                                    <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter group-hover:text-emerald-600 transition-colors">
                                        {assignment.subject?.name}
                                    </h2>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                        <User className="size-3 text-emerald-500" />
                                        {assignment.teacher?.name}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-neutral-100 dark:border-neutral-800">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                                        <Clock className="size-4 text-emerald-600" />
                                        Terdaftar
                                    </div>
                                    <Link 
                                        href={`/student/classrooms/${assignment.id}`}
                                        className="flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
                                    >
                                        Buka Kelas
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-24 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-[3rem] bg-white dark:bg-neutral-900/50 flex flex-col items-center">
                        <div className="size-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4 text-neutral-300">
                            <BookOpen className="size-8" />
                        </div>
                        <p className="text-neutral-500 font-black uppercase tracking-widest text-xs">Belum ada kelas yang disetujui.</p>
                        <Link href="/student/classrooms" className="mt-4 text-emerald-600 font-black text-[10px] uppercase underline decoration-2 underline-offset-4">Daftar Kelas Sekarang</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

MyClass.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Ruang Belajar Saya', href: '/student/my-classrooms' }]}>
        {page}
    </AppLayout>
);