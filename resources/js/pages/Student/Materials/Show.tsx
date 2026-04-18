import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Download, 
    FileUp, 
    Clock,
    Calendar,
    PlayCircle,
    Layout,
    ArrowLeft,
    CheckCircle2,
    Lock,
    Link as LinkIcon,
    ArrowRight,
    Video
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

interface Props {
    material: any;
    is_completed: boolean; 
}

export default function Show({ material, is_completed }: Props) {
    const [completed, setCompleted] = useState(is_completed);
    const playerRef = useRef<any>(null);

    const markAsComplete = () => {
        if (completed) return;
        
        router.post(`/student/materials/${material.id}/complete`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setCompleted(true);
                Swal.fire({
                    title: 'MATERI SELESAI!',
                    text: 'Gembok materi berikutnya telah terbuka.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#171717',
                    color: '#ffffff'
                });
            },
        });
    };

    // YouTube Progress Tracker
    useEffect(() => {
        if (material.type === 'video' && !completed) {
            if (!(window as any).YT) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            }

            (window as any).onYouTubeIframeAPIReady = () => {
                const mediaMeta = getMediaMeta(material.content);
                if (mediaMeta.videoId) {
                    playerRef.current = new (window as any).YT.Player('youtube-player', {
                        videoId: mediaMeta.videoId,
                        events: {
                            'onStateChange': (event: any) => {
                                if (event.data === 0) { // YT.PlayerState.ENDED
                                    markAsComplete();
                                }
                            }
                        }
                    });
                }
            };
        }
    }, [material]);

    const getMediaMeta = (url: string | null) => {
        if (!url) return { type: null, embedUrl: "", videoId: null };
        
        const cleanUrl = url.replace(/<[^>]*>?/gm, '').trim();

        if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
            let videoId = '';
            if (cleanUrl.includes('v=')) videoId = cleanUrl.split('v=')[1].split('&')[0];
            else if (cleanUrl.includes('shorts/')) videoId = cleanUrl.split('shorts/')[1].split('?')[0];
            else videoId = cleanUrl.split('/').pop()?.split('?')[0] || '';
            return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`, videoId };
        }
        return { type: 'link', embedUrl: cleanUrl, videoId: null };
    };

    const media = getMediaMeta(material.content || '');
    const isGoogleMeet = material.type === 'link' && material.content?.includes('meet.google.com');

    return (
        <div className="p-6 md:p-10 space-y-10 bg-[#f8fafc] dark:bg-[#050505] min-h-screen">
            <Head title={material.title} />

            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                <Link 
                    href={`/student/classrooms/${material.subject_assignment_id}`} 
                    className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-emerald-600 transition-all"
                >
                    <ArrowLeft className="size-3 group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Ruang Belajar
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                                {isGoogleMeet ? 'Live Class' : material.type}
                            </span>
                            {completed ? (
                                <span className="px-4 py-1.5 bg-blue-100 text-blue-600 dark:bg-blue-500/10 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle2 className="size-3" /> Selesai Dipelajari
                                </span>
                            ) : (
                                <span className="px-4 py-1.5 bg-amber-100 text-amber-600 dark:bg-amber-500/10 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <Clock className="size-3" /> Wajib Dipelajari
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white uppercase tracking-tight leading-none">
                            {material.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white dark:bg-neutral-900 rounded-[3rem] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                        
                        {/* VIEW: VIDEO (YOUTUBE) */}
                        {media.type === 'youtube' && (
                            <div className="aspect-video w-full bg-black relative">
                                <div id="youtube-player" className="w-full h-full"></div>
                                {!completed && (
                                    <div className="absolute top-4 right-4 z-20 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Lock className="size-3" /> Tonton sampai habis untuk selesai
                                    </div>
                                )}
                            </div>
                        )}

                        {/* VIEW: GOOGLE MEET SESSION */}
                        {isGoogleMeet ? (
                            <div className="p-8 md:p-20 text-center bg-blue-50/30 dark:bg-blue-500/5 border-b border-neutral-200 dark:border-neutral-800 space-y-8">
                                <div className="relative inline-flex">
                                    <div className="absolute inset-0 rounded-[2.5rem] bg-blue-400 animate-ping opacity-20"></div>
                                    <div className="relative inline-flex p-10 bg-blue-600 text-white rounded-[2.5rem] shadow-2xl">
                                        <Video className="size-16" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 px-4 py-1.5 bg-red-600 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                                        Live
                                    </div>
                                </div>
                                <div className="max-w-md mx-auto space-y-3">
                                    <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Sesi Tatap Muka</h3>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
                                        Guru telah menjadwalkan pertemuan via Google Meet. Klik tombol di bawah untuk bergabung ke kelas.
                                    </p>
                                </div>
                                <a 
                                    href={media.embedUrl || ""} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={markAsComplete}
                                    className="inline-flex items-center gap-4 px-12 py-6 bg-blue-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl active:scale-95"
                                >
                                    Gabung Google Meet <ArrowRight className="size-5" />
                                </a>
                            </div>
                        ) : material.type === 'link' && (
                            /* VIEW: LINK (EKSTERNAL BIASA) */
                            <div className="p-16 text-center bg-blue-50/30 dark:bg-blue-500/5 border-b border-neutral-200 dark:border-neutral-800 space-y-6">
                                <div className="inline-flex p-8 bg-blue-600 text-white rounded-[2rem] shadow-xl">
                                    <LinkIcon className="size-12" />
                                </div>
                                <div className="max-w-md mx-auto space-y-2">
                                    <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Tautan Eksternal</h3>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
                                        Klik tombol di bawah untuk membuka referensi materi tambahan.
                                    </p>
                                </div>
                                <a 
                                    href={media.embedUrl || ""} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={markAsComplete}
                                    className="inline-flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                                >
                                    Buka Materi Eksternal <ArrowRight className="size-5" />
                                </a>
                            </div>
                        )}

                        {/* VIEW: FILE (PDF PREVIEW & DOWNLOAD) */}
                        {material.type === 'file' && (
                            <div className="flex flex-col">
                                {material.file_path?.toLowerCase().endsWith('.pdf') ? (
                                    <div className="w-full h-[600px] bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
                                        <iframe
                                            src={`/storage/${material.file_path}#toolbar=0`}
                                            className="w-full h-full"
                                            title="PDF Preview"
                                        />
                                    </div>
                                ) : (
                                    <div className="p-16 text-center bg-emerald-50/30 dark:bg-emerald-500/5 border-b border-neutral-200 dark:border-neutral-800">
                                        <div className="inline-flex p-10 bg-emerald-600 text-white rounded-[2.5rem] shadow-xl mb-6">
                                            <FileUp className="size-16" />
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 md:p-12 text-center space-y-6">
                                    <div className="max-w-md mx-auto space-y-2">
                                        <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Lampiran Berkas</h3>
                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
                                            Buka atau unduh file di bawah. Materi akan otomatis ditandai "Selesai" setelah Anda mengakses berkas ini.
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <a 
                                            href={`/storage/${material.file_path}` || ""} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            onClick={markAsComplete}
                                            className="flex items-center gap-4 px-10 py-5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all w-full sm:w-auto justify-center shadow-lg"
                                        >
                                            <Download className="size-5" /> Download dan Buka Materi
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CONTENT AREA: INSTRUCTIONS & TEXT */}
                        <div className="p-8 md:p-16 space-y-12">
                            <article className="prose prose-neutral dark:prose-invert max-w-none">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-2 h-8 bg-emerald-600 rounded-full" />
                                    <h2 className="text-neutral-900 dark:text-white font-black uppercase tracking-widest text-xl m-0">DESKRIPSI MATERI</h2>
                                </div>
                                <div className="bg-neutral-50 dark:bg-neutral-800/40 p-8 rounded-[2rem] border border-neutral-100 dark:border-neutral-800">
                                    <p className="text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed m-0 font-medium italic">
                                        {material.description ? material.description.replace(/<[^>]*>?/gm, '') : "Silakan pelajari materi yang telah disediakan oleh guru pengampu di atas."}
                                    </p>
                                </div>

                                {material.type === 'text' && (
                                    <div className="mt-8">
                                        <div 
                                            className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-lg ck-content"
                                            dangerouslySetInnerHTML={{ __html: material.content }}
                                        />
                                        {!completed && (
                                            <button 
                                                onClick={markAsComplete}
                                                className="mt-10 w-full py-6 border-2 border-dashed border-emerald-600 text-emerald-600 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
                                            >
                                                Konfirmasi: Saya Sudah Selesai Membaca
                                            </button>
                                        )}
                                    </div>
                                )}
                            </article>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR STATUS */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 sticky top-10 shadow-sm">
                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-8 flex items-center gap-2 leading-none">
                            <Layout className="size-3 text-emerald-600" /> Status Progress
                        </h4>
                        
                        {completed ? (
                            <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 rounded-[2rem] border border-emerald-100 dark:border-emerald-500/20 text-center">
                                <div className="size-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="size-6" />
                                </div>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-tight">Materi Selesai</p>
                                <p className="text-[9px] font-bold text-neutral-400 uppercase mt-2">Anda dapat melanjutkan ke materi berikutnya.</p>
                            </div>
                        ) : (
                            <div className="p-6 bg-amber-50 dark:bg-amber-500/10 rounded-[2rem] border border-amber-100 dark:border-amber-500/20 text-center">
                                <div className="size-12 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <Lock className="size-6" />
                                </div>
                                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-tight">Sedang Berlangsung</p>
                                <p className="text-[9px] font-bold text-neutral-400 uppercase mt-2">Selesaikan aktivitas di samping untuk membuka akses lanjut.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

Show.layout = (page: any) => (
    <AppLayout breadcrumbs={[{ title: 'Belajar', href: '#' }]}>{page}</AppLayout>
);