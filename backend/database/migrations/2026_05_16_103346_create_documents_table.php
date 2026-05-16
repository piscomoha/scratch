<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('file_path');
            $table->string('file_type'); // pdf, image, excel, word, etc.
            $table->integer('file_size'); // in bytes
            $table->string('category'); // schedule, administrative, course, etc.
            
            // Relations
            $table->foreignId('filiere_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // Formateur / uploader
            $table->foreignId('module_id')->nullable()->constrained()->nullOnDelete();
            
            // Text attributes for further filtering
            $table->string('groupe')->nullable();
            $table->string('annee_formation')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
