<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NoteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'stagiaire_id' => $this->stagiaire_id,
            'stagiaire' => new StagiaireResource($this->whenLoaded('stagiaire')),
            'module_id' => $this->module_id,
            'module' => new ModuleResource($this->whenLoaded('module')),
            'note_controle' => (float) $this->note_controle,
            'note_synthese' => (float) $this->note_synthese,
            'note_finale' => (float) $this->note_finale,
            'appreciation' => $this->appreciation,
            'annee_scolaire' => $this->annee_scolaire,
            'semestre' => $this->semestre,
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
        ];
    }
}
