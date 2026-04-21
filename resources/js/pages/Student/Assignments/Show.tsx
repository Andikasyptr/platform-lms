import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Download, 
    FileText, 
    Clock, 
    Award, 
    ArrowLeft, 
    AlertCircle, 
    UploadCloud, 
    Loader2, 
    CheckCircle2, 
    ExternalLink 
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    assignment: any;
    submission: any; 
}

export default function Show({ assignment, submission }: Props) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        content: submission?.content || '',
        file: null as File | null,
    });

    const submitTask = (e: React.FormEvent) => {
    e.preventDefault();

    // Gunakan post dengan konfigurasi forceFormData agar file terbaca sebagai multipart/form-data
    post(`/student/assignments/${assignment.id}/submit`, {
        forceFormData: true, // WAJIB ada buat kirim file
        preserveScroll: true,
        onSuccess: () => {
            setShowForm(false);
            reset('file');
            // Opsional: lu bisa kasih toast sukses di sini
        },
        onError: (errors) => {
            console.error(errors); // Biar lu tau kalau ada error validasi dari Laravel
        }
    });
};
    const getFileType = (path: string) => {
        const ext = path.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return 'pdf';
        const officeExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
        if (officeExtensions.includes(ext || '')) return 'office';
        if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) return 'image';
        return 'other';
    };

    const fileUrl = `/storage/${assignment.attachment}`;

    return (
        <div className="p-6 md:p-10 space-y-10 bg-[#f8fafc] dark:bg-[#050505] min-h-screen">
            <Head title={`Tugas: ${assignment.title}`} />

            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                <Link 
                    href={`/student/classrooms/${assignment.subject_assignment_id}`} 
                    className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-blue-600 transition-all"
                >
                    <ArrowLeft className="size-3 group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Ruang Belajar
                </Link>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-200">
                                Assignment
                            </span>
                            <div className="flex items-center gap-2 text-red-500 text-[9px] font-black uppercase tracking-widest bg-red-50 dark:bg-red-500/10 px-4 py-1.5 rounded-full border border-red-100 dark:border-red-900/30">
                                <Clock className="size-3" /> Deadline: {new Date(assignment.due_date).toLocaleDateString('id-ID')}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white uppercase tracking-tight leading-none text-balance">
                            {assignment.title}
                        </h1>
                    </div>
                    
                    <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl flex items-center gap-4 shadow-sm">
                        <div className="size-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Award className="size-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">Poin Maksimal</p>
                            <p className="text-xl font-black text-neutral-900 dark:text-white leading-none">{assignment.points} Poin</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white dark:bg-neutral-900 rounded-[3rem] border border-neutral-200 dark:border-neutral-800 p-8 md:p-12 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-2 h-8 bg-blue-600 rounded-full" />
                            <h2 className="text-neutral-900 dark:text-white font-black uppercase tracking-widest text-xl m-0 leading-none">Instruksi Tugas</h2>
                        </div>
                        
                        <div 
                            className="prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed mb-10"
                            dangerouslySetInnerHTML={{ __html: assignment.description }} 
                        />

                        {assignment.attachment && (
                            <div className="space-y-4 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Lampiran Materi:</p>
                                
                                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm">
                                    {/* PREVIEW AREA */}
                                    <div className="aspect-[4/5] md:aspect-video w-full bg-white dark:bg-neutral-900 overflow-auto">
                                        {getFileType(assignment.attachment) === 'pdf' ? (
                                            <iframe 
                                                src={`${fileUrl}#toolbar=0`} 
                                                className="w-full h-full border-none"
                                            />
                                        ) : getFileType(assignment.attachment) === 'image' ? (
                                            <div className="w-full h-full flex items-center justify-center p-4">
                                                <img src={fileUrl} className="max-w-full max-h-full rounded-2xl shadow-sm" alt="Preview" />
                                            </div>
                                        ) : (
                                            /* Tampilan untuk Word, Excel, dan lainnya (Tanpa Preview) */
                                            <div className="w-full h-full flex flex-col items-center justify-center p-10 space-y-4">
                                                <div className="size-20 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-3xl flex items-center justify-center shadow-sm">
                                                    <FileText className="size-10" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-widest">
                                                        {getFileType(assignment.attachment) === 'office' ? 'Dokumen Office' : 'Lampiran Materi'}
                                                    </p>
                                                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mt-1">
                                                        Klik tombol di bawah untuk mengunduh file
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* BUTTONS AREA */}
                                    <div className="p-5 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-lg">
                                                <FileText className="size-4" />
                                            </div>
                                            <span className="text-[10px] font-black text-neutral-600 dark:text-neutral-300 uppercase truncate max-w-[200px]">
                                                {assignment.attachment.split('/').pop()}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            {/* Preview hanya tersedia untuk PDF dan Gambar */}
                                            {(getFileType(assignment.attachment) === 'pdf' || getFileType(assignment.attachment) === 'image') && (
                                                <a 
                                                    href={fileUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex-1 sm:flex-none px-6 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <ExternalLink className="size-3" /> Buka Fullscreen
                                                </a>
                                            )}
                                            <a 
                                                href={fileUrl} 
                                                download 
                                                className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                                            >
                                                <Download className="size-3" /> Download Materi
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                        <h3 className="text-lg font-black uppercase tracking-tight mb-6">Pengumpulan</h3>

                        {submission && submission.score !== null && !showForm ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="p-6 bg-blue-600 dark:bg-blue-500 rounded-3xl text-white shadow-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <Award className="size-5" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Graded</span>
                                    </div>
                                    <p className="text-[10px] font-black uppercase opacity-60 mb-1 text-white">Nilai Kamu</p>
                                    <div className="flex items-end gap-1">
                                        <span className="text-5xl font-black leading-none">{submission.score}</span>
                                        <span className="text-xl font-bold opacity-60">/ {assignment.points}</span>
                                    </div>
                                </div>
                                {submission.teacher_feedback && (
                                    <div className="p-5 bg-white/5 dark:bg-neutral-100 rounded-2xl border border-white/10 dark:border-neutral-200">
                                        <p className="text-[9px] font-black uppercase text-blue-400 dark:text-blue-600 mb-2 tracking-widest">Catatan Guru:</p>
                                        <p className="text-xs font-medium italic leading-relaxed opacity-80">"{submission.teacher_feedback}"</p>
                                    </div>
                                )}
                                <p className="text-[9px] font-bold text-center opacity-40 uppercase tracking-widest">Tugas telah dinilai & dikunci.</p>
                            </div>
                        ) : submission && submission.score === null && !showForm ? (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-400">
                                    <CheckCircle2 className="size-6" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-emerald-500">Status</p>
                                        <p className="text-sm font-bold uppercase">Telah Terkirim</p>
                                    </div>
                                </div>
                                {submission.file_path && (
                                    <div className="p-4 bg-white/5 dark:bg-neutral-50 rounded-2xl border border-white/10 dark:border-neutral-200 flex items-center justify-between text-white dark:text-neutral-900">
                                        <div className="flex items-center gap-3">
                                            <FileText className="size-4 text-blue-400" />
                                            <p className="text-[9px] font-black uppercase tracking-tight truncate max-w-[150px]">File Terkirim</p>
                                        </div>
                                        <a href={`/storage/${submission.file_path}`} target="_blank" className="p-2 bg-white/10 dark:bg-neutral-200 rounded-lg hover:text-blue-500 transition-colors">
                                            <ExternalLink className="size-3" />
                                        </a>
                                    </div>
                                )}
                                <button onClick={() => setShowForm(true)} className="w-full py-4 border border-white/10 dark:border-neutral-200 rounded-2xl text-[10px] font-black uppercase hover:bg-white/5 dark:hover:bg-neutral-50 transition-all">Ubah Jawaban</button>
                            </div>
                        ) : (
                            <form onSubmit={submitTask} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase opacity-40">Jawaban Teks / Link</label>
                                    <textarea 
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        className="w-full bg-white/5 dark:bg-neutral-50 border border-white/10 dark:border-neutral-200 rounded-2xl p-4 text-sm text-white dark:text-neutral-900 min-h-[120px] outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Ketik jawaban kamu di sini..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase opacity-40">Lampiran File</label>
                                    <div className="relative border-2 border-dashed border-white/10 dark:border-neutral-200 rounded-2xl p-6 text-center hover:border-blue-500 transition-all cursor-pointer group">
                                        <input type="file" onChange={e => setData('file', e.target.files ? e.target.files[0] : null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <UploadCloud className="size-8 mx-auto mb-2 opacity-40 group-hover:text-blue-500" />
                                        <p className="text-[9px] font-black uppercase opacity-40 truncate px-2">{data.file ? data.file.name : 'Upload File (PDF/ZIP)'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {showForm && <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 bg-white/5 dark:bg-neutral-100 border border-white/10 dark:border-neutral-200 rounded-2xl font-black uppercase text-[10px] text-white dark:text-neutral-900">Batal</button>}
                                    <button disabled={processing} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                                        {processing ? <Loader2 className="animate-spin size-4 mx-auto" /> : (submission ? 'Simpan Perubahan' : 'Kirim Sekarang')}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 border border-neutral-200 dark:border-neutral-800 flex items-start gap-4 shadow-sm">
                        <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl">
                            <AlertCircle className="size-5" />
                        </div>
                        <p className="text-[10px] font-bold text-neutral-500 leading-relaxed uppercase tracking-widest">
                            Tugas yang dikirim melewati batas waktu akan ditandai oleh sistem dan dapat mempengaruhi nilai.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

Show.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Tugas', href: '#' }]}>{page}</AppLayout>
);