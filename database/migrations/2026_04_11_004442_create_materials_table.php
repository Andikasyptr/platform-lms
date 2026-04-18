<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('materials', function (Blueprint $table) {
        $table->id();
        // Menghubungkan ke SubjectAssignment (Ruang Kelas)
        $table->foreignId('subject_assignment_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->enum('type', ['video', 'image', 'text', 'file', 'link']);
        $table->text('content')->nullable(); // Untuk link YouTube atau isi teks
        $table->string('file_path')->nullable(); // Untuk path file PDF/Word/Gambar
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
