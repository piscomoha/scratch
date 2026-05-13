<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePresenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'stagiaire_id' => 'required|exists:stagiaires,id',
            'module_id' => 'required|exists:modules,id',
            'date_seance' => 'required|date',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
            'statut' => 'required|in:present,absent,retard,justifie',
            'motif' => 'nullable|string|max:255',
            'justificatif' => 'nullable|file|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'date_seance.required' => 'La date de séance est obligatoire.',
            'heure_fin.after' => 'L\'heure de fin doit être après l\'heure de début.',
            'statut.in' => 'Statut invalide. Valeurs acceptées : present, absent, retard, justifie.',
        ];
    }
}
