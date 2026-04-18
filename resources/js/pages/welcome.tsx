import { Head, Link } from '@inertiajs/react';
import { login, register } from '@/routes';
import { 
    LayoutDashboard, 
    Zap, 
    ShieldCheck, 
    ArrowRight,
    GraduationCap,
    Globe,
    Sparkles,
    MousePointer2,
    CheckCircle2
} from 'lucide-react';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    return (
        <div className="relative min-h-screen bg-white dark:bg-[#020203] overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
            <Head title="LMS" />

            {/* Premium Background Layer */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/10 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-violet-600/20 to-blue-400/10 blur-[120px] animate-bounce-slow" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            {/* Navbar Modern */}
            <nav className="fixed top-0 w-full z-50 bg-white/60 dark:bg-[#020203]/60 backdrop-blur-2xl border-b border-neutral-100 dark:border-neutral-800/50">
                <div className="flex items-center justify-between px-8 py-5 mx-auto max-w-7xl">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-110">
                            <GraduationCap className="text-white size-6" />
                        </div>
                        <span className="text-xl font-display font-black tracking-tighter text-neutral-900 dark:text-white uppercase">
                            Class<span className="text-indigo-600">yra</span>
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">
                            <a href="#features" className="hover:text-indigo-600 transition-colors">Fitur</a>
                            <a href="#about" className="hover:text-indigo-600 transition-colors">Ekosistem</a>
                            <a href="#" className="hover:text-indigo-600 transition-colors">Harga</a>
                        </div>
                        <div className="h-6 w-[1px] bg-neutral-200 dark:bg-neutral-800 hidden md:block" />
                        <div className="flex items-center gap-4">
                            <Link href={login()} className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-white hover:opacity-70 transition-opacity">
                                Masuk
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="rounded-full bg-indigo-600 px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all"
                                >
                                    Daftar Sekarang
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="px-6 pt-48 pb-24 mx-auto max-w-7xl lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 ring-1 ring-inset ring-indigo-600/30 bg-indigo-50/50 mb-10 dark:bg-indigo-500/10 dark:text-indigo-400 backdrop-blur-sm">
                        <Sparkles className="size-3" /> Dibangun untuk masa depan pendidikan
                    </div>
                    
                    <h1 className="text-6xl font-display font-[900] tracking-[-0.04em] text-neutral-900 sm:text-8xl dark:text-white leading-[0.85] mb-10">
                        TRANSFORMASI <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-500">
                            PINTAR BELAJAR.
                        </span>
                    </h1>
                    
                    <p className="mt-6 text-xl leading-relaxed text-neutral-500 max-w-3xl mx-auto dark:text-neutral-400 font-medium">
                        Platform Manajemen Pembelajaran all-in-one yang dirancang untuk mengoptimalkan potensi pengajar dan memberikan pengalaman belajar yang tak terlupakan bagi siswa.
                    </p>
                    
                    <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href={login()}
                            className="w-full sm:w-auto flex items-center justify-center gap-4 rounded-[2rem] bg-indigo-600 px-12 py-6 text-[12px] font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-indigo-500/40 hover:bg-indigo-700 hover:-translate-y-1.5 transition-all active:scale-95"
                        >
                            Mulai Sekarang <ArrowRight className="size-4" />
                        </Link>
                        <button className="flex items-center gap-3 px-8 py-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 text-[12px] font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-white/5 transition-all">
                            <MousePointer2 className="size-4" /> Lihat Demo
                        </button>
                    </div>
                </section>

                {/* Dashboard Showcase */}
                <section className="px-6 mx-auto max-w-7xl mb-40 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[150px] -z-10" />
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-[3.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                        <div className="relative p-3 rounded-[3.5rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
                            <div className="bg-neutral-50 dark:bg-[#08080a] rounded-[2.8rem] overflow-hidden aspect-[16/9] flex flex-col border border-neutral-100 dark:border-neutral-800">
                                <div className="px-8 py-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-3 bg-white dark:bg-[#08080a]">
                                    <div className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-md">
                                        <LayoutDashboard className="size-3.5 text-neutral-500" />
                                    </div>
                                    <span className="text-[11px] font-bold text-neutral-700 dark:text-white uppercase tracking-wider">Beranda utama</span>
                                </div>
                                <div className="flex-1 p-10 space-y-10 overflow-hidden bg-neutral-50/30 dark:bg-[#08080a]">
                                    <div className="space-y-1">
                                        <h3 className="text-3xl font-black tracking-tight dark:text-white">Statistik Akademik</h3>
                                        <p className="text-sm text-neutral-400 font-medium">Monitoring performa sekolah secara real-time.</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm relative group">
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity"><Globe className="size-20" /></div>
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-4 bg-indigo-500/10 rounded-2xl"><Globe className="size-6 text-indigo-600" /></div>
                                                <div className="px-3 py-1 bg-emerald-500/10 text-[10px] font-black text-emerald-600 rounded-full flex items-center gap-1.5 ring-1 ring-emerald-500/20">
                                                    <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" /> LIVE
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Total Guru</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-display font-black dark:text-white">39</span>
                                                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Personel</span>
                                            </div>
                                        </div>
                                        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm transition-transform hover:-translate-y-1">
                                            <div className="mb-6 p-4 bg-emerald-500/10 rounded-2xl w-fit"><CheckCircle2 className="size-6 text-emerald-600" /></div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Total Siswa</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-display font-black dark:text-white">532</span>
                                                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Terdaftar</span>
                                            </div>
                                        </div>
                                        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm transition-transform hover:-translate-y-1">
                                            <div className="mb-6 p-4 bg-amber-500/10 rounded-2xl w-fit"><GraduationCap className="size-6 text-amber-600" /></div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Kelas Aktif</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-display font-black dark:text-white">38</span>
                                                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Ruangan</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 p-12 rounded-[3.5rem] bg-gradient-to-br from-indigo-600 to-violet-700 text-white relative overflow-hidden group">
                                        <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:scale-110 transition-transform duration-1000"><GraduationCap className="size-[300px]" /></div>
                                        <div className="relative z-10 space-y-6 max-w-2xl">
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md text-[10px] font-black text-white rounded-full uppercase tracking-widest"><Zap className="size-3 fill-white" /> Classyra V1.0</div>
                                            <h4 className="text-5xl font-display font-[900] leading-[0.9] tracking-tighter">Panel Kendali <br /><span className="text-indigo-200 uppercase">Administrator.</span></h4>
                                            <p className="text-indigo-100 text-lg leading-relaxed font-medium opacity-90">Kelola seluruh ekosistem pembelajaran digital Anda dari satu tempat dengan performa maksimal.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="px-6 py-40 bg-neutral-900 dark:bg-[#020205] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-indigo-600/10 blur-[120px]" />
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
                            <div className="space-y-4 max-w-xl">
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Fitur Utama</h2>
                                <p className="text-6xl font-display font-black tracking-tighter text-white leading-[0.9]">TEKNOLOGI YANG <br />MEMBERDAYAKAN.</p>
                            </div>
                            <p className="text-neutral-400 font-medium max-w-xs italic border-l-2 border-indigo-500 pl-6">Kami percaya bahwa teknologi harus memudahkan, bukan mempersulit proses belajar mengajar.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 p-12 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 flex flex-col justify-between group hover:bg-white/10 transition-all duration-500">
                                <div>
                                    <div className="size-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white mb-10 shadow-2xl shadow-indigo-500/20"><LayoutDashboard className="size-8" /></div>
                                    <h3 className="text-4xl font-display font-black mb-6 text-white uppercase tracking-tight">Smart Dashboard</h3>
                                    <p className="text-neutral-400 text-xl leading-relaxed font-medium">Monitor seluruh aktivitas kelas, status pengumpulan tugas, dan performa siswa secara visual dalam satu pusat kendali yang intuitif.</p>
                                </div>
                                <div className="mt-12 flex gap-2">
                                    <div className="h-1.5 w-24 bg-indigo-500 rounded-full" />
                                    <div className="h-1.5 w-12 bg-white/10 rounded-full" />
                                    <div className="h-1.5 w-12 bg-white/10 rounded-full" />
                                </div>
                            </div>
                            <div className="p-12 bg-gradient-to-b from-indigo-600 to-violet-800 rounded-[3rem] text-white flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500 shadow-2xl">
                                <Zap className="size-12 mb-10 text-indigo-200" />
                                <div className="space-y-6">
                                    <h3 className="text-3xl font-display font-black uppercase tracking-tight leading-none">Penilaian <br />Otomatis.</h3>
                                    <p className="text-indigo-100 font-medium leading-relaxed opacity-80">Sistem penilaian terintegrasi yang memungkinkan feedback instan bagi siswa.</p>
                                    <div className="pt-4 flex justify-end">
                                        <div className="size-14 rounded-full bg-white text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer shadow-lg"><ArrowRight className="size-6" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Developer Section - THE ARCHITECT */}
                <section className="px-6 pt-32 pb-12 mx-auto max-w-7xl relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] -z-10" />
                    <div className="flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 ring-1 ring-indigo-600/30 bg-indigo-50/50 mb-16 dark:bg-indigo-500/10 dark:text-indigo-400 backdrop-blur-sm">
                            <Zap className="size-3 fill-current" /> Dibalik Layar ClassYra
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative flex flex-col md:flex-row items-center gap-12 p-8 md:p-16 rounded-[3rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl">
                                <div className="relative">
                                    <div className="size-48 md:size-64 rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-neutral-800 shadow-2xl transition-transform duration-700 group-hover:scale-105 group-hover:rotate-3">
                                        <img 
                                            src="/images/dev.jpeg" 
                                            alt="Muhammad Andika Anjas Syaputra, S.Kom., Gr" 
                                            className="size-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                        />
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 bg-indigo-600 text-white p-4 rounded-2xl shadow-xl shadow-indigo-500/40 animate-bounce-slow">
                                        <GraduationCap className="size-6" />
                                    </div>
                                </div>
                                <div className="text-center md:text-left space-y-6 max-w-sm">
                                    <div>
                                        <h2 className="text-4xl font-display font-[900] tracking-tighter text-neutral-900 dark:text-white uppercase leading-none mb-2">
                                            M. Andika Anjas  <br />
                                            <span className="text-indigo-600 text-3xl">Syaputra, S.Kom., Gr.</span>
                                        </h2>
                                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-400">Lead Software Architect</p>
                                    </div>
                                    <p className="text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed italic">
                                        "Membangun Classyra bukan sekadar menulis baris kode, tapi merancang masa depan di mana teknologi dan edukasi menyatu tanpa hambatan."
                                    </p>
                                    <div className="flex items-center justify-center md:justify-start gap-4">
                                        <div className="size-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                                            <Globe className="size-5" />
                                        </div>
                                        <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Classyra</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-[#020203] pt-24 pb-12 px-8 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
                        <div className="space-y-8 max-w-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-600 p-2 rounded-xl"><GraduationCap className="text-white size-6" /></div>
                                <span className="text-2xl font-display font-black tracking-tighter text-white uppercase">Class<span className="text-indigo-600">Yra</span></span>
                            </div>
                            <p className="text-neutral-500 font-medium leading-relaxed">Masa depan manajemen sekolah dimulai dari sini. Cepat, Pintar, dan Terintegrasi.</p>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-white/5 flex justify-between items-center">
                        <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.3em]">&copy; 2026 Classyra.</p>
                    </div>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-30px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 10s ease-in-out infinite;
                }
            `}} />
        </div>
    );
}