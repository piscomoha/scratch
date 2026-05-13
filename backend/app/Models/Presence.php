<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    use HasFactory;

    protected $fillable = [
        'stagiaire_id',
        'module_id',
        'date_seance',
        'heure_debut',
        'heure_fin',
        'statut',
        'motif',
        'justificatif',
        'formateur_id',
    ];

    protected function casts(): array
    {
        return [
            'date_seance' => 'date',
        ];
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

    // Formateur qui a enregistré la présence
    public function formateur()
    {
        return $this->belongsTo(User::class, 'formateur_id');
    }
}
