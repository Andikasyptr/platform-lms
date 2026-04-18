import { Head, useForm, router } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Eye, EyeOff, Trash2, UserPlus, Pencil, Save, X, RotateCcw, Users } from 'lucide-react';
import React, { useState } from 'react';
// Import komponen Dialog Shadcn
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface Teacher {
    id: number;
    name: string;
    email: string;
}

export default function Index({ teachers }: { teachers: Teacher[] }) {
    // State UI
    const [showCreatePassword, setShowCreatePassword] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    // Form untuk Tambah Guru
    const createForm = useForm({
        name: '',
        email: '',
        password: '',
    });

    // Form untuk Edit Guru
    const editForm = useForm({
        name: '',
        email: '',
        password: '', // Kosongkan jika tidak ingin ganti password
    });

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/users/teachers', {
            onSuccess: () => {
                createForm.reset();
                setShowCreatePassword(false);
            },
        });
    };

    const openEditModal = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        editForm.setData({
            name: teacher.name,
            email: teacher.email,
            password: '',
        });
        setIsEditOpen(true);
    };

    const submitUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeacher) return;
        
        editForm.put(`/admin/users/teachers/${selectedTeacher.id}`, {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
                setShowEditPassword(false);
            },
        });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus akun guru ${name}?`)) {
            router.delete(`/admin/users/teachers/${id}`);
        }
    };

    // Kelas CSS Reusable untuk Input agar konsisten di Light/Dark
    const inputClasses = "w-full p-2.5 border rounded-lg bg-white text-neutral-900 border-neutral-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 dark:focus:ring-indigo-600 dark:focus:border-indigo-600";
    const labelClasses = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

    return (
        <div className="p-4 space-y-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <Head title="Manajemen Guru" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Tambah Guru */}
                <div className="lg:col-span-1 border rounded-2xl p-7 bg-white dark:bg-neutral-900 shadow-sm border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-3 mb-6 border-b pb-4 border-neutral-200 dark:border-neutral-800">
                        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                            <UserPlus className="size-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-neutral-950 dark:text-white">Tambah Guru Baru</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Daftarkan akun pendidik baru</p>
                        </div>
                    </div>
                    
                    <form onSubmit={submitCreate} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className={labelClasses}>Nama Lengkap</label>
                            <input 
                                type="text" 
                                placeholder="Contoh: Budi Santoso, S.Pd."
                                className={inputClasses}
                                value={createForm.data.name}
                                onChange={e => createForm.setData('name', e.target.value)}
                            />
                            {createForm.errors.name && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{createForm.errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses}>Email Institusi</label>
                            <input 
                                type="email" 
                                placeholder="budi.santoso@sekolah.sch.id"
                                className={inputClasses}
                                value={createForm.data.email}
                                onChange={e => createForm.setData('email', e.target.value)}
                            />
                            {createForm.errors.email && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{createForm.errors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses}>Password Sementara</label>
                            <div className="relative">
                                <input 
                                    type={showCreatePassword ? "text" : "password"}
                                    placeholder="Minimal 8 karakter"
                                    className={`${inputClasses} pr-11`}
                                    value={createForm.data.password}
                                    onChange={e => createForm.setData('password', e.target.value)}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowCreatePassword(!showCreatePassword)} 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400 transition"
                                    title={showCreatePassword ? "Sembunyikan" : "Tampilkan"}
                                >
                                    {showCreatePassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                            {createForm.errors.password && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{createForm.errors.password}</p>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={createForm.processing} 
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-60 shadow-md shadow-indigo-100 dark:shadow-none mt-2"
                        >
                            {createForm.processing ? (
                                <>
                                    <RotateCcw className="size-5 animate-spin" />
                                    Mendaftarkan...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="size-5" />
                                    Daftarkan Guru
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Tabel Daftar Guru */}
                <div className="lg:col-span-2 border rounded-2xl p-7 bg-white dark:bg-neutral-900 shadow-sm border-neutral-200 dark:border-neutral-800 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6 border-b pb-4 border-neutral-200 dark:border-neutral-800">
                        <div>
                            <h3 className="text-xl font-bold text-neutral-950 dark:text-white">Daftar Akun Guru</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Total {teachers.length} guru terdaftar</p>
                        </div>
                        <PlaceholderPattern className="absolute top-0 right-0 size-24 stroke-neutral-200/50 dark:stroke-neutral-800/50" />
                    </div>

                    <div className="relative z-10 overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                                    <th className="py-4 px-3 font-semibold text-neutral-900 dark:text-neutral-100">Nama Lengkap</th>
                                    <th className="py-4 px-3 font-semibold text-neutral-900 dark:text-neutral-100">Email</th>
                                    <th className="py-4 px-3 font-semibold text-center text-neutral-900 dark:text-neutral-100">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                                {teachers.length > 0 ? teachers.map((t) => (
                                    <tr key={t.id} className="group hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition">
                                        <td className="py-4 px-3 font-medium text-neutral-950 dark:text-neutral-50">{t.name}</td>
                                        <td className="py-4 px-3 text-neutral-700 dark:text-neutral-300">{t.email}</td>
                                        <td className="py-4 px-3">
                                            <div className="flex justify-center items-center gap-2.5">
                                                <button 
                                                    onClick={() => openEditModal(t)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition dark:text-blue-400 dark:hover:bg-blue-950/50"
                                                    title={`Edit ${t.name}`}
                                                >
                                                    <Pencil className="size-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(t.id, t.name)} 
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition dark:text-red-400 dark:hover:bg-red-950/50"
                                                    title={`Hapus ${t.name}`}
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="py-16 text-center text-neutral-500 dark:text-neutral-400 italic">
                                            <Users className="size-12 mx-auto mb-4 opacity-50" /> {/* <--- Ini yang bikin error */}
                                            Belum ada akun guru yang terdaftar.
                                        </td>
                                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL EDIT GURU */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[480px] rounded-2xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-lg px-7 pt-7 pb-6">
                    <DialogHeader className="flex flex-row items-center justify-between border-b pb-4 border-neutral-200 dark:border-neutral-800 mb-2">
                        <DialogTitle className="text-xl font-bold flex items-center gap-3 text-neutral-950 dark:text-white">
                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                                <Pencil className="size-5" />
                            </div>
                            Edit Profil Guru
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submitUpdate} className="space-y-5 py-4">
                        <div className="space-y-1.5">
                            <label className={labelClasses}>Nama Lengkap</label>
                            <input 
                                type="text" 
                                className={inputClasses}
                                value={editForm.data.name}
                                onChange={e => editForm.setData('name', e.target.value)}
                            />
                            {editForm.errors.name && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{editForm.errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses}>Email Institusi</label>
                            <input 
                                type="email" 
                                className={inputClasses}
                                value={editForm.data.email}
                                onChange={e => editForm.setData('email', e.target.value)}
                            />
                            {editForm.errors.email && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{editForm.errors.email}</p>}
                        </div>

                        <div className="space-y-1.5 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
                            <label className={`${labelClasses} text-neutral-900 dark:text-white`}>Ganti Password (Opsional)</label>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2.5">Kosongkan jika tidak ingin mengubah password guru ini.</p>
                            <div className="relative">
                                <input 
                                    type={showEditPassword ? "text" : "password"}
                                    placeholder="Masukkan password baru"
                                    className={`${inputClasses} pr-11 bg-white dark:bg-neutral-800`}
                                    value={editForm.data.password}
                                    onChange={e => editForm.setData('password', e.target.value)}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowEditPassword(!showEditPassword)} 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 transition"
                                >
                                    {showEditPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                            {editForm.errors.password && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{editForm.errors.password}</p>}
                        </div>

                        <DialogFooter className="mt-8 flex gap-3 sm:justify-end border-t pt-5 border-neutral-200 dark:border-neutral-800">
                            <button 
                                type="button" 
                                onClick={() => setIsEditOpen(false)}
                                className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 transition dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={editForm.processing}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-60 shadow-md shadow-blue-100 dark:shadow-none"
                            >
                                {editForm.processing ? (
                                    <>
                                        <RotateCcw className="size-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-4" />
                                        Simpan Perubahan
                                    </>
                                )}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

Index.layout = (props: any) => ({
    breadcrumbs: [
        { title: 'Beranda utama', href: '/dashboard' },
        { title: 'Manajemen Akun', href: '#' },
        { title: 'Data Tenaga Pengajar', href: '/admin/users/teachers' },
    ],
});