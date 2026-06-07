<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ajout des champs pour le formulaire de stage soumis par le stagiaire
     * et le suivi des papiers administratifs OFPPT.
     */
    public function up(): void
    {
        Schema::table('stages', function (Blueprint $table) {
            $table->boolean('papiers_administratifs_ok')->default(false)->after('observations');
            $table->boolean('soumis_par_stagiaire')->default(false)->after('papiers_administratifs_ok');
            $table->timestamp('date_soumission')->nullable()->after('soumis_par_stagiaire');
        });
    }

    public function down(): void
    {
        Schema::table('stages', function (Blueprint $table) {
            $table->dropColumn(['papiers_administratifs_ok', 'soumis_par_stagiaire', 'date_soumission']);
        });
    }
};
