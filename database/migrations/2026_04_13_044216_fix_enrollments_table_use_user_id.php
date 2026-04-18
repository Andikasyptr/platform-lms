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
    Schema::table('enrollments', function (Blueprint $table) {
        // Hapus foreign key dan kolom lama
        $table->dropForeign(['student_id']);
        $table->dropColumn('student_id');

        // Tambah kolom baru yang merujuk langsung ke tabel users
        $table->foreignId('user_id')->after('id')->constrained('users')->onDelete('cascade');
    });
}

public function down(): void
{
    Schema::table('enrollments', function (Blueprint $table) {
        $table->dropForeign(['user_id']);
        $table->dropColumn('user_id');
        $table->foreignId('student_id')->after('id')->constrained('students');
    });
}
};
