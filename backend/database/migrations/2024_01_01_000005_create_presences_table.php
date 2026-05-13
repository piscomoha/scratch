<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration pour la table de suivi des présences
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stagiaire_id')->constrained()->cascadeOnDelete();
            $table->foreignId('module_id')->constrained()->cascadeOnDelete();
            $table->date('date_seance');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->enum('statut', ['present', 'absent', 'retard', 'justifie'])->default('present');
            $table->string('motif')->nullable();
            $table->string('justificatif')->nullable(); // Chemin vers le fichier justificatif
            $table->foreignId('formateur_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presences');
    }
};
