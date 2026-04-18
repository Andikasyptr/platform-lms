import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import AppLogo from '@/components/app-logo';
import { GraduationCap, Sparkles } from 'lucide-react';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen bg-white dark:bg-[#020203]">
            {/* KIRI: Branding Section (Hidden on Mobile) */}
            <div className="relative hidden lg:flex lg:w-1/2 flex-col items-center justify-center overflow-hidden bg-neutral-900 dark:bg-[#050505]">
                {/* Background Glow Premium */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full bg-indigo-600/20 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-violet-600/20 blur-[120px]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center p-12">
                    <Link href={home()} className="mb-12 transition-transform hover:scale-110 duration-500">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-[2.5rem] shadow-2xl shadow-indigo-500/40">
                            <GraduationCap className="text-white size-20" />
                        </div>
                    </Link>
                    
                    <h2 className="text-5xl font-display font-black tracking-tighter text-white uppercase leading-[0.9] mb-6">
                        Class<span className="text-indigo-500">yra</span> <br />
                        <span className="text-2xl text-neutral-400">EKOSISTEM PENDIDIKAN DIGITAL.</span>
                    </h2>
                    
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ring-1 ring-indigo-500/30 bg-indigo-500/5 backdrop-blur-md">
                        <Sparkles className="size-3" /> Revolusi Pembelajaran dimulai
                    </div>
                </div>

                {/* Footer di sisi kiri */}
                <div className="absolute bottom-10 left-10 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                    &copy; 2026 Classyra ALL RIGHTS RESERVED
                </div>
            </div>

            {/* KANAN: Form Section */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8 md:p-12 relative">
                {/* Mobile-only Logo (Muncul kalau layar kecil) */}
                <div className="lg:hidden absolute top-8 left-1/2 -translate-x-1/2">
                    {/* <AppLogo /> */}
                </div>

                <div className="w-full max-w-[400px]">
                    <div className="flex flex-col gap-10">
                        {/* Header Form */}
                        <div className="space-y-3">
                            <h1 className="text-4xl font-display font-[900] tracking-tight text-neutral-900 dark:text-white uppercase leading-none">
                                {title}
                            </h1>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed max-w-[320px]">
                                {description}
                            </p>
                            <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                        </div>

                        {/* Area Children (Form) */}
                        <div className="relative">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}