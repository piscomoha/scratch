<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration pour la table des modules de formation
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Ex: M101, M201
            $table->string('intitule'); // Ex: Programmation Web
            $table->decimal('coefficient', 3, 1)->default(1.0);
            $table->foreignId('filiere_id')->constrained()->cascadeOnDelete();
            $table->integer('semestre'); // 1 ou 2
            $table->integer('annee_formation'); // 1 ou 2
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
