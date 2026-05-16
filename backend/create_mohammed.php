<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\User;
use App\Models\Stagiaire;
use App\Models\Filiere;
use Illuminate\Support\Facades\Hash;

$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$filiere = Filiere::where('code', 'DEV')->first();

if (!$filiere) {
    echo "Error: Filiere DEV not found.\n";
    exit;
}

$email = 'mohammed.saide@gmail.com';

// Check if user exists
if (User::where('email', $email)->exists()) {
    echo "User already exists.\n";
} else {
    $user = User::create([
        'name' => 'Mohammed Saide',
        'email' => $email,
        'password' => Hash::make('password'),
        'role' => 'stagiaire',
    ]);
    echo "User created.\n";

    $stagiaire = Stagiaire::create([
        'user_id' => $user->id,
        'code_massar' => 'D123456',
        'nom' => 'Saide',
        'prenom' => 'Mohammed',
        'date_naissance' => '2003-05-15',
        'genre' => 'M',
        'telephone' => '0612345678',
        'email' => $email,
        'ville' => 'Casablanca',
        'adresse' => 'Adresse test',
        'filiere_id' => $filiere->id,
        'groupe' => 'DEV201',
        'annee_formation' => 2,
        'statut' => 'actif',
    ]);
    echo "Stagiaire profile created.\n";
}
