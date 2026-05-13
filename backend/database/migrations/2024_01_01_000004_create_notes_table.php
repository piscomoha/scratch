<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration pour la table des notes
// note_finale est calculée automatiquement : (note_controle * 0.4) + (note_synthese * 0.6)
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stagiaire_id')->constrained()->cascadeOnDelete();
            $table->foreignId('module_id')->constrained()->cascadeOnDelete();
            $table->decimal('note_controle', 4, 2)->nullable(); // Note du contrôle continu
            $table->decimal('note_synthese', 4, 2)->nullable(); // Note de synthèse
            $table->decimal('note_finale', 4, 2)->nullable(); // Calculée automatiquement
            $table->enum('appreciation', ['TB', 'B', 'AB', 'P', 'I'])->nullable();
            $table->string('annee_scolaire'); // Ex: 2024-2025
            $table->integer('semestre'); // 1 ou 2
            $table->timestamps();

            // Un stagiaire ne peut avoir qu'une note par module par semestre
            $table->unique(['stagiaire_id', 'module_id', 'annee_scolaire', 'semestre']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
