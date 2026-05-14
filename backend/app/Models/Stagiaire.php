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

    // Calcul de la moyenne générale (moyenne pondérée par les coefficients)
    public function getMoyenneGeneraleAttribute(): float
    {
        $notes = $this->notes()->with('module')->get();
        if ($notes->isEmpty()) return 0.0;

        $totalPoints = 0;
        $totalCoefficients = 0;

        foreach ($notes as $note) {
            if ($note->note_finale !== null) {
                $coef = $note->module->coefficient ?? 1;
                $totalPoints += ($note->note_finale * $coef);
                $totalCoefficients += $coef;
            }
        }

        if ($totalCoefficients === 0) return 0.0;

        return round($totalPoints / $totalCoefficients, 2);
    }

    // Appréciation globale
    public function getAppreciationGeneraleAttribute(): string
    {
        $moyenne = $this->moyenne_generale;
        
        return match(true) {
            $moyenne >= 14 => 'Très Bien',
            $moyenne >= 12 => 'Bien',
            $moyenne >= 10 => 'Assez Bien',
            $moyenne >= 8  => 'Passable',
            default        => 'Insuffisant',
        };
    }
}
