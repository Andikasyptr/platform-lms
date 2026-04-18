import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { School, Users, BookOpen, ArrowRight } from 'lucide-react';

export default function Index({ classrooms = [] }: any) {
    return (
        <div className="p-6 space-y-8 bg-neutral-50/50 dark:bg-neutral-950/50 min-h-screen">
            <Head title="Kelas Saya" />

            <div>
                <h1 className="text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                    Kelas <span className="text-emerald-600">Saya</span>
                </h1>
                <p className="text-neutral-500 font-medium text-sm">Daftar kelas dan mata pelajaran yang Anda ampu.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {classrooms.length > 0 ? (
                    classrooms.map((classroom: any) => (
                        <div key={classroom.id} className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl">
                                    <School className="size-6" />
                                </div>
                                <span className="text-[10px] font-black px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-lg uppercase tracking-widest">
                                    {classroom.code}
                                </span>
                            </div>

                            <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight mb-2">
                                {classroom.name}
                            </h2>

                            <div className="space-y-3 mb-8">
                                {classroom.subject_assignments.map((assignment: any) => (
                                    <div key={assignment.id} className="flex items-center gap-2 text-sm font-bold text-neutral-500">
                                        <BookOpen className="size-4 text-emerald-500" />
                                        {assignment.subject.name}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-neutral-100 dark:border-neutral-800">
                                <div className="flex items-center gap-2 text-xs font-bold text-neutral-400">
                                    <Users className="size-4" />
                                    {classroom.total_students || 0} Siswa
                                </div>
                                <Link 
                                    href={`/teacher/classrooms/${classroom.id}`}
                                    className="p-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white transition-colors"
                                >
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-[3rem]">
                        <p className="text-neutral-500 font-bold uppercase tracking-widest">Anda belum memiliki kelas.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

Index.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Daftar Kelas Saya', href: '/teacher/classrooms' }]}>
        {page}
    </AppLayout>
);