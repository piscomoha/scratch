<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Affectation;
use App\Models\User;
use App\Models\Filiere;

class AffectationSeeder extends Seeder
{
    public function run(): void
    {
        $formateur = User::where('email', 'ahmed.benali@ofppt.ma')->first();
        $filiere = Filiere::where('code', 'DEV')->first();

        if ($formateur && $filiere) {
            Affectation::create([
                'user_id' => $formateur->id,
                'filiere_id' => $filiere->id,
                'groupe' => 'DEV201',
            ]);
            
            Affectation::create([
                'user_id' => $formateur->id,
                'filiere_id' => $filiere->id,
                'groupe' => 'DEV202',
            ]);
        }
    }
}
