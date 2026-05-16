<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\Stagiaire;

$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$groups = Stagiaire::select('groupe', 'filiere_id')->distinct()->get();
foreach ($groups as $g) {
    echo "Group: " . $g->groupe . " (Filiere ID: " . $g->filiere_id . ")\n";
}
