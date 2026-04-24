<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ScorePublishedNotification extends Notification
{
    use Queueable;

    protected $submission;
    protected $assignment;

    public function __construct($submission)
    {
        // Pastikan relasi assignment sudah ter-load
        $this->submission = $submission;
        $this->assignment = $submission->assignment;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $score = $this->submission->score;
        $maxScore = $this->assignment->points;
        
        // Tentukan pesan apresiasi berdasarkan nilai (opsional)
        $achievementNote = $score >= ($maxScore * 0.8) 
            ? 'Hasil yang luar biasa! Pertahankan performa Anda.' 
            : 'Terus tingkatkan performa Anda di penugasan berikutnya.';

        return (new MailMessage)
            ->subject('[NILAI] ' . $this->assignment->title)
            ->greeting('Halo, ' . $notifiable->name)
            ->line('Guru Anda telah selesai memeriksa dan memberikan penilaian untuk penugasan berikut:')
            ->line('**Tugas:** ' . $this->assignment->title)
            ->line('---')
            ->line('### 📊 Hasil Penilaian Anda')
            ->line('**Skor Perolehan:** ' . $score . ' / ' . $maxScore)
            ->line('**Catatan Pengajar:**')
            ->line('*"' . ($this->submission->teacher_feedback ?? 'Tidak ada catatan tambahan dari pengajar.') . '"*')
            ->line('---')
            ->line($achievementNote)
            ->action('Lihat Detail Lengkap', url('/student/assignments/' . $this->assignment->id))
            ->line('Jika Anda memiliki pertanyaan mengenai hasil penilaian ini, silakan hubungi pengajar melalui forum kelas.')
            ->salutation('Salam Sukses,  ' . "\n" . 'Tim Akademik ClassYra');
    }
}