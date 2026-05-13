<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStageRequest;
use App\Http\Resources\StageResource;
use App\Models\Stage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StageController extends Controller
{
    /**
     * Liste des stages
     * GET /api/stages?statut=&entreprise_ville=
     */
    public function index(Request $request)
    {
        $query = Stage::with('stagiaire.filiere');

        if ($statut = $request->get('statut')) {
            $query->where('statut', $statut);
        }
        if ($ville = $request->get('entreprise_ville')) {
            $query->where('entreprise_ville', 'like', "%{$ville}%");
        }

        $stages = $query->orderByDesc('date_debut')->paginate(10);

        return StageResource::collection($stages);
    }

    /**
     * Créer un stage
     * POST /api/stages
     */
    public function store(StoreStageRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('rapport_path')) {
            $data['rapport_path'] = $request->file('rapport_path')
                ->store('rapports', 'public');
        }

        $stage = Stage::create($data);
        $stage->load('stagiaire.filiere');

        return response()->json([
            'message' => 'Stage créé avec succès.',
            'data' => new StageResource($stage),
        ], 201);
    }

    /**
     * Détail d'un stage
     * GET /api/stages/{id}
     */
    public function show(string $id)
    {
        $stage = Stage::with('stagiaire.filiere')->findOrFail($id);

        return new StageResource($stage);
    }

    /**
     * Modifier un stage
     * PUT /api/stages/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $stage = Stage::findOrFail($id);

        $validated = $request->validate([
            'entreprise_nom' => 'sometimes|string|max:255',
            'entreprise_secteur' => 'nullable|string|max:255',
            'entreprise_ville' => 'nullable|string|max:100',
            'responsable_nom' => 'nullable|string|max:255',
            'responsable_telephone' => 'nullable|string|max:20',
            'responsable_email' => 'nullable|email|max:255',
            'date_debut' => 'sometimes|date',
            'date_fin' => 'sometimes|date',
            'duree_semaines' => 'nullable|integer|min:1',
            'note_entreprise' => 'nullable|numeric|min:0|max:20',
            'rapport_soumis' => 'nullable|boolean',
            'statut' => 'nullable|in:en_attente,en_cours,termine,valide',
            'observations' => 'nullable|string',
        ]);

        if ($request->hasFile('rapport_path')) {
            $validated['rapport_path'] = $request->file('rapport_path')
                ->store('rapports', 'public');
            $validated['rapport_soumis'] = true;
        }

        $stage->update($validated);
        $stage->load('stagiaire.filiere');

        return response()->json([
            'message' => 'Stage modifié avec succès.',
            'data' => new StageResource($stage),
        ]);
    }
}
