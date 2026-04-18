import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { 
    Search, 
    School, 
    ArrowRight, 
    User, 
    Loader2, 
    CheckCircle2, 
    Clock, 
    XCircle, 
    X,
    Hash,
    BookOpen,
    ChevronRight,
    Filter
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';

// Types tetap sama
declare global { interface Window { route: any; } }
interface SubjectAssignment { id: number; subject: { name: string }; teacher: { name: string }; }
interface Classroom { id: number; name: string; code: string; subject_assignments: SubjectAssignment[]; }
interface Props { classrooms: Classroom[]; myEnrollments: Record<number, string>; filters: { search?: string }; }

export default function Index({ classrooms = [], myEnrollments = {}, filters }: Props) {
    const { flash }: any = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [isSubmitting, setIsSubmitting] = useState<number | null>(null);
    const [showNotify, setShowNotify] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (flash.success || flash.error) {
            setShowNotify(true);
            const timer = setTimeout(() => setShowNotify(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSearch = (value: string) => {
        setSearch(value);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            router.get('/student/classrooms', { search: value }, { preserveState: true, replace: true, preserveScroll: true });
        }, 500);
    };

    const handleJoin = (assignmentId: number) => {
        if (isSubmitting) return;
        router.post('/student/enroll', { subject_assignment_id: assignmentId }, {
            preserveScroll: true,
            onStart: () => setIsSubmitting(assignmentId),
            onFinish: () => setIsSubmitting(null),
        });
    };

    const handleCancel = (assignmentId: number) => {
        if (isSubmitting) return;
        Swal.fire({
            title: 'Batalkan Pendaftaran?',
            text: "Anda dapat mendaftar kembali ke kelas ini kapan saja.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Batalkan',
            background: document.documentElement.classList.contains('dark') ? '#171717' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
            customClass: { popup: 'rounded-3xl border border-neutral-800' }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/student/enroll/cancel/${assignmentId}`, {
                    preserveScroll: true,
                    onStart: () => setIsSubmitting(assignmentId),
                    onFinish: () => setIsSubmitting(null),
                });
            }
        });
    };

    return (
        <div className="p-8 space-y-8 bg-neutral-50/50 dark:bg-[#050505] min-h-screen font-sans">
            <Head title="Eksplorasi Kelas" />

            {/* Notification System */}
            {showNotify && (flash.success || flash.error) && (
                <div className="fixed top-6 right-6 z-[60] animate-in slide-in-from-right-8 fade-in duration-500">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[320px]">
                        <div className={`p-2.5 rounded-xl ${flash.success ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                            {flash.success ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-0.5">System Message</p>
                            <p className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">{flash.success || flash.error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Area */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                        <BookOpen size={12} /> Kurikulum Aktif 2026
                    </div>
                    {/* <h1 className="text-4xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter italic">
                        Daftar <span className="text-emerald-500">Kelas</span>
                    </h1> */}
                    <p className="text-neutral-500 dark:text-neutral-400 font-medium max-w-md">Eksplorasi dan manajemen pendaftaran mata pelajaran di seluruh departemen.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                    <div className="relative group flex-1 sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari kode atau nama kelas..."
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <button className="px-6 py-3.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all">
                        <Filter size={14} /> Filter
                    </button>
                </div>
            </div>

            {/* List Layout */}
            <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Identitas Kelas</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Mata Pelajaran & Pengampu</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 text-center">Status Pendaftaran</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {classrooms.length > 0 ? (
                                classrooms.map((classroom) => (
                                    <tr key={classroom.id} className="group hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6 align-top">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-neutral-500 group-hover:text-emerald-500 transition-colors">
                                                    <School size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-neutral-900 dark:text-white uppercase tracking-tight leading-tight">{classroom.name}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-neutral-400 uppercase">
                                                        <Hash size={10} /> {classroom.code}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-8 py-6">
                                            <div className="space-y-3">
                                                {classroom.subject_assignments?.map((assignment) => (
                                                    <div key={assignment.id} className="flex flex-col">
                                                        <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">{assignment.subject?.name}</span>
                                                        <span className="text-[10px] font-medium text-neutral-500 flex items-center gap-1 mt-0.5 uppercase tracking-wider italic">
                                                            <User size={10} className="text-emerald-500" /> {assignment.teacher?.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>

                                        <td className="px-8 py-6 align-top">
                                            <div className="flex flex-col items-center gap-3">
                                                {classroom.subject_assignments?.map((assignment) => {
                                                    const status = myEnrollments[assignment.id];
                                                    return (
                                                        <div key={assignment.id} className="h-10 flex items-center">
                                                            {!status ? (
                                                                <span className="text-[9px] font-black text-neutral-300 dark:text-neutral-600 uppercase tracking-widest">— Belum Terdaftar —</span>
                                                            ) : status === 'approved' ? (
                                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20 text-[9px] font-black uppercase tracking-tighter">
                                                                    <CheckCircle2 size={10} /> Active
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 text-[9px] font-black uppercase tracking-tighter">
                                                                    <Clock size={10} className="animate-pulse" /> Pending
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>

                                        <td className="px-8 py-6 align-top text-right">
                                            <div className="flex flex-col items-end gap-3">
                                                {classroom.subject_assignments?.map((assignment) => {
                                                    const status = myEnrollments[assignment.id];
                                                    const isLoading = isSubmitting === assignment.id;

                                                    return (
                                                        <div key={assignment.id} className="h-10 flex items-center justify-end">
                                                            {status === 'approved' ? (
                                                                <Link
                                                                    href={`/student/classrooms/${assignment.id}`}
                                                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-all group/btn"
                                                                >
                                                                    Lanjut <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                                                </Link>
                                                            ) : status === 'pending' ? (
                                                                <button
                                                                    onClick={() => handleCancel(assignment.id)}
                                                                    disabled={isLoading}
                                                                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                                >
                                                                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleJoin(assignment.id)}
                                                                    disabled={isLoading}
                                                                    className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                                                                >
                                                                    {isLoading ? <Loader2 size={12} className="animate-spin" /> : 'Daftar'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-32 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="size-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                                                <Search className="size-8 text-neutral-400" />
                                            </div>
                                            <p className="text-sm font-black text-neutral-400 uppercase tracking-widest">Data tidak ditemukan</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

Index.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Eksplorasi Kelas', href: '/student/classrooms' }]}>
        {page}
    </AppLayout>
);