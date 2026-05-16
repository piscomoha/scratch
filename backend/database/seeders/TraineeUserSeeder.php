<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Stagiaire;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TraineeUserSeeder extends Seeder
{
    public function run(): void
    {
        $stagiaires = Stagiaire::whereNull('user_id')->get();

        foreach ($stagiaires as $stagiaire) {
            $user = User::create([
                'name' => $stagiaire->prenom . ' ' . $stagiaire->nom,
                'email' => $stagiaire->email,
                'password' => Hash::make('password'),
                'role' => 'stagiaire',
            ]);

            $stagiaire->update(['user_id' => $user->id]);
        }
    }
}
