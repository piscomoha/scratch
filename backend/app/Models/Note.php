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
        'note_controle_1',
        'note_controle_2',
        'note_controle_3',
        'note_synthese',
        'note_stage',
        'note_finale',
        'appreciation',
        'annee_scolaire',
        'semestre',
    ];

    protected function casts(): array
    {
        return [
            'note_controle_1' => 'decimal:2',
            'note_controle_2' => 'decimal:2',
            'note_controle_3' => 'decimal:2',
            'note_synthese' => 'decimal:2',
            'note_stage' => 'decimal:2',
            'note_finale' => 'decimal:2',
            'semestre' => 'integer',
        ];
    }

    // Calcul automatique de la note finale et de l'appréciation
    protected static function booted(): void
    {
        static::saving(function (Note $note) {
            $ccs = [];
            if ($note->note_controle_1 !== null) $ccs[] = $note->note_controle_1;
            if ($note->note_controle_2 !== null) $ccs[] = $note->note_controle_2;
            if ($note->note_controle_3 !== null) $ccs[] = $note->note_controle_3;

            if (count($ccs) > 0 && $note->note_synthese !== null) {
                $moyenneCC = array_sum($ccs) / count($ccs);
                $stagiaire = $note->stagiaire ?? Stagiaire::find($note->stagiaire_id);
                $isAnnee2 = $stagiaire && $stagiaire->annee_formation == 2;

                if ($isAnnee2 && $note->note_stage !== null) {
                    // Pour la 2ème année : (CC * 0.4) + ((Synthèse + Stage)/2 * 0.6)
                    $efm = ($note->note_synthese + $note->note_stage) / 2;
                    $note->note_finale = round(($moyenneCC * 0.4) + ($efm * 0.6), 2);
                } else if (!$isAnnee2) {
                    // Pour la 1ère année : (CC * 0.4) + (Synthèse * 0.6)
                    $note->note_finale = round(($moyenneCC * 0.4) + ($note->note_synthese * 0.6), 2);
                }
                // Si Year 2 mais Stage est null, on ne calcule pas encore la finale ou on attend?
                // On va garder le calcul Year 1 par défaut si Year 2 mais stage absent?
                // Non, l'utilisateur a dit "if it's second year then stage and synthese".

                // Appréciation basée sur la note finale (si elle a été calculée)
                if ($note->note_finale !== null) {
                    $note->appreciation = match(true) {
                        $note->note_finale >= 14 => 'TB',
                        $note->note_finale >= 12 => 'B',
                        $note->note_finale >= 10 => 'AB',
                        $note->note_finale >= 8  => 'P',
                        default                  => 'I',
                    };
                }
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
