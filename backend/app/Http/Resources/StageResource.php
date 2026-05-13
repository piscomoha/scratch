<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'stagiaire_id' => $this->stagiaire_id,
            'stagiaire' => new StagiaireResource($this->whenLoaded('stagiaire')),
            'entreprise_nom' => $this->entreprise_nom,
            'entreprise_secteur' => $this->entreprise_secteur,
            'entreprise_ville' => $this->entreprise_ville,
            'responsable_nom' => $this->responsable_nom,
            'responsable_telephone' => $this->responsable_telephone,
            'responsable_email' => $this->responsable_email,
            'date_debut' => $this->date_debut?->format('Y-m-d'),
            'date_fin' => $this->date_fin?->format('Y-m-d'),
            'duree_semaines' => $this->duree_semaines,
            'note_entreprise' => $this->note_entreprise ? (float) $this->note_entreprise : null,
            'rapport_soumis' => $this->rapport_soumis,
            'rapport_path' => $this->rapport_path ? url('storage/' . $this->rapport_path) : null,
            'statut' => $this->statut,
            'observations' => $this->observations,
            'progression' => $this->progression,
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
        ];
    }
}
