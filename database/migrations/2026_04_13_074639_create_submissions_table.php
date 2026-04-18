<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            // Menghubungkan ke user (siswa)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // Menghubungkan ke tugas
            $table->foreignId('assignment_id')->constrained()->onDelete('cascade');
            
            $table->text('content')->nullable(); // Jawaban teks/link
            $table->string('file_path')->nullable(); // Path file tugas
            
            $table->integer('score')->nullable(); // Nilai dari guru
            $table->text('teacher_feedback')->nullable(); // Komentar guru
            
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};