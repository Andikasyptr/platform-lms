<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class NewContentNotification extends Notification
{
    use Queueable;

    protected $content;
    protected $type;

    public function __construct($content, $type)
    {
        $this->content = $content;
        $this->type = $type;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $isMateri = $this->type === 'materi';
        $subject = ($isMateri ? '[MATERI] ' : '[TUGAS] ') . $this->content->title;

        $message = (new MailMessage)
                    ->subject($subject)
                    ->greeting('Halo, ' . $notifiable->name)
                    ->line('Kami ingin menginformasikan bahwa pengajar Anda telah memperbarui konten pembelajaran pada platform **ClassYra**.');

        if ($isMateri) {
            $message->line('### 📖 Materi Baru Telah Tersedia')
                    ->line('**Judul:** ' . $this->content->title)
                    ->line('**Deskripsi:** ' . ($this->content->description ?? 'Silakan cek detail materi di dashboard.'))
                    ->action('Pelajari Materi Sekarang', url('/student/materials/' . $this->content->id));
        } else {
            // Format tanggal deadline agar lebih manusiawi (Contoh: 25 April 2026)
            $deadline = Carbon::parse($this->content->due_date)->translatedFormat('d F Y, H:i');

            $message->line('### 📝 Penugasan Baru Diterbitkan')
                    ->line('**Judul Tugas:** ' . $this->content->title)
                    ->line('**Batas Pengumpulan:** ' . $deadline . ' WIB')
                    ->line('**Poin Maksimal:** ' . $this->content->points . ' Poin')
                    ->action('Lihat Detail Tugas', url('/student/assignments/' . $this->content->id))
                    ->line('Mohon perhatikan batas waktu pengumpulan agar nilai Anda tetap optimal.');
        }

        return $message
                    ->line('Jika Anda mengalami kendala akses, silakan hubungi administrator sekolah.')
                    ->salutation('Salam Hangat,  ' . "\n" . 'Tim Akademik ClassYra');
    }
}