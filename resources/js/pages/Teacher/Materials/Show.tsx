import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { 
    ChevronLeft, 
    Download, 
    ExternalLink, 
    FileText, 
    Youtube, 
    FileUp, 
    Clock,
    Calendar,
    Share2,
    FileCode,
    PlayCircle,
    Info,
    Layout,
    Globe
} from 'lucide-react';

interface Props {
    material: any;
}

export default function Show({ material }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const getMediaMeta = (url: string) => {
        if (!url) return { type: null, embedUrl: null, icon: <FileCode className="size-6" /> };
        
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            let videoId = '';
            if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
            else if (url.includes('shorts/')) videoId = url.split('shorts/')[1].split('?')[0];
            else videoId = url.split('/').pop()?.split('?')[0] || '';
            
            return { 
                type: 'YouTube Video', 
                embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
                icon: <Youtube className="size-6 text-red-500" />
            };
        }
        
        if (url.includes('drive.google.com')) {
            const isFolder = url.includes('folders');
            if (url.includes('/file/d/')) {
                const driveId = url.split('/d/')[1].split('/')[0];
                return { 
                    type: 'Google Drive File', 
                    embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
                    icon: <Share2 className="size-6 text-blue-500" />
                };
            }
            return { 
                type: 'Google Drive Folder', 
                embedUrl: url,
                icon: <Share2 className="size-6 text-emerald-500" /> 
            };
        }
        
        return { 
            type: 'Tautan Luar', 
            embedUrl: url,
            icon: <Globe className="size-6 text-neutral-400" /> 
        };
    };

    const media = getMediaMeta(material.content || '');

    return (
        <div className="p-6 md:p-10 space-y-10 bg-neutral-50/50 dark:bg-neutral-950/50 min-h-screen font-sans">
            <Head title={`${material.title} - LMS`} />

            {/* HEADER & NAVIGATION */}
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                <Link 
                    href="/teacher/classrooms" 
                    className="group inline-flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] hover:text-emerald-600 transition-all"
                >
                    <div className="p-2 rounded-xl group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-colors">
                        <ChevronLeft className="size-4" />
                    </div>
                    Kembali ke Dashboard
                </Link>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200">
                            {material.type}
                        </span>
                        <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-bold uppercase tracking-widest bg-white dark:bg-neutral-900 px-4 py-1.5 rounded-full border border-neutral-200">
                            <Calendar className="size-3 text-emerald-500" /> 
                            Dibuat: {formatDate(material.created_at)}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter leading-none">
                        {material.title}
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white dark:bg-neutral-900 rounded-[3rem] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-2xl shadow-neutral-200/40">
                        
                        {/* MEDIA DISPLAY LOGIC */}
                        {media.type === 'YouTube Video' && (
                            <div className="aspect-video w-full bg-black">
                                <iframe className="w-full h-full" src={media.embedUrl} frameBorder="0" allowFullScreen />
                            </div>
                        )}

                        {media.type === 'Google Drive File' && (
                            <div className="aspect-video w-full">
                                <iframe src={media.embedUrl} className="w-full h-full" frameBorder="0" allowFullScreen />
                            </div>
                        )}

                        {material.type === 'file' && material.file_path && (
                            <div className="flex flex-col border-b border-neutral-100">
                                {material.file_path.toLowerCase().endsWith('.pdf') ? (
                                    <div className="w-full h-[600px]">
                                        <iframe src={`/storage/${material.file_path}#toolbar=0`} className="w-full h-full" />
                                    </div>
                                ) : (
                                    <div className="p-16 text-center bg-emerald-50/30">
                                        <FileUp className="size-20 mx-auto text-emerald-600 mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Berkas Dokumen</p>
                                    </div>
                                )}
                                <div className="p-10 text-center">
                                    <a href={`/storage/${material.file_path}`} download className="inline-flex items-center gap-4 px-10 py-5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 shadow-xl">
                                        <Download className="size-5" /> Download Berkas
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* CONTENT DESCRIPTION */}
                        <div className="p-8 md:p-16 space-y-12">
                            <article className="prose prose-neutral dark:prose-invert max-w-none">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-2 h-8 bg-emerald-600 rounded-full" />
                                    <h2 className="text-neutral-900 dark:text-white font-black uppercase tracking-widest text-xl m-0">Deskripsi</h2>
                                </div>
                                
                                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-8 rounded-[2.5rem] border border-neutral-100">
                                    {/* PERBAIKAN: Render HTML Deskripsi agar bisa baca bold/italic/list */}
                                    <div 
                                        className="text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed m-0 font-medium italic prose-sm dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: material.description || 'Tidak ada deskripsi instruksi.' }}
                                    />
                                </div>

                                {material.type === 'text' && material.content && (
                                    <div className="mt-16 space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-8 bg-emerald-600 rounded-full" />
                                            <h2 className="text-neutral-900 dark:text-white font-black uppercase tracking-widest text-xl m-0">Isi Materi</h2>
                                        </div>
                                        {/* PERBAIKAN: Render HTML Isi Materi agar gambar CKEditor muncul */}
                                        <div 
                                            className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-lg prose prose-neutral dark:prose-invert max-w-none 
                                            [&_img]:rounded-[2rem] [&_img]:shadow-xl [&_img]:my-8 [&_figure]:my-8"
                                            dangerouslySetInnerHTML={{ __html: material.content }} 
                                        />
                                    </div>
                                )}
                            </article>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR (INFO MATERI) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-neutral-900 p-8 rounded-[3rem] border border-neutral-200 dark:border-neutral-800 sticky top-10 shadow-sm">
                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                            <Layout className="size-3 text-emerald-600" /> Info Materi
                        </h4>
                        
                        <div className="space-y-6">
                            {/* Waktu Terakhir Update */}
                            <div className="flex items-center gap-5 p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-800/50 border border-transparent hover:border-emerald-500/20 transition-all group">
                                <div className="p-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm text-neutral-400 group-hover:text-emerald-600 transition-colors">
                                    <Clock className="size-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-tighter">Terakhir Update</p>
                                    <p className="text-sm font-black text-neutral-900 dark:text-white uppercase leading-none mt-1">{formatDate(material.updated_at)}</p>
                                </div>
                            </div>

                            {/* Jenis / Platform Sumber */}
                            <div className="flex items-center gap-5 p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-800/50 border border-transparent hover:border-emerald-500/20 transition-all group">
                                <div className="p-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm text-neutral-400 group-hover:text-emerald-600 transition-colors">
                                    {material.file_path ? <FileUp className="size-6 text-emerald-600" /> : media.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-tighter">Platform Sumber</p>
                                    <p className="text-sm font-black text-neutral-900 dark:text-white uppercase leading-none mt-1">
                                        {material.file_path ? 'Upload Berkas' : (media.type || 'Input Teks')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tombol Aksi Tambahan jika tipe tautan */}
                        {media.type && !material.file_path && (
                            <div className="mt-8 pt-8 border-t border-neutral-100">
                                <a 
                                    href={material.content} 
                                    target="_blank" 
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                                >
                                    <ExternalLink className="size-4" /> Buka Sumber Asli
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

Show.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/teacher/classrooms' }, { title: 'Materi', href: '#' }]}>
        {page}
    </AppLayout>
);