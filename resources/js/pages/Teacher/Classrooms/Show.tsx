import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    Users, FileText, ChevronRight, Plus, X, Youtube, 
    Link as LinkIcon, FileUp, Type, ArrowRight, Trash2, 
    ClipboardCheck, Calendar, UserMinus, Info, Layout, Globe, Edit3, Video
} from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

// IMPORT CKEDITOR
import { CKEditor } from '@ckeditor/ckeditor5-react';
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// --- CUSTOM UPLOAD ADAPTER UNTUK CKEDITOR ---
class MyUploadAdapter {
    loader: any;
    token: string;
    url: string;

    constructor(loader: any, token: string, url: string) {
        this.loader = loader;
        this.token = token;
        this.url = url;
    }

    upload() {
        return this.loader.file.then((file: any) => new Promise((resolve, reject) => {
            const data = new FormData();
            data.append('upload', file);

            fetch(this.url, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': this.token,
                    'Accept': 'application/json'
                },
                body: data,
            })
            .then(response => {
                if (!response.ok) throw new Error('Gagal mengunggah file ke server.');
                return response.json();
            })
            .then(response => {
                if (response.uploaded) {
                    resolve({ default: response.url });
                } else {
                    reject(response.error ? response.error.message : 'Upload gagal');
                }
            })
            .catch(error => reject(error.message));
        }));
    }

    abort() {}
}

interface Props {
    classroom: any;
    students: any[];
    materials: any[];
    assignments: any[];
}

