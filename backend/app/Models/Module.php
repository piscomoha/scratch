<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'intitule',
        'coefficient',
        'filiere_id',
        'semestre',
        'annee_formation',
    ];

    protected function casts(): array
    {
        return [
            'coefficient' => 'decimal:1',
            'semestre' => 'integer',
            'annee_formation' => 'integer',
        ];
    }

    // Filière associée
    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    // Notes pour ce module
    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    // Présences pour ce module
    public function presences()
    {
        return $this->hasMany(Presence::class);
    }
}
