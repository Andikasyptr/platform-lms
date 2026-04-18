import { Head, useForm, router } from '@inertiajs/react';
import { Book, Plus, Pencil, Trash2, Save, RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface Subject {
    id: number;
    name: string;
    description: string;
}

export default function Index({ subjects }: { subjects: Subject[] }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const createForm = useForm({ name: '', description: '' });
    const editForm = useForm({ name: '', description: '' });

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/subjects', { onSuccess: () => createForm.reset() });
    };

    const openEditModal = (sub: Subject) => {
        setSelectedSubject(sub);
        editForm.setData({ name: sub.name, description: sub.description || '' });
        setIsEditOpen(true);
    };

    const submitUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubject) return;
        editForm.put(`/admin/subjects/${selectedSubject.id}`, { onSuccess: () => setIsEditOpen(false) });
    };

    const inputClasses = "w-full p-2.5 border rounded-lg bg-white text-neutral-900 border-neutral-300 focus:ring-2 focus:ring-amber-500 outline-none transition dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700";

    return (
        <div className="p-4 space-y-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <Head title="Manajemen Mapel" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Tambah */}
                <div className="lg:col-span-1 border rounded-2xl p-7 bg-white dark:bg-neutral-900 shadow-sm border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-3 mb-6 border-b pb-4 border-neutral-200 dark:border-neutral-800">
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                            <Plus className="size-6" />
                        </div>
                        <h3 className="text-xl font-bold">Tambah Mapel</h3>
                    </div>
                    
                    <form onSubmit={submitCreate} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Nama Mata Pelajaran</label>
                            <input type="text" placeholder="Misal: Biologi" className={inputClasses} value={createForm.data.name} onChange={e => createForm.setData('name', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Deskripsi Singkat</label>
                            <textarea className={inputClasses} rows={3} value={createForm.data.description} onChange={e => createForm.setData('description', e.target.value)} />
                        </div>
                        <button type="submit" disabled={createForm.processing} className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition shadow-md shadow-amber-100 dark:shadow-none">
                            {createForm.processing ? <RotateCcw className="size-5 animate-spin" /> : <Book className="size-5" />}
                            Simpan Mapel
                        </button>
                    </form>
                </div>

                {/* Daftar Mapel */}
                <div className="lg:col-span-2 border rounded-2xl p-7 bg-white dark:bg-neutral-900 shadow-sm border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-bold mb-6 text-amber-600">Daftar Mata Pelajaran</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {subjects.map((s) => (
                            <div key={s.id} className="p-4 border rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 flex justify-between items-center group">
                                <div>
                                    <h4 className="font-bold text-neutral-900 dark:text-white">{s.name}</h4>
                                    <p className="text-xs text-neutral-500 line-clamp-1">{s.description || 'Tidak ada deskripsi'}</p>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => openEditModal(s)} 
                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg dark:text-blue-400 dark:hover:bg-blue-950/50"
                                    >
                                        <Pencil className="size-4" />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if(confirm('Hapus mata pelajaran ini?')) {
                                                router.delete(`/admin/subjects/${s.id}`);
                                            }
                                        }} 
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg dark:text-red-400 dark:hover:bg-red-950/50"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {subjects.length === 0 && (
                        <div className="py-20 text-center text-neutral-500 italic">
                            Belum ada mata pelajaran yang terdaftar.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Edit Mapel */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[480px] rounded-2xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-lg px-7 pt-7 pb-6">
                    <DialogHeader className="border-b pb-4 mb-4">
                        <DialogTitle className="text-xl font-bold flex items-center gap-3 text-amber-600">
                            <Pencil className="size-5" />
                            Edit Mata Pelajaran
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submitUpdate} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300"> Nama Mata Pelajaran </label>
                            <input 
                                type="text" 
                                className={inputClasses} 
                                value={editForm.data.name} 
                                onChange={e => editForm.setData('name', e.target.value)} 
                            />
                            {editForm.errors.name && <p className="text-red-600 text-xs mt-1">{editForm.errors.name}</p>}
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300"> Deskripsi </label>
                            <textarea 
                                className={inputClasses} 
                                rows={3}
                                value={editForm.data.description} 
                                onChange={e => editForm.setData('description', e.target.value)} 
                            />
                        </div>

                        <DialogFooter className="mt-6 gap-2 sm:gap-0">
                            <button 
                                type="button" 
                                onClick={() => setIsEditOpen(false)} 
                                className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={editForm.processing} 
                                className="px-5 py-2.5 text-sm font-semibold bg-amber-500 text-white rounded-xl hover:bg-amber-600 shadow-md shadow-amber-100 dark:shadow-none transition flex items-center gap-2"
                            >
                                {editForm.processing ? <RotateCcw className="size-4 animate-spin" /> : <Save className="size-4" />}
                                Simpan Perubahan
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Integrasi dengan Sidebar Navigasi
Index.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Beranda utama', href: '/dashboard' },
        { title: 'Akademik', href: '#' },
        { title: 'Katalog Mata Pelajaran', href: '/admin/subjects' },
    ],
    children: page,
});