<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNoteRequest;
use App\Http\Resources\NoteResource;
use App\Models\Note;
use App\Models\Stagiaire;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Liste des notes avec filtres
     * GET /api/notes?module_id=&semestre=&annee_scolaire=&stagiaire_id=
     */
    public function index(Request $request)
    {
        $query = Note::with(['stagiaire', 'module']);

        if ($moduleId = $request->get('module_id')) {
            $query->where('module_id', $moduleId);
        }
        if ($semestre = $request->get('semestre')) {
            $query->where('semestre', $semestre);
        }
        if ($annee = $request->get('annee_scolaire')) {
            $query->where('annee_scolaire', $annee);
        }
        if ($stagiaireId = $request->get('stagiaire_id')) {
            $query->where('stagiaire_id', $stagiaireId);
        }
        if ($groupe = $request->get('groupe')) {
            $query->whereHas('stagiaire', fn($q) => $q->where('groupe', $groupe));
        }

        $notes = $query->orderBy('created_at', 'desc')->paginate(20);

        return NoteResource::collection($notes);
    }

    /**
     * Enregistrer une note — note_finale et appreciation sont calculées automatiquement
     * POST /api/notes
     */
    public function store(StoreNoteRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Vérifier si une note existe déjà pour ce stagiaire/module/semestre/année
        $exists = Note::where('stagiaire_id', $data['stagiaire_id'])
            ->where('module_id', $data['module_id'])
            ->where('annee_scolaire', $data['annee_scolaire'])
            ->where('semestre', $data['semestre'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Une note existe déjà pour ce stagiaire dans ce module, semestre et année scolaire.',
            ], 422);
        }

        $note = Note::create($data);
        $note->load(['stagiaire', 'module']);

        return response()->json([
            'message' => 'Note enregistrée avec succès.',
            'data' => new NoteResource($note),
        ], 201);
    }

    /**
     * Modifier une note
     * PUT /api/notes/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $note = Note::findOrFail($id);

        $validated = $request->validate([
            'note_controle_1' => 'sometimes|numeric|min:0|max:20',
            'note_controle_2' => 'sometimes|numeric|min:0|max:20',
            'note_controle_3' => 'sometimes|numeric|min:0|max:20',
            'note_synthese' => 'sometimes|numeric|min:0|max:20',
            'note_stage' => 'sometimes|numeric|min:0|max:20',
        ]);

        $note->update($validated);
        $note->load(['stagiaire', 'module']);

        return response()->json([
            'message' => 'Note modifiée avec succès.',
            'data' => new NoteResource($note),
        ]);
    }

    /**
     * Supprimer une note
     * DELETE /api/notes/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        $note = Note::findOrFail($id);
        $note->delete();

        return response()->json([
            'message' => 'Note supprimée avec succès.',
        ]);
    }

    /**
     * Moyennes par module pour un stagiaire
     * GET /api/notes/moyennes/{stagiaire_id}
     */
    public function moyennes(string $stagiaireId): JsonResponse
    {
        $stagiaire = Stagiaire::findOrFail($stagiaireId);

        // Calcul des moyennes par module avec coefficient
        $notes = $stagiaire->notes()->with('module')->get();

        $moyennesParModule = $notes->groupBy('module_id')->map(function ($group) {
            $module = $group->first()->module;
            $moyenne = $group->avg('note_finale');

            return [
                'module' => [
                    'id' => $module->id,
                    'code' => $module->code,
                    'intitule' => $module->intitule,
                    'coefficient' => (float) $module->coefficient,
                ],
                'moyenne' => round($moyenne, 2),
                'nombre_notes' => $group->count(),
            ];
        })->values();

        // Moyenne générale pondérée par coefficients
        $totalCoeff = 0;
        $totalPondere = 0;
        foreach ($moyennesParModule as $m) {
            $totalCoeff += $m['module']['coefficient'];
            $totalPondere += $m['moyenne'] * $m['module']['coefficient'];
        }

        $moyenneGenerale = $totalCoeff > 0 ? round($totalPondere / $totalCoeff, 2) : 0;

        return response()->json([
            'stagiaire_id' => (int) $stagiaireId,
            'nom_complet' => $stagiaire->nom_complet,
            'moyenne_generale' => $moyenneGenerale,
            'moyennes_par_module' => $moyennesParModule,
        ]);
    }
}