export default function Show({ classroom, students, materials, assignments }: Props) {
    const [showMaterialForm, setShowMaterialForm] = useState(false);
    const [showAssignmentForm, setShowAssignmentForm] = useState(false);
    const [editingMaterialId, setEditingMaterialId] = useState<number | null>(null);
    const [editingAssignmentId, setEditingAssignmentId] = useState<number | null>(null);

    const subjectAssignmentId = classroom?.subject_assignments?.[0]?.id || null;

    const getCsrfToken = () => (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

    const materialForm = useForm({
        _method: 'POST', 
        subject_assignment_id: subjectAssignmentId,
        title: '',
        description: '',
        type: 'text',
        content: '',
        file: null as File | null,
    });

    const assignmentForm = useForm({
        _method: 'POST',
        subject_assignment_id: subjectAssignmentId,
        title: '',
        description: '',
        due_date: '',
        points: 100,
        attachment: null as File | null,
    });

    const handleEditMaterial = (m: any) => {
        setEditingMaterialId(m.id);
        materialForm.setData({
            _method: 'PUT',
            subject_assignment_id: m.subject_assignment_id,
            title: m.title,
            description: m.description || '',
            type: m.type,
            content: m.content || '',
            file: null,
        });
        setShowMaterialForm(true);
    };

    const handleEditAssignment = (a: any) => {
        setEditingAssignmentId(a.id);
        const formattedDate = a.due_date ? new Date(a.due_date).toISOString().slice(0, 16) : '';
        assignmentForm.setData({
            _method: 'PUT',
            subject_assignment_id: a.subject_assignment_id,
            title: a.title,
            description: a.description || '',
            due_date: formattedDate,
            points: a.points || 100,
            attachment: null,
        });
        setShowAssignmentForm(true);
    };

    const submitMaterial = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingMaterialId 
            ? `/teacher/materials/${editingMaterialId}` 
            : '/teacher/materials';

        materialForm.post(url, {
            forceFormData: true,
            onSuccess: () => {
                closeMaterialModal();
                Swal.fire('Berhasil!', `Materi telah ${editingMaterialId ? 'diperbarui' : 'ditambahkan'}.`, 'success');
            },
        });
    };

    const submitAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingAssignmentId 
            ? `/teacher/assignments/${editingAssignmentId}` 
            : '/teacher/assignments';

        assignmentForm.post(url, {
            forceFormData: true,
            onSuccess: () => {
                closeAssignmentModal();
                Swal.fire('Berhasil!', `Tugas telah ${editingAssignmentId ? 'diperbarui' : 'diterbitkan'}.`, 'success');
            },
        });
    };

    const closeMaterialModal = () => {
        setShowMaterialForm(false);
        setEditingMaterialId(null);
        materialForm.reset();
    };

    const closeAssignmentModal = () => {
        setShowAssignmentForm(false);
        setEditingAssignmentId(null);
        assignmentForm.reset();
    };

    const handleDeleteMaterial = (id: number) => {
        Swal.fire({
            title: 'Hapus Materi?',
            text: "Data ini tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/teacher/materials/${id}`);
            }
        });
    };

    const handleDeleteAssignment = (id: number) => {
        Swal.fire({
            title: 'Hapus Tugas?',
            text: "Data pengumpulan siswa juga akan ikut terhapus!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/teacher/assignments/${id}`);
            }
        });
    };

    const handleKickStudent = (enrollmentId: number, studentName: string) => {
        Swal.fire({
            title: 'Keluarkan Siswa?',
            text: `Keluarkan ${studentName} dari kelas ini?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Keluarkan!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/teacher/enrollments/${enrollmentId}`, {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire('Berhasil!', 'Siswa telah dikeluarkan.', 'success'),
                });
            }
        });
    };

    return (
        <div className="p-6 space-y-8 bg-neutral-50/50 dark:bg-neutral-950/50 min-h-screen font-sans">
            <Head title={`Kelas ${classroom?.name || 'Detail'}`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Tombol Buat Tugas */}
                    <button 
                        onClick={() => {
                            assignmentForm.setData('_method', 'POST');
                            setShowAssignmentForm(true);
                        }} 
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                    >
                        <ClipboardCheck className="size-4" /> Buat Tugas Baru
                    </button>

                    {/* Tombol Tambah Materi */}
                    <button 
                        onClick={() => {
                            materialForm.setData('_method', 'POST');
                            setShowMaterialForm(true);
                        }} 
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
                    >
                        <Plus className="size-4" /> Tambah Materi
                    </button>

                    {/* Tombol Google Meet */}
                    <button 
                        onClick={() => {
                            materialForm.setData({
                                ...materialForm.data,
                                _method: 'POST',
                                type: 'link', // Kita gunakan tipe link untuk menampung URL Meet
                                title: 'Pertemuan Langsung: ' + (classroom?.name || ''),
                            });
                            setShowMaterialForm(true);
                        }} 
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                    >
                        <Video className="size-4" /> Mulai Google Meet
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-12">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                            <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Materi Pembelajaran</h2>
                        </div>
                        {materials?.length > 0 ? (
                            <div className="space-y-4">
                                {[...materials].sort((a, b) => a.id - b.id).map((m: any) => (
                                    <div key={m.id} className="group bg-white dark:bg-neutral-900 p-5 pr-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 border-l-4 border-l-emerald-600 flex items-center justify-between hover:shadow-xl transition-all duration-300">
                                        <div className="flex items-center gap-5">
                                            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 text-neutral-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 rounded-2xl transition-all shadow-sm">
                                                {m.type === 'video' ? <Youtube className="size-6" /> : m.type === 'file' ? <FileUp className="size-6" /> : m.type === 'link' ? <LinkIcon className="size-6" /> : <FileText className="size-6" />}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-black text-neutral-900 dark:text-white uppercase text-sm tracking-tight leading-none">{m.title}</h4>
                                                {m.description && <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 italic font-medium max-w-md">{m.description}</p>}
                                                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-2 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 rounded w-fit">{m.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEditMaterial(m)} className="p-2 text-neutral-400 hover:text-emerald-600 transition-colors">
                                                <Edit3 className="size-4" />
                                            </button>
                                            <button onClick={() => handleDeleteMaterial(m.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="size-4" />
                                            </button>
                                            <Link href={`/teacher/materials/${m.id}`} className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all ml-2">
                                                <ArrowRight className="size-5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-[3rem]">
                                <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">Belum ada materi.</p>
                            </div>
                        )}
                    </section>

                    <section className="space-y-6 pt-10 border-t border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                            <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Tugas & Penugasan</h2>
                        </div>
                        {assignments?.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {assignments.map((item: any) => (
                                    <div key={item.id} className="group bg-white dark:bg-neutral-900 p-5 pr-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 border-l-4 border-l-blue-600 flex items-center justify-between hover:shadow-xl transition-all duration-300">
                                        <div className="flex items-center gap-5">
                                            <div className="p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-2xl transition-all">
                                                <ClipboardCheck className="size-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-neutral-900 dark:text-white uppercase text-sm tracking-tight leading-none">{item.title}</h4>
                                                <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                                    <Calendar className="size-3" /> Deadline: {new Date(item.due_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEditAssignment(item)} className="p-2 text-neutral-400 hover:text-blue-600 transition-colors">
                                                <Edit3 className="size-4" />
                                            </button>
                                            <button onClick={() => handleDeleteAssignment(item.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="size-4" />
                                            </button>
                                            <Link href={`/teacher/assignments/${item.id}`} className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm ml-2">
                                                <ArrowRight className="size-5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-[3rem]">
                                <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">Belum ada tugas.</p>
                            </div>
                        )}
                    </section>
                </div>

                <aside className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Status Siswa</h2>
                        <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 text-[10px] font-black rounded-lg uppercase tracking-widest">{students?.length || 0} Total</span>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2.5rem] overflow-hidden shadow-sm">
                        <div className="max-h-[700px] overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
                            {students.map((item: any) => (
                                <div key={item.id} className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase">{item.user?.name?.charAt(0)}</div>
                                            <p className="text-[11px] font-black text-neutral-900 dark:text-white uppercase truncate max-w-[100px]">{item.user?.name}</p>
                                        </div>
                                        <button onClick={() => handleKickStudent(item.id, item.user?.name)} className="p-2 text-neutral-300 hover:text-red-500"><UserMinus className="size-4" /></button>
                                    </div>
                                    <div className="space-y-3 bg-neutral-50 dark:bg-neutral-950/50 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                                                <span className="text-neutral-400">Tugas</span>
                                                <span className="text-blue-600">{item.tugas_progress_percent || 0}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${item.tugas_progress_percent || 0}%` }} />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                                                <span className="text-neutral-400">Materi</span>
                                                <span className="text-emerald-600">{item.materi_progress_percent || 0}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${item.materi_progress_percent || 0}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

          {/* MODAL: TAMBAH / EDIT MATERI */}
{showMaterialForm && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-neutral-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="p-8 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center sticky top-0 bg-white dark:bg-neutral-900 z-10">
                <h2 className="text-xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
                    {editingMaterialId ? 'Edit' : 'Tambah'} <span className="text-emerald-600">Materi</span>
                </h2>
                <button onClick={closeMaterialModal} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"><X className="size-5" /></button>
            </div>
            <form onSubmit={submitMaterial} className="p-8 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Judul Materi</label>
                    <input type="text" required placeholder="Contoh: Pengenalan PHP 8.4" className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 text-neutral-900 dark:text-white font-bold" value={materialForm.data.title} onChange={e => materialForm.setData('title', e.target.value)} />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Instruksi Guru (Ringkasan)</label>
                    <textarea 
                        placeholder="Berikan ringkasan singkat materi ini." 
                        className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 text-neutral-900 dark:text-white font-medium min-h-[80px]" 
                        value={materialForm.data.description} 
                        onChange={e => materialForm.setData('description', e.target.value)} 
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[ { id: 'text', label: 'Rich Text', icon: Type }, { id: 'video', label: 'Video', icon: Youtube }, { id: 'file', label: 'File', icon: FileUp }, { id: 'link', label: 'Link', icon: LinkIcon } ].map((t) => (
                        <button 
                            key={t.id} 
                            type="button" 
                            onClick={() => {
                                // PEMBERSIHAN OTOMATIS SAAT KLIK:
                                // Jika user pindah ke tipe selain 'text', hapus semua tag HTML dari content
                                const currentContent = materialForm.data.content;
                                const cleanedContent = t.id !== 'text' 
                                    ? currentContent.replace(/<[^>]*>?/gm, '') 
                                    : currentContent;

                                materialForm.setData({
                                    ...materialForm.data,
                                    type: t.id as any,
                                    content: cleanedContent
                                });
                            }} 
                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${materialForm.data.type === t.id ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'border-neutral-100 dark:border-neutral-800 text-neutral-400'}`}
                        >
                            <t.icon className="size-5" />
                            <span className="text-[10px] font-black uppercase">{t.label}</span>
                        </button>
                    ))}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                        {materialForm.data.type === 'file' ? 'Upload File Baru' : (materialForm.data.type === 'text' ? 'Isi Materi Lengkap (Support Gambar & Media)' : 'Link / URL Sumber')}
                    </label>
                    
                    {materialForm.data.type === 'file' ? (
                        <div className="p-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl flex flex-col items-center justify-center gap-4">
                            <FileUp className="size-10 text-neutral-300" />
                            <input type="file" onChange={e => materialForm.setData('file', e.target.files ? e.target.files[0] : null)} className="text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-emerald-100 file:text-emerald-700" />
                        </div>
                    ) : materialForm.data.type === 'text' ? (
                        <div className="prose-emerald max-w-none min-h-[300px] border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
                            <CKEditor
                                editor={ClassicEditor as any}
                                data={materialForm.data.content}
                                onReady={(editor) => {
                                    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                                        return new MyUploadAdapter(loader, getCsrfToken(), '/teacher/materials/upload-image');
                                    };
                                }}
                                config={{
                                    placeholder: 'Tulis isi materi di sini...',
                                    toolbar: [
                                        'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 
                                        'blockQuote', '|', 'imageUpload', 'insertTable', 'mediaEmbed', 'undo', 'redo'
                                    ],
                                }}
                                onChange={(event, editor) => materialForm.setData('content', editor.getData())}
                            />
                        </div>
                    ) : (
                        <input 
                            type="url" 
                            required 
                            placeholder={materialForm.data.type === 'video' ? "https://www.youtube.com/watch?v=..." : "https://example.com/sumber-materi"} 
                            className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 text-neutral-900 dark:text-white font-medium" 
                            // NORMALISASI TAMPILAN:
                            // Menghapus tag HTML secara real-time agar input tetap bersih
                            value={materialForm.data.content.replace(/<[^>]*>?/gm, '')} 
                            onChange={e => materialForm.setData('content', e.target.value)} 
                        />
                    )}
                </div>

                <div className="pt-4">
                    <button disabled={materialForm.processing} type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all active:scale-[0.98]">
                        {editingMaterialId ? 'Simpan Perubahan' : 'Terbitkan Materi'}
                    </button>
                </div>
            </form>
        </div>
    </div>
)}
            {/* MODAL: BUAT / EDIT TUGAS */}
            {showAssignmentForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-neutral-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                        <div className="p-8 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center sticky top-0 bg-white dark:bg-neutral-900 z-10">
                            <h2 className="text-xl font-black uppercase text-neutral-900 dark:text-white tracking-tight">
                                {editingAssignmentId ? 'Edit' : 'Buat'} <span className="text-blue-600">Tugas Baru</span>
                            </h2>
                            <button onClick={closeAssignmentModal} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"><X className="size-5" /></button>
                        </div>
                        <form onSubmit={submitAssignment} className="p-8 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Judul Penugasan</label>
                                <input type="text" placeholder="JUDUL TUGAS" required className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 text-sm font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500" value={assignmentForm.data.title} onChange={e => assignmentForm.setData('title', e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Instruksi Pengerjaan (Support Gambar)</label>
                                <div className="prose-blue max-w-none border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden min-h-[250px]">
                                    <CKEditor
                                        editor={ClassicEditor as any}
                                        data={assignmentForm.data.description}
                                        onReady={(editor) => {
                                            editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                                                return new MyUploadAdapter(loader, getCsrfToken(), '/teacher/assignments/upload-image');
                                            };
                                        }}
                                        config={{
                                            placeholder: 'Tulis instruksi tugas di sini...',
                                            toolbar: [
                                                'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 
                                                '|', 'imageUpload', 'insertTable', 'mediaEmbed', 'undo', 'redo'
                                            ],
                                        }}
                                        onChange={(event, editor) => assignmentForm.setData('description', editor.getData())}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Batas Pengumpulan</label>
                                    <input type="datetime-local" required className="w-full bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-xl p-4 text-xs text-neutral-900 dark:text-white" value={assignmentForm.data.due_date} onChange={e => assignmentForm.setData('due_date', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Poin Maksimal</label>
                                    <input type="number" placeholder="POIN" className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 text-xs text-neutral-900 dark:text-white" value={assignmentForm.data.points} onChange={e => assignmentForm.setData('points', parseInt(e.target.value))} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Lampiran (File Pendukung)</label>
                                <div className="p-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-[2rem] flex flex-col items-center justify-center gap-3 bg-neutral-50/50 dark:bg-neutral-900/50">
                                    <FileUp className="size-8 text-neutral-300" />
                                    <input 
                                        type="file" 
                                        onChange={e => assignmentForm.setData('attachment', e.target.files ? e.target.files[0] : null)}
                                        className="text-[10px] font-black uppercase"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button disabled={assignmentForm.processing} type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98]">
                                    {editingAssignmentId ? 'Simpan Perubahan' : 'Terbitkan Tugas'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
Show.layout = (page: any) => {
    const classroomName = page?.props?.classroom?.name || 'Detail Kelas';
    return (
        <AppLayout breadcrumbs={[{ title: 'Kelas Saya', href: '/teacher/classrooms' }, { title: classroomName, href: '#' }]}>
            {page}
        </AppLayout>
    );
};