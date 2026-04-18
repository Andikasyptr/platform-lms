import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type Props = {
    user: User;
    onItemClick?: () => void; // Tambahkan prop ini
};

export function UserMenuContent({ user, onItemClick }: Props) {
    const cleanup = useMobileNavigation();

    // Fungsi gabungan untuk handle klik navigasi
    const handleNavigationClick = () => {
        cleanup(); // Logic mobile internal bawaan
        if (onItemClick) onItemClick(); // Logic tutup sidebar kita
    };

    const handleLogout = () => {
        cleanup();
        router.flushAll();
        // Logout biasanya langsung redirect, jadi tidak perlu onItemClick
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={handleNavigationClick} // Gunakan handler gabungan
                    >
                        <Settings className="mr-2 inline-block size-4" />
                        Pengaturan Profil
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                    href={logout()}
                    method="post"
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2 inline-block size-4" />
                    Keluar Aplikasi
                </Link>
            </DropdownMenuItem>
        </>
    );
}