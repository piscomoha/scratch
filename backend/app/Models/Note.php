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

    protected static function booted(): void
    {
        static::saving(function (Note $note) {
            $ccs = array_filter([
                $note->note_controle_1,
                $note->note_controle_2,
                $note->note_controle_3,
            ], fn ($value) => $value !== null);

            if (count($ccs) < 3 || $note->note_synthese === null) {
                $note->note_finale = null;
                $note->appreciation = null;
                return;
            }

            $moyenneCC = array_sum($ccs) / count($ccs);
            $note->note_finale = round(($moyenneCC * 0.4) + ($note->note_synthese * 0.6), 2);
            $note->appreciation = match (true) {
                $note->note_finale >= 14 => 'TB',
                $note->note_finale >= 12 => 'B',
                $note->note_finale >= 10 => 'AB',
                $note->note_finale >= 8 => 'P',
                default => 'I',
            };
        });
    }

    public function stagiaire()
    {
        return $this->belongsTo(Stagiaire::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
