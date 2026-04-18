import { Head, useForm, router } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Eye, EyeOff, Trash2, UserPlus, Pencil, Save, GraduationCap, RotateCcw, Users } from 'lucide-react';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface Student {
    id: number;
    name: string;
    email: string;
}

export default function Index({ students }: { students: Student[] }) {
    // State UI
    const [showCreatePassword, setShowCreatePassword] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    // Form Tambah Siswa
    const createForm = useForm({
        name: '',
        email: '',
        password: '',
    });

    // Form Edit Siswa
    const editForm = useForm({
        name: '',
        email: '',
        password: '',
    });

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/users/students', {
            onSuccess: () => {
                createForm.reset();
                setShowCreatePassword(false);
            },
        });
    };

    const openEditModal = (student: Student) => {
        setSelectedStudent(student);
        editForm.setData({
            name: student.name,
            email: student.email,
            password: '',
        });
        setIsEditOpen(true);
    };

    const submitUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent) return;
        
        editForm.put(`/admin/users/students/${selectedStudent.id}`, {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
                setShowEditPassword(false);
            },
        });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus akun siswa ${name}?`)) {
            router.delete(`/admin/users/students/${id}`);
        }
    };

    const inputClasses = "w-full p-2.5 border rounded-lg bg-white text-neutral-900 border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700";
    const labelClasses = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

    return (
        <div className="p-4 space-y-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <Head title="Manajemen Siswa" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Tambah Siswa */}
                <div className="lg:col-span-1 border rounded-2xl p-7 bg-white dark:bg-neutral-900 shadow-sm border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-3 mb-6 border-b pb-4 border-neutral-200 dark:border-neutral-800">
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                            <UserPlus className="size-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-neutral-950 dark:text-white">Tambah Siswa</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Daftarkan akun siswa baru</p>
                        </div>
                    </div>
                    
                    <form onSubmit={submitCreate} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className={labelClasses}>Nama Siswa</label>
                            <input 
                                type="text" 
                                placeholder="Nama lengkap siswa..."
                                className={inputClasses}
                                value={createForm.data.name}
                                onChange={e => createForm.setData('name', e.target.value)}
                            />
                            {createForm.errors.name && <p className="text-red-600 text-xs mt-1">{createForm.errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses}>Email / NISN</label>
                            <input 
                                type="email" 
                                placeholder="siswa@sekolah.id"
                                className={inputClasses}
                                value={createForm.data.email}
                                onChange={e => createForm.setData('email', e.target.value)}
                            />
                            {createForm.errors.email && <p className="text-red-600 text-xs mt-1">{createForm.errors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses}>Password</label>
                            <div className="relative">
                                <input 
                                    type={showCreatePassword ? "text" : "password"}
                                    placeholder="Minimal 8 karakter"
                                    className={`${inputClasses} pr-11`}
                                    value={createForm.data.password}
                                    onChange={e => createForm.setData('password', e.target.value)}
                                />
                                <button type="button" onClick={() => setShowCreatePassword(!showCreatePassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                                    {showCreatePassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={createForm.processing} 
                            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-60 shadow-md shadow-emerald-100 dark:shadow-none"
                        >
                            {createForm.processing ? <RotateCcw className="size-5 animate-spin" /> : <Save className="size-5" />}
                            Simpan Akun Siswa
                        </button>
                    </form>
                </div>

                {/* Tabel Daftar Siswa */}
                <div className="lg:col-span-2 border rounded-2xl p-7 bg-white dark:bg-neutral-900 shadow-sm border-neutral-200 dark:border-neutral-800 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6 border-b pb-4 border-neutral-200 dark:border-neutral-800">
                        <div>
                            <h3 className="text-xl font-bold text-neutral-950 dark:text-white text-emerald-600">Daftar Akun Siswa</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Total {students.length} siswa aktif</p>
                        </div>
                        <GraduationCap className="size-10 text-emerald-100 dark:text-emerald-900/30" />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                                    <th className="py-4 px-3 font-semibold text-neutral-900 dark:text-neutral-100">Nama Lengkap</th>
                                    <th className="py-4 px-3 font-semibold text-neutral-900 dark:text-neutral-100">Email</th>
                                    <th className="py-4 px-3 font-semibold text-center text-neutral-900 dark:text-neutral-100">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
                                {students.map((s) => (
                                    <tr key={s.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition">
                                        <td className="py-4 px-3 font-medium text-neutral-950 dark:text-neutral-50">{s.name}</td>
                                        <td className="py-4 px-3 text-neutral-700 dark:text-neutral-300">{s.email}</td>
                                        <td className="py-4 px-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openEditModal(s)} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition dark:text-emerald-400 dark:hover:bg-emerald-950">
                                                    <Pencil className="size-4" />
                                                </button>
                                                <button onClick={() => handleDelete(s.id, s.name)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition dark:hover:bg-red-950">
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                <td colSpan={3} className="py-16 text-center text-neutral-500 dark:text-neutral-400 italic">
                                    <Users className="size-12 mx-auto mb-4 opacity-50" /> {/* <--- Ini yang bikin error */}
                                    Belum ada akun siswa yang terdaftar.
                                </td>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Edit Siswa */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[480px] rounded-2xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-lg px-7 pt-7 pb-6">
                    <DialogHeader className="border-b pb-4 mb-4">
                        <DialogTitle className="text-xl font-bold flex items-center gap-3 text-emerald-600">
                            <Pencil className="size-5" />
                            Edit Profil Siswa
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submitUpdate} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className={labelClasses}>Nama Lengkap</label>
                            <input type="text" className={inputClasses} value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClasses}>Email</label>
                            <input type="email" className={inputClasses} value={editForm.data.email} onChange={e => editForm.setData('email', e.target.value)} />
                        </div>
                        <div className="space-y-1.5 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
                            <label className={labelClasses}>Ganti Password (Opsional)</label>
                            <div className="relative mt-2">
                                <input 
                                    type={showEditPassword ? "text" : "password"}
                                    placeholder="Isi untuk ganti password"
                                    className={`${inputClasses} bg-white dark:bg-neutral-800`}
                                    value={editForm.data.password}
                                    onChange={e => editForm.setData('password', e.target.value)}
                                />
                                <button type="button" onClick={() => setShowEditPassword(!showEditPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                                    {showEditPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700">Batal</button>
                            <button type="submit" disabled={editForm.processing} className="px-5 py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-100 dark:shadow-none">Update Data</button>
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
        { title: 'Data Seluruh Siswa', href: '/admin/users/students' },
    ],
});