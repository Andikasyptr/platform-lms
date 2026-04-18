<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Menambahkan kolom classroom_id setelah kolom role
            // Kita gunakan onDelete('set null') agar jika kelas dihapus, user-nya tidak ikut terhapus
            $table->foreignId('classroom_id')->nullable()->after('role')->constrained('classrooms')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['classroom_id']);
            $table->dropColumn('classroom_id');
        });
    }
};