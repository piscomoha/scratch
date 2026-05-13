<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration pour la table des stages en entreprise
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stagiaire_id')->constrained()->cascadeOnDelete();
            $table->string('entreprise_nom');
            $table->string('entreprise_secteur')->nullable();
            $table->string('entreprise_ville')->nullable();
            $table->string('responsable_nom')->nullable();
            $table->string('responsable_telephone')->nullable();
            $table->string('responsable_email')->nullable();
            $table->date('date_debut');
            $table->date('date_fin');
            $table->integer('duree_semaines')->nullable();
            $table->decimal('note_entreprise', 4, 2)->nullable();
            $table->boolean('rapport_soumis')->default(false);
            $table->string('rapport_path')->nullable();
            $table->enum('statut', ['en_attente', 'en_cours', 'termine', 'valide'])->default('en_attente');
            $table->text('observations')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stages');
    }
};
