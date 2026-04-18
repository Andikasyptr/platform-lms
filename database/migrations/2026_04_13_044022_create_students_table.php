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
    Schema::create('students', function (Blueprint $table) {
        $table->id();
        // Foreign key ke tabel users
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('nisn')->unique()->nullable();
        // Tambahkan kolom lain yang Anda butuhkan
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
