import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Pengaturan Tampilan" />

            <h1 className="sr-only">Pengaturan tampilan</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Tampilan"
                    description="Sesuaikan tema dan preferensi visual aplikasi Anda"
                />
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Tampilan',
            href: editAppearance(),
        },
    ],
};