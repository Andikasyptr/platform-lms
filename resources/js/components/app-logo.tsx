import { GraduationCap } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            {/* Box Logo dengan Gradasi Premium */}
            <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20">
                <GraduationCap className="size-6 text-white" />
            </div>

            {/* Nama Brand & Subtitle */}
            <div className="ml-3 grid flex-1 text-left">
                <span className="font-display font-black leading-none tracking-tighter text-neutral-900 dark:text-white uppercase text-lg">
                    Class<span className="text-indigo-600">Yra</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400 dark:text-neutral-500 leading-tight">
                    Ekosistem Pendidikan Digital
                </span>
            </div>
        </>
    );
}