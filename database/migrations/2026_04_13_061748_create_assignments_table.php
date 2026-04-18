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
        Schema::create('assignments', function (Illuminate\Database\Schema\Blueprint $table) {
            $table->id();
            // Menghubungkan ke tabel subject_assignments
            $table->foreignId('subject_assignment_id')->constrained()->onDelete('cascade');
            
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->dateTime('due_date');
            $table->integer('points')->default(100);
            $table->string('attachment')->nullable(); // Untuk menyimpan path file
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
