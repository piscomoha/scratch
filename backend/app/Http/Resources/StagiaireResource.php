<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StagiaireResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code_massar' => $this->code_massar,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'nom_complet' => $this->nom_complet,
            'date_naissance' => $this->date_naissance?->format('Y-m-d'),
            'genre' => $this->genre,
            'telephone' => $this->telephone,
            'email' => $this->email,
            'adresse' => $this->adresse,
            'ville' => $this->ville,
            'photo' => $this->photo ? url('storage/' . $this->photo) : null,
            'filiere' => new FiliereResource($this->whenLoaded('filiere')),
            'filiere_id' => $this->filiere_id,
            'groupe' => $this->groupe,
            'annee_formation' => $this->annee_formation,
            'statut' => $this->statut,
            'taux_presence' => $this->when($request->routeIs('stagiaires.show'), $this->taux_presence),
            'notes' => NoteResource::collection($this->whenLoaded('notes')),
            'presences' => PresenceResource::collection($this->whenLoaded('presences')),
            'stage' => new StageResource($this->whenLoaded('stage')),
            'user' => $this->whenLoaded('user', fn () => $this->user ? [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'role' => $this->user->role,
                'avatar' => $this->user->avatar ? url('storage/' . $this->user->avatar) : null,
                'created_at' => $this->user->created_at?->format('Y-m-d H:i'),
                'updated_at' => $this->user->updated_at?->format('Y-m-d H:i'),
            ] : null),
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
        ];
    }
}
