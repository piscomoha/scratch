<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    protected $fillable = [
        'stagiaire_id',
        'module_id',
        'note_controle',
        'note_synthese',
        'note_finale',
        'appreciation',
        'annee_scolaire',
        'semestre',
    ];

    protected function casts(): array
    {
        return [
            'note_controle' => 'decimal:2',
            'note_synthese' => 'decimal:2',
            'note_finale' => 'decimal:2',
            'semestre' => 'integer',
        ];
    }

    // Calcul automatique de la note finale et de l'appréciation
    protected static function booted(): void
    {
        // Avant chaque sauvegarde, calculer note_finale et appreciation
        static::saving(function (Note $note) {
            if ($note->note_controle !== null && $note->note_synthese !== null) {
                // Formule : note_finale = (contrôle * 0.4) + (synthèse * 0.6)
                $note->note_finale = round(($note->note_controle * 0.4) + ($note->note_synthese * 0.6), 2);

                // Appréciation basée sur la note finale
                $note->appreciation = match(true) {
                    $note->note_finale >= 14 => 'TB',  // Très Bien
                    $note->note_finale >= 12 => 'B',   // Bien
                    $note->note_finale >= 10 => 'AB',  // Assez Bien
                    $note->note_finale >= 8  => 'P',   // Passable
                    default                  => 'I',   // Insuffisant
                };
            }
        });
    }

    // Stagiaire associé
    public function stagiaire()
    {
        return $this->belongsTo(Stagiaire::class);
    }

    // Module associé
    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
