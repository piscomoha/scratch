<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration pour la table des stagiaires OFPPT
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stagiaires', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('code_massar')->unique(); // Code Massar unique
            $table->string('nom');
            $table->string('prenom');
            $table->date('date_naissance');
            $table->enum('genre', ['M', 'F']);
            $table->string('telephone')->nullable();
            $table->string('email')->nullable();
            $table->string('adresse')->nullable();
            $table->string('ville')->nullable();
            $table->string('photo')->nullable(); // Chemin vers la photo
            $table->foreignId('filiere_id')->constrained()->cascadeOnDelete();
            $table->string('groupe'); // Ex: DEV201, DEV202
            $table->integer('annee_formation')->default(1); // 1 ou 2
            $table->enum('statut', ['actif', 'suspendu', 'diplome', 'abandon'])->default('actif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stagiaires');
    }
};
