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
            'note_controle_1' => $this->note_controle_1 === null ? null : (float) $this->note_controle_1,
            'note_controle_2' => $this->note_controle_2 === null ? null : (float) $this->note_controle_2,
            'note_controle_3' => $this->note_controle_3 === null ? null : (float) $this->note_controle_3,
            'note_synthese' => $this->note_synthese === null ? null : (float) $this->note_synthese,
            'note_stage' => $this->note_stage === null ? null : (float) $this->note_stage,
            'note_finale' => $this->note_finale === null ? null : (float) $this->note_finale,
            'appreciation' => $this->appreciation,
            'annee_scolaire' => $this->annee_scolaire,
            'semestre' => $this->semestre,
            'created_at' => $this->created_at?->format('Y-m-d H:i'),
        ];
    }
}
