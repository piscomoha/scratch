<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminPasswordResetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@ofppt.ma')->first();
        
        if ($admin) {
            $admin->password = Hash::make('password');
            $admin->save();
        }
    }
}
