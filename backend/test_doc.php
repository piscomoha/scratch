<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $doc = \App\Models\Document::create([
        'title' => 'Test',
        'file_path' => 'test.pdf',
        'file_type' => 'pdf',
        'file_size' => 1000,
        'category' => 'schedule',
        'user_id' => 1
    ]);
    echo "Success: " . $doc->id;
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
