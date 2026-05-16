<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\User;

$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$users = User::all();
echo "Total users: " . $users->count() . "\n";
foreach ($users as $u) {
    echo "- " . $u->email . " (" . $u->role . ")\n";
}
