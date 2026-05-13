<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FiliereResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'libelle' => $this->libelle,
            'duree_annees' => $this->duree_annees,
            'description' => $this->description,
            'nombre_stagiaires' => $this->whenCounted('stagiaires'),
            'nombre_modules' => $this->whenCounted('modules'),
        ];
    }
}
