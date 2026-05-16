<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Affectation extends Model
{
    protected $fillable = ['user_id', 'filiere_id', 'groupe'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }
}
