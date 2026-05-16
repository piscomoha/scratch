<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = User::where('email', 'mohammed.saide@gmail.com')->first();

if ($user) {
    echo "User found: " . $user->email . "\n";
    echo "Role: " . $user->role . "\n";
    echo "Password check ('password'): " . (Hash::check('password', $user->password) ? "OK" : "FAIL") . "\n";
} else {
    echo "User NOT found.\n";
}
