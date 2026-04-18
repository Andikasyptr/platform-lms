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
            Schema::create('classrooms', function (Blueprint $table) {
                $table->id();
                // Beri default string kosong agar tidak null saat dipanggil di React
                $table->string('name')->nullable()->default('Kelas Baru'); 
                $table->string('description')->nullable()->default('-');
                
                // Untuk kode kelas, kita buat nullable saja karena biasanya di-generate sistem
                $table->string('code')->nullable()->unique(); 
                
                // Teacher ID sebaiknya tetap NULL jika tidak ada gurunya
                $table->foreignId('teacher_id')
                    ->nullable()
                    ->constrained('users')
                    ->onDelete('set null'); 
                    
                $table->timestamps();
            });
        }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classrooms');
    }
};
