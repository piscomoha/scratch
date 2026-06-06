<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PresenceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'stagiaire_id' => $this->stagiaire_id,
            'stagiaire' => new StagiaireResource($this->whenLoaded('stagiaire')),
            'module_id' => $this->module_id,
            'module' => new ModuleResource($this->whenLoaded('module')),
            'date_seance' => $this->date_seance?->format('Y-m-d'),
            'heure_debut' => $this->heure_debut,
            'heure_fin' => $this->heure_fin,
            'statut' => $this->statut,
            'motif' => $this->motif,
            'justificatif' => $this->justificatif ? url('storage/' . $this->justificatif) : null,
            'formateur_id' => $this->formateur_id,
            'formateur' => $this->whenLoaded('formateur', fn() => [
                'id' => $this->formateur->id,
                'name' => $this->formateur->name,
            ]),
            'shared_with_admin' => $this->shared_with_admin,
            'shared_at' => $this->shared_at?->format('Y-m-d H:i'),
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
        ];
    }
}
