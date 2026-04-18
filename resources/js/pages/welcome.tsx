import { Head, Link } from '@inertiajs/react';
import { login, register } from '@/routes';
import { useState } from 'react'; // Tambahkan useState untuk menu mobile
import { 
    LayoutDashboard, 
    Zap, 
    User, // Icon User untuk Guru
    ShieldCheck, 
    ArrowRight,
    GraduationCap,
    Globe,
    Sparkles,
    MousePointer2,
    CheckCircle2,
    Menu, // Icon Menu
    X // Icon Close
} from 'lucide-react';

// UPDATE: Tambahkan interface untuk menerima data dari database
interface WelcomeProps {
    canRegister?: boolean;
    totalTeachers: number;
    totalStudents: number;
    totalActiveClasses: number;
}

export default function Welcome({ 
    canRegister = true,
    totalTeachers = 0,     // Default value jika data belum ada
    totalStudents = 0,     // Default value jika data belum ada
    totalActiveClasses = 0 // Default value jika data belum ada
}: WelcomeProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="relative min-h-screen bg-white dark:bg-[#020203] overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white">
            <Head title="LMS" />

            {/* Premium Background Layer */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-5%] left-[-10%] w-[100%] md:w-[70%] h-[50%] md:h-[70%] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/10 blur-[80px] md:blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-5%] right-[-10%] w-[100%] md:w-[60%] h-[50%] md:h-[60%] rounded-full bg-gradient-to-tr from-violet-600/20 to-blue-400/10 blur-[80px] md:blur-[120px] animate-bounce-slow" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            {/* Navbar Modern - Responsive Fix */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#020203]/70 backdrop-blur-2xl border-b border-neutral-100 dark:border-neutral-800/50">
                <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-5 mx-auto max-w-7xl">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg transition-transform group-hover:scale-110">
                            <GraduationCap className="text-white size-5 md:size-6" />
                        </div>
                        <span className="text-lg md:text-xl font-display font-black tracking-tighter text-neutral-900 dark:text-white uppercase">
                            Class<span className="text-indigo-600">yra</span>
                        </span>
                    </div>
                    
                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Fitur</a>
                        <a href="#about" className="hover:text-indigo-600 transition-colors">Ekosistem</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Harga</a>
                    </div>
                    
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="hidden md:flex items-center gap-4">
                            <Link href={login()} className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-white hover:opacity-70">
                                Masuk
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="rounded-full bg-indigo-600 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all"
                                >
                                    Daftar
                                </Link>
                            )}
                        </div>
                        
                        {/* Mobile Toggle Button */}
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#020203] border-b border-neutral-200 dark:border-neutral-800 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
                        <div className="flex flex-col gap-4 text-[12px] font-black uppercase tracking-widest text-neutral-500">
                            <a href="#features" onClick={() => setIsMenuOpen(false)}>Fitur</a>
                            <a href="#about" onClick={() => setIsMenuOpen(false)}>Ekosistem</a>
                            <a href="#" onClick={() => setIsMenuOpen(false)}>Harga</a>
                        </div>
                        <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <Link href={login()} className="w-full text-center py-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-[11px] font-black uppercase tracking-widest">
                                Masuk
                            </Link>
                            <Link href={register()} className="w-full text-center py-4 rounded-xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest">
                                Daftar Sekarang
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            <main className="relative z-10">
                {/* Hero Section - Font Size Fix */}
                <section className="px-6 pt-32 md:pt-48 pb-20 mx-auto max-w-7xl lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 md:px-5 md:py-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 ring-1 ring-inset ring-indigo-600/30 bg-indigo-50/50 mb-8 md:mb-10 dark:bg-indigo-500/10 dark:text-indigo-400 backdrop-blur-sm">
                        <Sparkles className="size-3" /> <span className="truncate">Dibangun untuk masa depan pendidikan</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-6xl lg:text-8xl font-display font-[900] tracking-[-0.04em] text-neutral-900 dark:text-white leading-[1.1] md:leading-[0.85] mb-8 md:mb-10 uppercase">
                        TRANSFORMASI <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-500">
                            PINTAR BELAJAR.
                        </span>
                    </h1>
                    
                    <p className="mt-6 text-base md:text-xl leading-relaxed text-neutral-500 max-w-3xl mx-auto dark:text-neutral-400 font-medium px-2">
                        Platform Manajemen Pembelajaran all-in-one yang dirancang untuk mengoptimalkan potensi pengajar dan memberikan pengalaman belajar yang tak terlupakan bagi siswa.
                    </p>
                    
                    <div className="mt-10 md:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4">
                        <Link
                            href={login()}
                            className="w-full sm:w-auto flex items-center justify-center gap-4 rounded-2xl md:rounded-[2rem] bg-indigo-600 px-10 py-5 md:px-12 md:py-6 text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-indigo-500/40 hover:bg-indigo-700 hover:-translate-y-1.5 transition-all active:scale-95"
                        >
                            Mulai Sekarang <ArrowRight className="size-4" />
                        </Link>
                        <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 md:px-8 md:py-6 rounded-2xl md:rounded-[2rem] border border-neutral-200 dark:border-neutral-800 text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-white/5 transition-all">
                            <MousePointer2 className="size-4" /> Lihat Demo
                        </button>
                    </div>
                </section>

                {/* Dashboard Showcase - Responsive Grid Fix */}
                <section className="px-4 md:px-6 mx-auto max-w-7xl mb-24 md:mb-40 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[150px] -z-10" />
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-3xl md:rounded-[3.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                        <div className="relative p-2 md:p-3 rounded-3xl md:rounded-[3.5rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
                            <div className="bg-neutral-50 dark:bg-[#08080a] rounded-2xl md:rounded-[2.8rem] overflow-hidden flex flex-col border border-neutral-100 dark:border-neutral-800">
                                <div className="px-6 py-4 md:px-8 md:py-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-3 bg-white dark:bg-[#08080a]">
                                    <div className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-md">
                                        <LayoutDashboard className="size-3.5 text-neutral-500" />
                                    </div>
                                    <span className="text-[10px] md:text-[11px] font-bold text-neutral-700 dark:text-white uppercase tracking-wider">Beranda utama</span>
                                </div>
                                <div className="flex-1 p-6 md:p-10 space-y-8 md:space-y-10 overflow-hidden bg-neutral-50/30 dark:bg-[#08080a]">
                                    <div className="space-y-1">
                                        <h3 className="text-xl md:text-3xl font-black tracking-tight dark:text-white">Statistik Akademik</h3>
                                        <p className="text-xs md:text-sm text-neutral-400 font-medium">Monitoring performa sekolah secara real-time.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                        {/* Total Guru - Icon DIGANTI ke User */}
                                        <div className="p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm relative group">
                                            <div className="flex justify-between items-start mb-4 md:mb-6">
                                                <div className="p-3 md:p-4 bg-indigo-500/10 rounded-2xl"><User className="size-5 md:size-6 text-indigo-600" /></div>
                                                <div className="px-3 py-1 bg-emerald-500/10 text-[8px] md:text-[10px] font-black text-emerald-600 rounded-full flex items-center gap-1.5 ring-1 ring-emerald-500/20">
                                                    LIVE
                                                </div>
                                            </div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Total Guru</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl md:text-5xl font-display font-black dark:text-white">
                                                    {totalTeachers}
                                                </span>
                                                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Personel</span>
                                            </div>
                                        </div>
                                        {/* Total Siswa - Icon Pakai GraduationCap */}
                                        <div className="p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm">
                                            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-emerald-500/10 rounded-2xl w-fit"><GraduationCap className="size-5 md:size-6 text-emerald-600" /></div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Total Siswa</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl md:text-5xl font-display font-black dark:text-white">
                                                    {totalStudents}
                                                </span>
                                                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Siswa</span>
                                            </div>
                                        </div>
                                        {/* Kelas Aktif - Icon Pakai CheckCircle2 atau ShieldCheck */}
                                        <div className="p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 shadow-sm">
                                            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-amber-500/10 rounded-2xl w-fit"><CheckCircle2 className="size-5 md:size-6 text-amber-600" /></div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Kelas Aktif</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl md:text-5xl font-display font-black dark:text-white">
                                                    {totalActiveClasses}
                                                </span>
                                                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Ruangan</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Admin Banner - Responsive Font */}
                                    <div className="p-8 md:p-12 rounded-3xl md:rounded-[3.5rem] bg-gradient-to-br from-indigo-600 to-violet-700 text-white relative overflow-hidden group">
                                        <div className="relative z-10 space-y-4 md:space-y-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md text-[9px] font-black text-white rounded-full uppercase tracking-widest"><Zap className="size-3 fill-white" /> Classyra V1.0</div>
                                            <h4 className="text-3xl md:text-5xl font-display font-[900] leading-none tracking-tighter uppercase">Panel Kendali <br /><span className="text-indigo-200 uppercase">Administrator.</span></h4>
                                            <p className="text-indigo-100 text-sm md:text-lg leading-relaxed font-medium opacity-90 max-w-md">Kelola seluruh ekosistem pembelajaran digital Anda dari satu tempat.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section - Grid Responsive */}
                <section id="features" className="px-6 py-20 md:py-40 bg-neutral-900 dark:bg-[#020205] relative overflow-hidden">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mb-16 md:mb-24">
                            <div className="space-y-4 max-w-xl">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Fitur Utama</h2>
                                <p className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white leading-none uppercase">TEKNOLOGI <br className="hidden md:block" /> PINTAR.</p>
                            </div>
                            <p className="text-neutral-400 text-sm md:text-base font-medium max-w-xs italic border-l-2 border-indigo-500 pl-6">Membangun ekosistem belajar yang memudahkan interaksi.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            <div className="md:col-span-2 p-8 md:p-12 bg-white/5 backdrop-blur-xl rounded-3xl md:rounded-[3rem] border border-white/10 flex flex-col justify-between group">
                                <div>
                                    <div className="size-12 md:size-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white mb-8 md:mb-10"><LayoutDashboard className="size-6 md:size-8" /></div>
                                    <h3 className="text-2xl md:text-4xl font-display font-black mb-4 md:mb-6 text-white uppercase tracking-tight">Smart Dashboard</h3>
                                    <p className="text-neutral-400 text-base md:text-xl leading-relaxed font-medium">Monitor seluruh aktivitas kelas dan performa siswa secara visual dalam satu pusat kendali yang intuitif.</p>
                                </div>
                            </div>
                            <div className="p-8 md:p-12 bg-gradient-to-b from-indigo-600 to-violet-800 rounded-3xl md:rounded-[3rem] text-white flex flex-col justify-between shadow-2xl">
                                <Zap className="size-10 md:size-12 mb-8 md:mb-10 text-indigo-200" />
                                <div className="space-y-4">
                                    <h3 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight leading-none">Penilaian <br />Otomatis.</h3>
                                    <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-80">Sistem penilaian instan untuk efisiensi pengajar.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Developer Section - Layout Responsive */}
                <section className="px-6 py-20 md:py-32 mx-auto max-w-7xl relative overflow-hidden">
                    <div className="flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 ring-1 ring-indigo-600/30 bg-indigo-50/50 mb-12 md:mb-16 dark:bg-indigo-500/10 dark:text-indigo-400 backdrop-blur-sm">
                            <Zap className="size-3 fill-current" /> Dibalik Layar ClassYra
                        </div>
                        <div className="relative group w-full max-w-4xl">
                            <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-3xl md:rounded-[3rem] blur opacity-20 transition duration-1000"></div>
                            <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 md:p-16 rounded-3xl md:rounded-[3rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl">
                                <div className="relative shrink-0">
                                    <div className="size-40 md:size-64 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-neutral-800 shadow-2xl transition-transform duration-700">
                                        <img 
                                            src="/images/dev.jpeg" 
                                            alt="M. Andika Anjas Syaputra" 
                                            className="size-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 bg-indigo-600 text-white p-3 md:p-4 rounded-xl shadow-xl shadow-indigo-500/40">
                                        <GraduationCap className="size-5 md:size-6" />
                                    </div>
                                </div>
                                <div className="text-center md:text-left space-y-4 md:space-y-6">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl md:text-4xl font-display font-[900] tracking-tighter text-neutral-900 dark:text-white uppercase leading-none">
                                            M. Andika Anjas  <br className="md:hidden" />
                                            <span className="text-indigo-600 text-xl md:text-3xl">Syaputra, S.Kom.</span>
                                        </h2>
                                        <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-neutral-400">Lead Software Architect</p>
                                    </div>
                                    <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base font-medium leading-relaxed italic px-2 md:px-0">
                                        "Membangun Classyra bukan sekadar menulis baris kode, tapi merancang masa depan pendidikan yang lebih inklusif."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - Center on mobile */}
            <footer className="bg-[#020203] py-16 px-8 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-xl"><GraduationCap className="text-white size-5" /></div>
                        <span className="text-xl font-display font-black tracking-tighter text-white uppercase">Class<span className="text-indigo-600">Yra</span></span>
                    </div>
                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.3em]">&copy; 2026 Classyra.</p>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 10s ease-in-out infinite;
                }
            `}} />
        </div>
    );
}