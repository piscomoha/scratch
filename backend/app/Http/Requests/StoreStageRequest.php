<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'stagiaire_id' => 'required|exists:stagiaires,id',
            'entreprise_nom' => 'required|string|max:255',
            'entreprise_secteur' => 'nullable|string|max:255',
            'entreprise_ville' => 'nullable|string|max:100',
            'responsable_nom' => 'nullable|string|max:255',
            'responsable_telephone' => 'nullable|string|max:20',
            'responsable_email' => 'nullable|email|max:255',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'duree_semaines' => 'nullable|integer|min:1',
            'note_entreprise' => 'nullable|numeric|min:0|max:20',
            'rapport_soumis' => 'nullable|boolean',
            'rapport_path' => 'nullable|file|max:10240',
            'statut' => 'nullable|in:en_attente,en_cours,termine,valide',
            'observations' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'stagiaire_id.required' => 'Le stagiaire est obligatoire.',
            'entreprise_nom.required' => 'Le nom de l\'entreprise est obligatoire.',
            'date_debut.required' => 'La date de début est obligatoire.',
            'date_fin.required' => 'La date de fin est obligatoire.',
            'date_fin.after' => 'La date de fin doit être après la date de début.',
        ];
    }
}
