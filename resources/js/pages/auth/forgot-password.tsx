// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Lupa Kata Sandi" />

            {status && (
                <div className="mb-4 text-center text-sm font-bold uppercase tracking-widest text-emerald-600 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label 
                                    htmlFor="email" 
                                    className="text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
                                >
                                    Alamat Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="nama@example.com"
                                    className="rounded-xl border-neutral-200 dark:border-neutral-800 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="my-6">
                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {processing ? 'Mengirim...' : 'Kirim Link Reset Sandi'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="text-center text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                    <span>Atau, kembali ke halaman</span>{' '}
                    <TextLink href={login()} className="text-indigo-600 hover:text-indigo-700 transition-colors">
                        Masuk
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Lupa Kata Sandi?',
    description: 'Jangan khawatir, masukkan email Anda dan kami akan mengirimkan instruksi pemulihan.',
};