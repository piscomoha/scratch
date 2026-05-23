<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stagiaires', function (Blueprint $table) {
            $table->date('date_naissance')->nullable()->change();
            $table->enum('genre', ['M', 'F'])->nullable()->change();
            $table->foreignId('filiere_id')->nullable()->change();
            $table->string('groupe')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('stagiaires', function (Blueprint $table) {
            $table->date('date_naissance')->nullable(false)->change();
            $table->enum('genre', ['M', 'F'])->nullable(false)->change();
            $table->foreignId('filiere_id')->nullable(false)->change();
            $table->string('groupe')->nullable(false)->change();
        });
    }
};
