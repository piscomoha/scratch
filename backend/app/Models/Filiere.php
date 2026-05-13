<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Filiere extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'libelle',
        'duree_annees',
        'description',
    ];

    // Une filière a plusieurs stagiaires
    public function stagiaires()
    {
        return $this->hasMany(Stagiaire::class);
    }

    // Une filière a plusieurs modules
    public function modules()
    {
        return $this->hasMany(Module::class);
    }
}
