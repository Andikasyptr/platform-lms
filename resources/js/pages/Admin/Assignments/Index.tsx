import { Head, useForm, router } from '@inertiajs/react';
import { Calendar, Plus, Trash2, Clock, BookOpen, GraduationCap, Presentation, RotateCcw, Edit2, X } from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

export default function Index({ assignments, classrooms, subjects, teachers }: any) {
    // State untuk memantau apakah sedang dalam mode edit
    const [editId, setEditId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        classroom_id: '',
        subject_id: '',
        teacher_id: '',
        day: '',
        start_time: '',
        end_time: '',
    });

    // Fungsi untuk mengisi form saat tombol edit diklik
    const handleEdit = (as: any) => {
        setEditId(as.id);
        setData({
            classroom_id: as.classroom_id.toString(),
            subject_id: as.subject_id.toString(),
            teacher_id: as.teacher_id.toString(),
            day: as.day,
            start_time: as.start_time.substring(0, 5),
            end_time: as.end_time.substring(0, 5),
        });
    };

    // Reset form dan keluar dari mode edit
    const cancelEdit = () => {
        setEditId(null);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editId) {
            // Jika ada editId, gunakan method PUT
            put(`/admin/assignments/${editId}`, {
                onSuccess: () => cancelEdit(),
            });
        } else {
            // Jika tidak, gunakan method POST (Tambah baru)
            post('/admin/assignments', {
                onSuccess: () => reset(),
            });
        }
    };

    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    
    const inputClasses = "w-full p-2.5 border rounded-lg bg-white text-neutral-900 border-neutral-300 focus:ring-2 focus:ring-sky-500 outline-none transition dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700";
    const labelClasses = "text-sm font-medium text-neutral-700 dark:text-neutral-300";
    const errorClasses = "text-xs text-red-500 mt-1";

    return (
        <div className="p-4 space-y-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
            <Head title="Penjadwalan & Ruang Mapel" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Form Plotting Jadwal */}
                <div className={`lg:col-span-1 border rounded-2xl p-6 bg-white dark:bg-neutral-900 shadow-sm transition-all ${editId ? 'border-amber-500 ring-1 ring-amber-500' : 'border-neutral-200 dark:border-neutral-800'} h-fit`}>
                    <div className="flex items-center justify-between mb-6 border-b pb-4 border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${editId ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'} dark:bg-opacity-10`}>
                                {editId ? <Edit2 className="size-6" /> : <Plus className="size-6" />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{editId ? 'Edit Jadwal' : 'Plotting Ruang'}</h3>
                                <p className="text-xs text-neutral-500">{editId ? 'Ubah jadwal terpilih' : 'Hubungkan Guru & Mapel'}</p>
                            </div>
                        </div>
                        {editId && (
                            <button onClick={cancelEdit} className="text-neutral-400 hover:text-red-500 transition">
                                <X className="size-5" />
                            </button>
                        )}
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className={labelClasses}>Pilih Kelas</label>
                            <select className={inputClasses} value={data.classroom_id} onChange={e => setData('classroom_id', e.target.value)}>
                                <option value="">Pilih Kelas...</option>
                                {classrooms.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {errors.classroom_id && <p className={errorClasses}>{errors.classroom_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses}>Mata Pelajaran</label>
                            <select className={inputClasses} value={data.subject_id} onChange={e => setData('subject_id', e.target.value)}>
                                <option value="">Pilih Mapel...</option>
                                {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.subject_id && <p className={errorClasses}>{errors.subject_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses}>Guru Pengajar</label>
                            <select className={inputClasses} value={data.teacher_id} onChange={e => setData('teacher_id', e.target.value)}>
                                <option value="">Pilih Guru...</option>
                                {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            {errors.teacher_id && <p className={errorClasses}>{errors.teacher_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClasses}>Hari</label>
                            <select className={inputClasses} value={data.day} onChange={e => setData('day', e.target.value)}>
                                <option value="">Pilih Hari...</option>
                                {days.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            {errors.day && <p className={errorClasses}>{errors.day}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className={labelClasses}>Mulai</label>
                                <input type="time" className={inputClasses} value={data.start_time} onChange={e => setData('start_time', e.target.value)} />
                                {errors.start_time && <p className={errorClasses}>{errors.start_time}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClasses}>Selesai</label>
                                <input type="time" className={inputClasses} value={data.end_time} onChange={e => setData('end_time', e.target.value)} />
                                {errors.end_time && <p className={errorClasses}>{errors.end_time}</p>}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing} 
                            className={`w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition shadow-md disabled:opacity-50 ${editId ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-sky-600 hover:bg-sky-700 text-white'}`}
                        >
                            {processing ? <RotateCcw className="size-5 animate-spin" /> : <Calendar className="size-5" />}
                            {editId ? 'Perbarui Jadwal' : 'Simpan Jadwal Ruang'}
                        </button>
                    </form>
                </div>

                {/* List Ruang Mapel Aktif */}
                <div className="lg:col-span-3 border rounded-2xl p-6 bg-white dark:bg-neutral-900 shadow-sm border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-sky-600">Daftar Ruang Pembelajaran</h3>
                            <p className="text-sm text-neutral-500">Monitoring pengajar di setiap kelas</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-sm font-semibold text-neutral-500 border-b border-neutral-100 dark:border-neutral-800 uppercase tracking-wider">
                                    <th className="py-4 px-2">Waktu & Hari</th>
                                    <th className="py-4 px-2">Kelas</th>
                                    <th className="py-4 px-2">Mata Pelajaran</th>
                                    <th className="py-4 px-2">Guru</th>
                                    <th className="py-4 px-2 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800">
                                {assignments.map((as: any) => (
                                    <tr key={as.id} className={`group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${editId === as.id ? 'bg-amber-50 dark:bg-amber-900/10' : ''}`}>
                                        <td className="py-4 px-2">
                                            <div className="font-bold text-neutral-900 dark:text-white">{as.day}</div>
                                            <div className="text-xs flex items-center gap-1 text-neutral-500">
                                                <Clock className="size-3" /> {as.start_time?.substring(0, 5)} - {as.end_time?.substring(0, 5)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <div className="p-1.5 rounded-md bg-violet-50 text-violet-600 dark:bg-violet-900/30">
                                                    <GraduationCap className="size-4" />
                                                </div>
                                                {as.classroom?.name}
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="text-sm font-medium">{as.subject?.name}</div>
                                        </td>
                                        <td className="py-4 px-2 text-sm font-medium italic text-neutral-600 dark:text-neutral-400">
                                            {as.teacher?.name}
                                        </td>
                                        <td className="py-4 px-2 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button 
                                                    onClick={() => handleEdit(as)}
                                                    className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition"
                                                >
                                                    <Edit2 className="size-4" />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if(confirm('Yakin ingin menghapus plotting ini?')) {
                                                            router.delete(`/admin/assignments/${as.id}`);
                                                        }
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Gunakan layout bawaan agar sidebar tetap terlihat
Index.layout = (page: any) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Akademik', href: '#' },
        { title: 'Agenda & Penjadwalan', href: '/admin/assignments' },
    ]}>
        {page}
    </AppLayout>
);