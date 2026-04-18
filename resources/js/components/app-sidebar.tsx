import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar, // Import hook untuk kontrol state
} from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, 
    GraduationCap, 
    Presentation, 
    Book, 
    Calendar1Icon, 
    School,
    UserCheck, 
    LayoutDashboard
} from 'lucide-react';

export function AppSidebar() {
    const page = usePage();
    const { setOpenMobile, isMobile } = useSidebar();
    const auth = (page.props as any).auth;
    const userRole = auth?.user?.role;

    // Fungsi untuk menutup sidebar otomatis saat navigasi di mobile
    const handleLinkClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    const dashboardUrl = userRole === 'admin' ? '/admin/dashboard' : 
                         userRole === 'teacher' ? '/teacher/dashboard' : 
                         '/student/dashboard';

    const mainNavItems: any[] = [
        {
            title: 'Beranda Utama',
            href: dashboardUrl,
            icon: LayoutDashboard,
        },
    ];

    // Role-based navigation items
    if (userRole === 'admin') {
        mainNavItems.push(
            { title: 'Data Tenaga Pengajar', href: '/admin/users/teachers', icon: Presentation },
            { title: 'Manajemen Ruang Kelas', href: '/admin/classrooms', icon: School },
            { title: 'Data Seluruh Siswa', href: '/admin/users/students', icon: GraduationCap },
            { title: 'Katalog Mata Pelajaran', href: '/admin/subjects', icon: Book },
            { title: 'Agenda & Penjadwalan', href: '/admin/assignments', icon: Calendar1Icon },
        );
    } else if (userRole === 'teacher') {
        mainNavItems.push(
            { title: 'Daftar Kelas Saya', href: '/teacher/classrooms', icon: Presentation },
            { title: 'Persetujuan Registrasi', href: '/teacher/enrollments', icon: UserCheck }
        );
    } else if (userRole === 'student') {
        mainNavItems.push(
            { title: 'Ruang Belajar Saya', href: '/student/my-classrooms', icon: Presentation },
            { title: 'Eksplorasi Kelas', href: '/student/classrooms', icon: BookOpen }
        );
    }

    return (
        <Sidebar collapsible="icon" variant="inset" className="transition-all duration-300">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} onClick={handleLinkClick} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Kirim handler klik ke NavMain */}
                <NavMain items={mainNavItems} onItemClick={handleLinkClick} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}