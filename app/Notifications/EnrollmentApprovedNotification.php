<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class EnrollmentApprovedNotification extends Notification
{
    use Queueable;

    protected $enrollment;
    protected $subjectAssignment;

    public function __construct($enrollment)
    {
        $this->enrollment = $enrollment;
        $this->subjectAssignment = $enrollment->subjectAssignment;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $subjectName = $this->subjectAssignment->subject->name;
        $classroomName = $this->subjectAssignment->classroom->name;
        $teacherName = $this->subjectAssignment->teacher->name;

        return (new MailMessage)
            ->subject('[DITERIMA] Pendaftaran Kelas: ' . $subjectName)
            ->greeting('Selamat, ' . $notifiable->name . '!')
            ->line('Pendaftaran Anda untuk mata pelajaran **' . $subjectName . '** telah **Disetujui** oleh pengajar.')
            ->line('Sekarang Anda sudah dapat mengakses materi, tugas, dan berpartisipasi dalam aktivitas kelas.')
            ->line('---')
            ->line('### 🏫 Detail Kelas')
            ->line('**Mata Pelajaran:** ' . $subjectName)
            ->line('**Ruang Kelas:** ' . $classroomName)
            ->line('**Pengajar:** ' . $teacherName)
            ->line('---')
            ->action('Mulai Belajar Sekarang', url('/student/my-class'))
            ->line('Pastikan Anda memeriksa jadwal dan materi perdana yang telah diunggah.')
            ->salutation('Salam Sukses, ' . "\n" . 'Tim Akademik ClassYra');
    }
}