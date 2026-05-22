<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'title',
        'file_path',
        'file_type',
        'file_size',
        'category',
        'shared_with',
        'filiere_id',
        'user_id',
        'module_id',
        'groupe',
        'annee_formation',
    ];

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function formateur()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
