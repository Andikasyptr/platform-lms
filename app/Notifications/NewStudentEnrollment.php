<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewStudentEnrollment extends Notification implements ShouldQueue // Tambahkan ini
{
    use Queueable;

    protected $student;
    protected $assignment;

    public function __construct($student, $assignment)
    {
        $this->student = $student;
        $this->assignment = $assignment;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('[PENDAFTARAN BARU] ' . $this->student->name . ' mendaftar di kelas Anda')
            ->greeting('Halo, ' . $notifiable->name)
            ->line('Pemberitahuan otomatis: Seorang siswa baru telah mengajukan pendaftaran di salah satu mata pelajaran yang Anda ampu pada platform **ClassYra**.')
            ->line('---')
            ->line('### 📋 Detail Pendaftaran')
            ->line('**Nama Siswa:** ' . $this->student->name)
            ->line('**Email Siswa:** ' . $this->student->email)
            ->line('**Mata Pelajaran:** ' . $this->assignment->subject->name)
            ->line('---')
            ->line('Silakan tinjau permohonan ini melalui dashboard guru Anda untuk menyetujui atau menolak pendaftaran tersebut.')
            ->action('Tinjau Pendaftaran', url('/teacher/enrollments'))
            ->line('Terima kasih atas dedikasi Anda dalam mengajar.')
            ->salutation('Salam Hormat, ' . "\n" . 'Sistem Akademik ClassYra');
    }
}