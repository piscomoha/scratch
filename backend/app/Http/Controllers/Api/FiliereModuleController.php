<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FiliereResource;
use App\Http\Resources\ModuleResource;
use App\Models\Filiere;
use App\Models\Module;
use Illuminate\Http\Request;

class FiliereModuleController extends Controller
{
    /**
     * Liste de toutes les filières
     * GET /api/filieres
     */
    public function filieres()
    {
        $filieres = Filiere::withCount(['stagiaires', 'modules'])->get();

        return FiliereResource::collection($filieres);
    }

    /**
     * Liste des modules (filtrables par filière)
     * GET /api/modules?filiere_id=
     */
    public function modules(Request $request)
    {
        $query = Module::with('filiere');

        if ($filiereId = $request->get('filiere_id')) {
            $query->where('filiere_id', $filiereId);
        }
        if ($annee = $request->get('annee_formation')) {
            $query->where('annee_formation', $annee);
        }
        if ($semestre = $request->get('semestre')) {
            $query->where('semestre', $semestre);
        }

        $modules = $query->orderBy('code')->get();

        return ModuleResource::collection($modules);
    }
}
