<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStagiaireRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $stagiaireId = $this->route('stagiaire');

        return [
            'code_massar' => 'sometimes|string|unique:stagiaires,code_massar,' . $stagiaireId,
            'nom' => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'date_naissance' => 'sometimes|date|before:today',
            'genre' => 'sometimes|in:M,F',
            'telephone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'adresse' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:100',
            'photo' => 'nullable|image|max:2048',
            'filiere_id' => 'sometimes|exists:filieres,id',
            'groupe' => 'sometimes|string|max:20',
            'annee_formation' => 'sometimes|in:1,2',
            'statut' => 'nullable|in:actif,suspendu,diplome,abandon',
        ];
    }
}
