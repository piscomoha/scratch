<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    use HasFactory;

    protected $fillable = [
        'stagiaire_id',
        'entreprise_nom',
        'entreprise_secteur',
        'entreprise_ville',
        'responsable_nom',
        'responsable_telephone',
        'responsable_email',
        'date_debut',
        'date_fin',
        'duree_semaines',
        'note_entreprise',
        'rapport_soumis',
        'rapport_path',
        'statut',
        'observations',
    ];

    protected function casts(): array
    {
        return [
            'date_debut' => 'date',
            'date_fin' => 'date',
            'note_entreprise' => 'decimal:2',
            'rapport_soumis' => 'boolean',
            'duree_semaines' => 'integer',
        ];
    }

    // Progression du stage en pourcentage
    public function getProgressionAttribute(): float
    {
        if (!$this->date_debut || !$this->date_fin) return 0;

        $debut = $this->date_debut->startOfDay();
        $fin = $this->date_fin->startOfDay();
        $now = now()->startOfDay();

        if ($now->lt($debut)) return 0;
        if ($now->gt($fin)) return 100;

        $totalDays = $debut->diffInDays($fin);
        if ($totalDays === 0) return 100;

        $elapsed = $debut->diffInDays($now);
        return round(($elapsed / $totalDays) * 100, 1);
    }

    // Stagiaire associé
    public function stagiaire()
    {
        return $this->belongsTo(Stagiaire::class);
    }
}
