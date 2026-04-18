import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { UserCheck, UserX, Clock, School, BookOpen, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Index({ enrollments = [] }: any) {
    const [isProcessing, setIsProcessing] = useState<number | null>(null);

    const handleAction = (id: number, status: 'approved' | 'rejected') => {
        setIsProcessing(id);
        router.post('/teacher/enrollments/approve', {
            enrollment_id: id,
            status: status
        }, {
            onFinish: () => setIsProcessing(null)
        });
    };

    return (
        <div className="p-6 space-y-8 bg-neutral-50/50 dark:bg-neutral-950/50 min-h-screen">
            <Head title="Persetujuan Siswa" />

            <div>
                <h1 className="text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                    Persetujuan <span className="text-emerald-600">Siswa</span>
                </h1>
                <p className="text-neutral-500 font-medium text-sm">Kelola pendaftaran siswa yang ingin masuk ke kelas Anda.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {enrollments.length > 0 ? (
                    enrollments.map((item: any) => (
                        <div key={item.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="size-14 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-500">
                                    <BookOpen className="size-7" />
                                </div>
                                <div>
                                    <h3 className="font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                                        {item.user.name} 
                                    </h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                            <School className="size-3 text-emerald-500" />
                                            {item.subject_assignment.classroom.name}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                            <Clock className="size-3 text-emerald-500" />
                                            {item.subject_assignment.subject.name}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleAction(item.id, 'rejected')}
                                    disabled={isProcessing === item.id}
                                    className="px-6 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
                                >
                                    Tolak
                                </button>
                                <button
                                    onClick={() => handleAction(item.id, 'approved')}
                                    disabled={isProcessing === item.id}
                                    className="px-6 py-2.5 rounded-xl bg-neutral-900 dark:bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2"
                                >
                                    {isProcessing === item.id ? <Loader2 className="size-3 animate-spin" /> : <UserCheck className="size-3" />}
                                    Terima
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center flex flex-col items-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-[3rem]">
                        <Clock className="size-12 text-neutral-300 mb-4" />
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white uppercase">Belum Ada Permintaan</h3>
                        <p className="text-neutral-500 text-sm">Semua pendaftaran siswa sudah Anda proses.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

Index.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Persetujuan Registrasi', href: '/teacher/enrollments' }]}>
        {page}
    </AppLayout>
);