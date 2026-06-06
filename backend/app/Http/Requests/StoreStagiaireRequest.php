<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStagiaireRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code_massar' => 'required|string|unique:stagiaires,code_massar',
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'date_naissance' => 'required|date|before:today',
            'genre' => 'required|in:M,F',
            'telephone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255|unique:users,email',
            'account_name' => 'nullable|string|max:255',
            'account_email' => 'nullable|email|max:255|unique:users,email',
            'account_password' => 'nullable|string|min:8',
            'adresse' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:100',
            'photo' => 'nullable|image|max:2048',
            'filiere_id' => 'required|exists:filieres,id',
            'groupe' => 'required|string|max:20',
            'annee_formation' => 'required|in:1,2',
            'statut' => 'nullable|in:actif,suspendu,diplome,abandon',
        ];
    }

    public function messages(): array
    {
        return [
            'code_massar.required' => 'Le code Massar est obligatoire.',
            'code_massar.unique' => 'Ce code Massar existe déjà.',
            'nom.required' => 'Le nom est obligatoire.',
            'prenom.required' => 'Le prénom est obligatoire.',
            'date_naissance.required' => 'La date de naissance est obligatoire.',
            'date_naissance.before' => 'La date de naissance doit être antérieure à aujourd\'hui.',
            'filiere_id.required' => 'La filière est obligatoire.',
            'filiere_id.exists' => 'La filière sélectionnée n\'existe pas.',
            'groupe.required' => 'Le groupe est obligatoire.',
            'annee_formation.required' => 'L\'année de formation est obligatoire.',
            'photo.image' => 'Le fichier doit être une image.',
            'photo.max' => 'La photo ne doit pas dépasser 2 Mo.',
        ];
    }
}
