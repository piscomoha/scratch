<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModuleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'intitule' => $this->intitule,
            'coefficient' => (float) $this->coefficient,
            'filiere_id' => $this->filiere_id,
            'filiere' => new FiliereResource($this->whenLoaded('filiere')),
            'semestre' => $this->semestre,
            'annee_formation' => $this->annee_formation,
        ];
    }
}
