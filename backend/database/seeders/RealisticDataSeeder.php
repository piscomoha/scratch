<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Filiere;
use App\Models\Module;
use App\Models\Document;
use App\Models\Affectation;
use App\Models\Stagiaire;
use Illuminate\Support\Facades\Hash;

class RealisticDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Filieres
        $dev = Filiere::where('code', 'DEV')->first();
        $tri = Filiere::where('code', 'TRI')->first();

        // 2. Additional Formateurs
        $f3 = User::create([
            'name' => 'Karim Idrissi',
            'email' => 'karim.idrissi@ofppt.ma',
            'password' => Hash::make('password'),
            'role' => 'formateur',
        ]);

        $f4 = User::create([
            'name' => 'Meryem Tazi',
            'email' => 'meryem.tazi@ofppt.ma',
            'password' => Hash::make('password'),
            'role' => 'formateur',
        ]);

        // 3. Affectations for Formateurs
        if ($dev && $tri) {
            Affectation::create(['user_id' => $f3->id, 'filiere_id' => $dev->id, 'groupe' => 'DEV201']);
            Affectation::create(['user_id' => $f3->id, 'filiere_id' => $dev->id, 'groupe' => 'DEV202']);
            Affectation::create(['user_id' => $f4->id, 'filiere_id' => $tri->id, 'groupe' => 'TRI101']);
        }

        // 4. Documents / Schedules
        $admin = User::where('role', 'admin')->first();
        if ($admin && $dev) {
            Document::create([
                'title' => 'Emploi du Temps - DEV201 - Semaine 20',
                'file_path' => 'documents/test_schedule_dev.pdf',
                'file_type' => 'pdf',
                'file_size' => 1024 * 500,
                'category' => 'schedule',
                'filiere_id' => $dev->id,
                'user_id' => $admin->id,
                'groupe' => 'DEV201',
                'annee_formation' => 2,
            ]);

            Document::create([
                'title' => 'Règlement Intérieur 2026',
                'file_path' => 'documents/reglement.pdf',
                'file_type' => 'pdf',
                'file_size' => 1024 * 1200,
                'category' => 'administrative',
                'user_id' => $admin->id,
            ]);
        }

        // 5. Additional Trainees & Users
        $trainees = [
            ['name' => 'Yassine Belghiti', 'email' => 'yassine.bel@gmail.com', 'group' => 'DEV201', 'filiere' => $dev, 'year' => 2],
            ['name' => 'Laila Mansouri', 'email' => 'laila.man@gmail.com', 'group' => 'TRI101', 'filiere' => $tri, 'year' => 1],
        ];

        foreach ($trainees as $t) {
            $user = User::create([
                'name' => $t['name'],
                'email' => $t['email'],
                'password' => Hash::make('password'),
                'role' => 'stagiaire',
            ]);

            Stagiaire::create([
                'user_id' => $user->id,
                'nom' => explode(' ', $t['name'])[1],
                'prenom' => explode(' ', $t['name'])[0],
                'code_massar' => 'M' . rand(10000, 99999),
                'email' => $t['email'],
                'filiere_id' => $t['filiere']->id,
                'groupe' => $t['group'],
                'annee_formation' => $t['year'],
                'genre' => 'M',
                'ville' => 'Casablanca',
                'telephone' => '0600000000',
                'date_naissance' => '2004-01-01',
                'adresse' => 'Test Address',
            ]);
        }
    }
}
