import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ChevronLeft, Calendar, ClipboardCheck, Download, 
    FileText, User, Clock, Award, CheckCircle2, 
    AlertCircle, Eye, X, Loader2, ExternalLink 
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    assignment: any;
    submissions: any[];
}

export default function Show({ assignment, submissions }: Props) {
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

    const { data, setData, post, processing, reset } = useForm({
        score: '',
        teacher_feedback: '',
    });

    const openGradeModal = (sub: any) => {
        setSelectedSubmission(sub);
        setData({
            score: sub.score || '',
            teacher_feedback: sub.teacher_feedback || '',
        });
    };

    const submitGrade = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubmission) return;

        post(`/teacher/submissions/${selectedSubmission.id}/grade`, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedSubmission(null);
                reset();
            },
        });
    };

    // Fungsi pembantu untuk cek tipe file
    const getFileType = (path: string) => {
        const ext = path.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return 'image';
        if (ext === 'pdf') return 'pdf';
        return 'other';
    };

    return (
        <div className="p-6 lg:p-10 space-y-10 bg-[#f8fafc] dark:bg-[#050505] min-h-screen">
            <Head title={`Monitor: ${assignment.title}`} />

            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Link href={`/teacher/classrooms/${assignment.subject_assignment_id}`} className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:text-blue-600">
                            <ChevronLeft className="size-3" /> Kembali ke Kelas
                        </Link>
                        <h1 className="text-4xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Monitoring <span className="text-blue-600">Tugas</span></h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                            <div className="p-8 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                                <h3 className="font-black uppercase tracking-widest text-sm">Daftar Pengumpulan</h3>
                                <span className="px-4 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-full text-[10px] font-black uppercase">
                                    {submissions.length} Terkumpul
                                </span>
                            </div>

                            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {submissions.length > 0 ? submissions.map((sub: any) => (
                                    <div key={sub.id} className="p-6 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-400">
                                                <User className="size-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-neutral-900 dark:text-white uppercase text-xs">{sub.user.name}</h4>
                                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">
                                                    Dikirim: {new Date(sub.submitted_at).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            {sub.score ? (
                                                <div className="text-right hidden md:block">
                                                    <p className="text-[9px] font-black text-neutral-400 uppercase">Nilai</p>
                                                    <p className="text-sm font-black text-emerald-600">{sub.score}/{assignment.points}</p>
                                                </div>
                                            ) : (
                                                <span className="text-[9px] font-black text-orange-500 uppercase bg-orange-50 dark:bg-orange-500/10 px-3 py-1 rounded-lg">Belum Dinilai</span>
                                            )}
                                            <button 
                                                onClick={() => openGradeModal(sub)}
                                                className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                                            >
                                                Lihat Jawaban
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-20 text-center space-y-4">
                                        <AlertCircle className="size-12 mx-auto text-neutral-200" />
                                        <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Belum ada siswa yang mengumpulkan.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                         <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 p-8 space-y-6 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">Ringkasan</h3>
                            <div className="space-y-4">
                                <div className="p-6 bg-neutral-50 dark:bg-neutral-800 rounded-[2rem]">
                                    <p className="text-[10px] font-black text-neutral-400 uppercase mb-1">Status Deadline</p>
                                    <p className="text-sm font-bold text-red-500">{new Date(assignment.due_date).toLocaleDateString('id-ID')}</p>
                                </div>
                                <div className="p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-200 dark:shadow-none">
                                    <p className="text-[10px] font-black uppercase opacity-60 mb-1">Poin Maksimal</p>
                                    <p className="text-3xl font-black">{assignment.points}</p>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setSelectedSubmission(null)} />
                    <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-950 rounded-[3rem] shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
                            <div className="flex items-center gap-4">
                                <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"><User className="size-5" /></div>
                                <div>
                                    <h3 className="font-black uppercase tracking-tight text-neutral-900 dark:text-white">{selectedSubmission.user.name}</h3>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase">Detail Jawaban & Penilaian</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors"><X className="size-5" /></button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* KIRI: PREVIEW FILE */}
                            <div className="p-8 bg-neutral-50 dark:bg-neutral-900/30 border-r border-neutral-100 dark:border-neutral-800 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-4">Lampiran Berkas:</label>
                                        
                                        {selectedSubmission.file_path ? (
                                            <div className="space-y-4">
                                                {/* Preview Area */}
                                                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-950 aspect-[3/4] lg:aspect-auto lg:h-[400px]">
                                                    {getFileType(selectedSubmission.file_path) === 'pdf' ? (
                                                        <iframe 
                                                            src={`/storage/${selectedSubmission.file_path}#toolbar=0`} 
                                                            className="w-full h-full"
                                                        />
                                                    ) : getFileType(selectedSubmission.file_path) === 'image' ? (
                                                        <img 
                                                            src={`/storage/${selectedSubmission.file_path}`} 
                                                            className="w-full h-full object-contain" 
                                                            alt="Submission" 
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center space-y-4">
                                                            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-400">
                                                                <FileText className="size-10" />
                                                            </div>
                                                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Format file ini tidak mendukung preview langsung.</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-3">
                                                    <a 
                                                        href={`/storage/${selectedSubmission.file_path}`} 
                                                        target="_blank" 
                                                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all shadow-sm"
                                                    >
                                                        <ExternalLink className="size-3" /> Buka Tab Baru
                                                    </a>
                                                    <a 
                                                        href={`/storage/${selectedSubmission.file_path}`} 
                                                        download 
                                                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                                                    >
                                                        <Download className="size-3" /> Download File
                                                    </a>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-10 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-[2rem] text-center">
                                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Tidak ada lampiran file.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Jawaban Teks:</label>
                                        <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-xs leading-relaxed italic text-neutral-600 dark:text-neutral-400">
                                            {selectedSubmission.content || "Siswa tidak menyertakan jawaban teks."}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* KANAN: FORM PENILAIAN */}
                            <form onSubmit={submitGrade} className="p-8 space-y-8 flex flex-col justify-between">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Beri Nilai (Maks: {assignment.points})</label>
                                        <div className="relative">
                                            <input 
                                                type="number" max={assignment.points} required
                                                value={data.score} onChange={e => setData('score', e.target.value)}
                                                className="w-full p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[1.5rem] text-4xl font-black focus:ring-4 focus:ring-blue-500/10 outline-none transition-all pr-20"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-black text-neutral-400">/ {assignment.points}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Komentar / Feedback untuk Siswa</label>
                                        <textarea 
                                            value={data.teacher_feedback} onChange={e => setData('teacher_feedback', e.target.value)}
                                            className="w-full p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[1.5rem] text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all min-h-[150px]"
                                            placeholder="Tuliskan catatan kemajuan siswa di sini..."
                                        />
                                    </div>
                                </div>

                                <button 
                                    disabled={processing}
                                    className="w-full py-6 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {processing ? <Loader2 className="animate-spin size-4" /> : "Simpan & Publikasi Nilai"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

Show.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Kelas Saya', href: '/teacher/classrooms' }, { title: 'Daftar Pengumpulan', href: '#' }]}>
        {page}
    </AppLayout>
);