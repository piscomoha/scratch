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
        Schema::table('notes', function (Blueprint $table) {
            if (Schema::hasColumn('notes', 'note_controle')) {
                $table->renameColumn('note_controle', 'note_controle_1');
            }
            if (!Schema::hasColumn('notes', 'note_controle_2')) {
                $table->decimal('note_controle_2', 5, 2)->nullable()->after('note_controle_1');
            }
            if (!Schema::hasColumn('notes', 'note_controle_3')) {
                $table->decimal('note_controle_3', 5, 2)->nullable()->after('note_controle_2');
            }
        });
    }

    public function down(): void
    {
        Schema::table('notes', function (Blueprint $table) {
            if (Schema::hasColumn('notes', 'note_controle_1')) {
                $table->renameColumn('note_controle_1', 'note_controle');
            }
            $table->dropColumn(['note_controle_2', 'note_controle_3']);
        });
    }
};
