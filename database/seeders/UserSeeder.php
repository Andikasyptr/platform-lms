<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Membuat akun Admin Utama
        User::create([
            'name' => 'Admin LMS',
            'email' => 'admin@lms.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Membuat contoh akun Guru (Opsional, untuk testing nanti)
        User::create([
            'name' => 'Muhammad Andika Anjas Syaputra',
            'email' => 'guru@lms.com',
            'password' => Hash::make('password123'),
            'role' => 'teacher',
        ]);
    }
}