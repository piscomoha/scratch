<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Stagiaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'code_massar',
        'nom',
        'prenom',
        'date_naissance',
        'genre',
        'telephone',
        'email',
        'adresse',
        'ville',
        'photo',
        'filiere_id',
        'groupe',
        'annee_formation',
        'statut',
    ];

    protected function casts(): array
    {
        return [
            'date_naissance' => 'date',
            'annee_formation' => 'integer',
        ];
    }

    // Nom complet du stagiaire
    public function getNomCompletAttribute(): string
    {
        return $this->prenom . ' ' . $this->nom;
    }

    // Compte utilisateur lié
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Filière du stagiaire
    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    // Notes du stagiaire
    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    // Présences du stagiaire
    public function presences()
    {
        return $this->hasMany(Presence::class);
    }

    // Stage du stagiaire
    public function stage()
    {
        return $this->hasOne(Stage::class);
    }

    // Calcul du taux de présence en pourcentage
    public function getTauxPresenceAttribute(): float
    {
        $total = $this->presences()->count();
        if ($total === 0) return 100.0;

        $presents = $this->presences()
            ->whereIn('statut', ['present', 'retard'])
            ->count();

        return round(($presents / $total) * 100, 1);
    }
}
