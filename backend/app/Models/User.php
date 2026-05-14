<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Vérification des rôles
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isFormateur(): bool
    {
        return $this->role === 'formateur';
    }

    public function isStagiaire(): bool
    {
        return $this->role === 'stagiaire';
    }

    // Relation avec le profil stagiaire
    public function stagiaire()
    {
        return $this->hasOne(Stagiaire::class);
    }

    // Présences enregistrées par ce formateur
    public function presences()
    {
        return $this->hasMany(Presence::class, 'formateur_id');
    }

    public function affectations()
    {
        return $this->hasMany(Affectation::class);
    }
}
