import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    Users, FileText, ChevronRight, Plus, X, Youtube, 
    Link as LinkIcon, FileUp, Type, ArrowRight, Trash2, 
    ClipboardCheck, Calendar, UserMinus, Info, Layout, Globe, Edit3, Video
} from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

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
        const url = editingMaterialId ? `/teacher/materials/${editingMaterialId}` : '/teacher/materials';
        materialForm.post(url, {
            forceFormData: true,
            onSuccess: () => { closeMaterialModal(); Swal.fire('Berhasil!', 'Materi diperbarui.', 'success'); },
        });
    };

    const submitAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingAssignmentId ? `/teacher/assignments/${editingAssignmentId}` : '/teacher/assignments';
        assignmentForm.post(url, {
            forceFormData: true,
            onSuccess: () => { closeAssignmentModal(); Swal.fire('Berhasil!', 'Tugas diterbitkan.', 'success'); },
        });
    };

    const closeMaterialModal = () => { setShowMaterialForm(false); setEditingMaterialId(null); materialForm.reset(); };
    const closeAssignmentModal = () => { setShowAssignmentForm(false); setEditingAssignmentId(null); assignmentForm.reset(); };

    const handleDeleteMaterial = (id: number) => {
        Swal.fire({ title: 'Hapus?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya' }).then(r => r.isConfirmed && router.delete(`/teacher/materials/${id}`));
    };

    const handleDeleteAssignment = (id: number) => {
        Swal.fire({ title: 'Hapus Tugas?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya' }).then(r => r.isConfirmed && router.delete(`/teacher/assignments/${id}`));
    };

    const handleKickStudent = (enrollmentId: number, studentName: string) => {
        Swal.fire({ title: 'Keluarkan Siswa?', text: studentName, icon: 'warning', showCancelButton: true }).then(r => r.isConfirmed && router.delete(`/teacher/enrollments/${enrollmentId}`));
    };

    return (
        <div className="p-6 space-y-8 bg-neutral-50/50 dark:bg-neutral-950/50 min-h-screen font-sans">
            <Head title={`Kelas ${classroom?.name || 'Detail'}`} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => { assignmentForm.setData('_method', 'POST'); setShowAssignmentForm(true); }} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                        <ClipboardCheck className="size-4" /> Buat Tugas Baru
                    </button>
                    <button onClick={() => { materialForm.setData('_method', 'POST'); setShowMaterialForm(true); }} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-95">
                        <Plus className="size-4" /> Tambah Materi
                    </button>
                    <button onClick={() => { materialForm.setData({ ...materialForm.data, _method: 'POST', type: 'link', title: 'Pertemuan Langsung: ' + (classroom?.name || '') }); setShowMaterialForm(true); }} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                        <Video className="size-4" /> Mulai Google Meet
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-12">
                    {/* MATERI SECTION */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                            <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Materi Pembelajaran</h2>
                        </div>
                        <div className="space-y-4">
                            {materials.map((m: any) => (
                                <div key={m.id} className="group bg-white dark:bg-neutral-900 p-5 pr-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 border-l-4 border-l-emerald-600 flex items-center justify-between hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl transition-all shadow-sm">
                                            {m.type === 'video' ? <Youtube className="size-6" /> : m.type === 'file' ? <FileUp className="size-6" /> : m.type === 'link' ? <LinkIcon className="size-6" /> : <FileText className="size-6" />}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-black text-neutral-900 dark:text-white uppercase text-sm tracking-tight leading-none">{m.title}</h4>
                                            {m.description && <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 italic font-medium max-w-md">{m.description}</p>}
                                            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-2 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 rounded w-fit">{m.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEditMaterial(m)} className="p-2 text-neutral-400 hover:text-emerald-600 transition-colors"><Edit3 className="size-4" /></button>
                                        <button onClick={() => handleDeleteMaterial(m.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 className="size-4" /></button>
                                        <Link href={`/teacher/materials/${m.id}`} className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all ml-2"><ArrowRight className="size-5" /></Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* TUGAS SECTION */}
                    <section className="space-y-6 pt-10 border-t border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                            <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Tugas & Penugasan</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {assignments.map((item: any) => (
                                <div key={item.id} className="group bg-white dark:bg-neutral-900 p-5 pr-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 border-l-4 border-l-blue-600 flex items-center justify-between hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-2xl transition-all"><ClipboardCheck className="size-6" /></div>
                                        <div>
                                            <h4 className="font-black text-neutral-900 dark:text-white uppercase text-sm tracking-tight leading-none">{item.title}</h4>
                                            <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest"><Calendar className="size-3" /> Deadline: {new Date(item.due_date).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEditAssignment(item)} className="p-2 text-neutral-400 hover:text-blue-600 transition-colors"><Edit3 className="size-4" /></button>
                                        <button onClick={() => handleDeleteAssignment(item.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 className="size-4" /></button>
                                        <Link href={`/teacher/assignments/${item.id}`} className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm ml-2"><ArrowRight className="size-5" /></Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* ASIDE WITH PROGRESS BARS (TIDAK GUA ILANGIN!) */}
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

            {/* MODAL MATERI */}
            {showMaterialForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-neutral-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                        <div className="p-8 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900">
                            <h2 className="text-xl font-black uppercase tracking-tight">
                                {editingMaterialId ? 'Edit' : 'Tambah'} <span className="text-emerald-600">Materi</span>
                            </h2>
                            <button onClick={closeMaterialModal} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"><X className="size-5" /></button>
                        </div>
                        <form onSubmit={submitMaterial} className="p-8 space-y-6 max-h-[85vh] overflow-y-auto">
                            <input type="text" placeholder="Judul Materi" className="w-full bg-neutral-50 dark:bg-neutral-800 border-neutral-200 rounded-xl p-4 font-bold text-neutral-900 dark:text-white" value={materialForm.data.title} onChange={e => materialForm.setData('title', e.target.value)} />
                            <textarea placeholder="Ringkasan singkat" className="w-full bg-neutral-50 dark:bg-neutral-800 border-neutral-200 rounded-xl p-4 min-h-[80px]" value={materialForm.data.description} onChange={e => materialForm.setData('description', e.target.value)} />
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['text', 'video', 'file', 'link'].map(t => (
                                    <button key={t} type="button" onClick={() => materialForm.setData('type', t as any)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${materialForm.data.type === t ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-neutral-100 text-neutral-400'}`}>
                                        <span className="text-[10px] font-black uppercase">{t}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                {materialForm.data.type === 'file' ? (
                                    <input type="file" onChange={e => materialForm.setData('file', e.target.files ? e.target.files[0] : null)} className="w-full text-xs" />
                                ) : (
                                    <textarea 
                                        rows={8}
                                        placeholder="Tulis isi materi atau URL di sini..."
                                        className="w-full bg-neutral-50 dark:bg-neutral-800 border-neutral-200 rounded-xl p-4 text-sm font-medium focus:ring-emerald-500 whitespace-pre-wrap"
                                        value={materialForm.data.content}
                                        onChange={e => materialForm.setData('content', e.target.value)}
                                    />
                                )}
                            </div>
                            <button type="submit" disabled={materialForm.processing} className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">Simpan Materi</button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL TUGAS */}
            {showAssignmentForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-neutral-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                        <div className="p-8 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900">
                            <h2 className="text-xl font-black uppercase tracking-tight">
                                {editingAssignmentId ? 'Edit' : 'Buat'} <span className="text-blue-600">Tugas Baru</span>
                            </h2>
                            <button onClick={closeAssignmentModal} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"><X className="size-5" /></button>
                        </div>
                        <form onSubmit={submitAssignment} className="p-8 space-y-6 max-h-[85vh] overflow-y-auto">
                            <input type="text" placeholder="Judul Penugasan" className="w-full bg-neutral-50 dark:bg-neutral-800 border-neutral-200 rounded-xl p-4 font-bold text-neutral-900 dark:text-white" value={assignmentForm.data.title} onChange={e => assignmentForm.setData('title', e.target.value)} />
                            <textarea 
                                rows={6}
                                placeholder="Tulis instruksi tugas di sini..."
                                className="w-full bg-neutral-50 dark:bg-neutral-800 border-neutral-200 rounded-xl p-4 text-sm font-medium whitespace-pre-wrap"
                                value={assignmentForm.data.description}
                                onChange={e => assignmentForm.setData('description', e.target.value)}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="datetime-local" className="w-full bg-neutral-50 dark:bg-neutral-800 border-neutral-200 rounded-xl p-4 text-xs" value={assignmentForm.data.due_date} onChange={e => assignmentForm.setData('due_date', e.target.value)} />
                                <input type="number" placeholder="Poin" className="w-full bg-neutral-50 dark:bg-neutral-800 border-neutral-200 rounded-xl p-4 text-xs" value={assignmentForm.data.points} onChange={e => assignmentForm.setData('points', parseInt(e.target.value))} />
                            </div>
                            <button type="submit" disabled={assignmentForm.processing} className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">Terbitkan Tugas</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// FIX ERROR page.props undefined
Show.layout = (page: any) => {
    const props = page?.props || {};
    const classroomName = props.classroom?.name || 'Detail Kelas';
    return (
        <AppLayout breadcrumbs={[{ title: 'Kelas Saya', href: '/teacher/classrooms' }, { title: classroomName, href: '#' }]}>
            {page}
        </AppLayout>
    );
};