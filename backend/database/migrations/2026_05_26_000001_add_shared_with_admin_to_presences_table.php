<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('presences', function (Blueprint $table) {
            $table->boolean('shared_with_admin')->default(false)->after('formateur_id');
            $table->timestamp('shared_at')->nullable()->after('shared_with_admin');
        });
    }

    public function down(): void
    {
        Schema::table('presences', function (Blueprint $table) {
            $table->dropColumn(['shared_with_admin', 'shared_at']);
        });
    }
};
