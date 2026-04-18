import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Trash2, School, RotateCcw, Users } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import React from 'react';

export default function Index({ classrooms = [], teachers = [] }: any) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: '',
        teacher_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/classrooms', { 
            onSuccess: () => reset(),
            preserveScroll: true 
        });
    };

    const deleteClass = (id: number) => {
        if (confirm('Yakin ingin menghapus kelas ini?')) {
            router.delete(`/admin/classrooms/${id}`);
        }
    };

    const inputClasses = "w-full p-2.5 border rounded-lg bg-white text-neutral-900 border-neutral-300 focus:ring-2 focus:ring-violet-500 outline-none transition dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700";

    return (
        <div className="p-4 space-y-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <Head title="Manajemen Kelas" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Tambah Kelas */}
                <div className="border rounded-2xl p-6 bg-white dark:bg-neutral-900 shadow-sm border-neutral-200 dark:border-neutral-800 h-fit">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-violet-600">
                        <Plus className="size-6" /> Buat Kelas
                    </h3>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Nama Kelas</label>
                            <input 
                                type="text" 
                                placeholder="Misal: X RPL 1" 
                                className={inputClasses} 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Guru Pengampu</label>
                            <select 
                                className={inputClasses} 
                                value={data.teacher_id} 
                                onChange={e => setData('teacher_id', e.target.value)}
                            >
                                <option value="">Pilih Guru Pengampu...</option>
                                {teachers.map((t: any) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                            {errors.teacher_id && <p className="text-red-500 text-xs mt-1">{errors.teacher_id}</p>}
                        </div>

                        <button 
                            disabled={processing} 
                            className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold hover:bg-violet-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {processing ? <RotateCcw className="size-5 animate-spin" /> : <School className="size-5" />}
                            Simpan Kelas
                        </button>
                    </form>
                </div>

                {/* List Kelas */}
                <div className="lg:col-span-2 border rounded-2xl p-6 bg-white dark:bg-neutral-900 shadow-sm border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-bold mb-6">Daftar Kelas</h3>
                    
                    {classrooms.length === 0 ? (
                        <div className="text-center py-20 text-neutral-500 italic border-2 border-dashed rounded-2xl">
                            Belum ada data kelas.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {classrooms.map((c: any) => (
                                <div key={c.id} className="p-5 border rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-lg uppercase text-neutral-900 dark:text-white">{c.name}</h4>
                                            <code className="text-[10px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded dark:bg-violet-900/50 uppercase">
                                                ID: {c.code}
                                            </code>
                                        </div>
                                        <button 
                                            onClick={() => deleteClass(c.id)} 
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                                            <Users className="size-3" />
                                            {c.students_count || 0} Siswa
                                        </div>
                                        <div className="text-neutral-500">
                                            Pengampu: <span className="text-neutral-900 dark:text-neutral-200 font-medium">{c.teacher?.name || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Index.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Beranda utama', href: '/dashboard' }, { title: 'Akademik', href: '#' }, { title: 'Manajemen Ruang kelas', href: '/admin/classrooms' }]}>
        {page}
    </AppLayout>
);