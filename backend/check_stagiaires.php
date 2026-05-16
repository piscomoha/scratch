<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\Stagiaire;

$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$stagiaires = Stagiaire::all();
echo "Total stagiaires: " . $stagiaires->count() . "\n";
foreach ($stagiaires as $s) {
    echo "- " . $s->email . "\n";
}
