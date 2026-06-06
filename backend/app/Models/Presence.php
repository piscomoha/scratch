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
        'shared_with_admin',
        'shared_at',
    ];

    protected function casts(): array
    {
        return [
            'date_seance' => 'date',
            'shared_with_admin' => 'boolean',
            'shared_at' => 'datetime',
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
