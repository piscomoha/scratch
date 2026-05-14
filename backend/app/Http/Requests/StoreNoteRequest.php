<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNoteRequest extends FormRequest
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
            'note_controle_1' => 'required|numeric|min:0|max:20',
            'note_controle_2' => 'nullable|numeric|min:0|max:20',
            'note_controle_3' => 'nullable|numeric|min:0|max:20',
            'note_synthese' => 'required|numeric|min:0|max:20',
            'note_stage' => 'nullable|numeric|min:0|max:20',
            'annee_scolaire' => 'required|string|max:9', // Format: 2024-2025
            'semestre' => 'required|in:1,2',
        ];
    }

    public function messages(): array
    {
        return [
            'stagiaire_id.required' => 'Le stagiaire est obligatoire.',
            'module_id.required' => 'Le module est obligatoire.',
            'note_controle.required' => 'La note de contrôle est obligatoire.',
            'note_controle.min' => 'La note ne peut pas être inférieure à 0.',
            'note_controle.max' => 'La note ne peut pas dépasser 20.',
            'note_synthese.required' => 'La note de synthèse est obligatoire.',
            'note_synthese.min' => 'La note ne peut pas être inférieure à 0.',
            'note_synthese.max' => 'La note ne peut pas dépasser 20.',
        ];
    }
}
