import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <>
            <Head title="Daftar Akun" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Masukkan nama lengkap"
                                    className="rounded-xl border-neutral-200 dark:border-neutral-800 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="nama@email.com"
                                    className="rounded-xl border-neutral-200 dark:border-neutral-800 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Kata Sandi</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="rounded-xl border-neutral-200 dark:border-neutral-800 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Konfirmasi Kata Sandi</Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="••••••••"
                                    className="rounded-xl border-neutral-200 dark:border-neutral-800 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner className="mr-2 h-4 w-4" />}
                                {processing ? 'Mendaftarkan...' : 'Buat Akun Sekarang'}
                            </Button>
                        </div>

                        <div className="text-center text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                            Sudah punya akun?{' '}
                            <TextLink href={login()} tabIndex={6} className="text-indigo-600 hover:text-indigo-700 transition-colors">
                                Masuk
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

// Properti title & description akan muncul di bawah AppLogo dalam AuthSimpleLayout
Register.layout = {
    title: 'Registrasi Akun',
    description: 'Gabung dengan ribuan pengajar dan siswa di ekosistem digital kami.',
};