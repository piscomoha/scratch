<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNoteRequest;
use App\Http\Resources\NoteResource;
use App\Models\Note;
use App\Models\Notification;
use App\Models\Stagiaire;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoteController extends Controller
{
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
            $query->whereHas('stagiaire', fn ($q) => $q->where('groupe', $groupe));
        }

        $notes = $query->orderBy('created_at', 'desc')->paginate((int) $request->get('per_page', 100));

        return NoteResource::collection($notes);
    }

    public function store(StoreNoteRequest $request): JsonResponse
    {
        $data = $request->validated();
        $note = Note::where('stagiaire_id', $data['stagiaire_id'])
            ->where('module_id', $data['module_id'])
            ->where('annee_scolaire', $data['annee_scolaire'])
            ->where('semestre', $data['semestre'])
            ->first();

        if ($note) {
            $note->update($data);
        } else {
            $note = Note::create($data);
        }

        $note->load(['stagiaire', 'module']);

        if ($note->wasRecentlyCreated && $note->stagiaire && $note->stagiaire->user_id) {
            Notification::create([
                'user_id' => $note->stagiaire->user_id,
                'title' => 'Nouvelle note enregistrée',
                'message' => "Votre note pour le module {$note->module->intitule} a été publiée.",
                'type' => 'success',
                'link' => '/dashboard',
            ]);
        }

        return response()->json([
            'message' => 'Note enregistrée avec succès.',
            'data' => new NoteResource($note),
        ], $note->wasRecentlyCreated ? 201 : 200);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $note = Note::findOrFail($id);
        $validated = $request->validate([
            'note_controle_1' => 'nullable|numeric|min:0|max:20',
            'note_controle_2' => 'nullable|numeric|min:0|max:20',
            'note_controle_3' => 'nullable|numeric|min:0|max:20',
            'note_synthese' => 'nullable|numeric|min:0|max:20',
            'note_stage' => 'nullable|numeric|min:0|max:20',
        ]);

        $note->update($validated);
        $note->load(['stagiaire', 'module']);

        return response()->json([
            'message' => 'Note modifiée avec succès.',
            'data' => new NoteResource($note),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $note = Note::findOrFail($id);
        $note->delete();

        return response()->json([
            'message' => 'Note supprimée avec succès.',
        ]);
    }

    public function moyennes(string $stagiaireId): JsonResponse
    {
        $stagiaire = Stagiaire::findOrFail($stagiaireId);
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

        $totalCoeff = 0;
        $totalPondere = 0;
        foreach ($moyennesParModule as $m) {
            $totalCoeff += $m['module']['coefficient'];
            $totalPondere += $m['moyenne'] * $m['module']['coefficient'];
        }

        return response()->json([
            'stagiaire_id' => (int) $stagiaireId,
            'nom_complet' => $stagiaire->nom_complet,
            'moyenne_generale' => $totalCoeff > 0 ? round($totalPondere / $totalCoeff, 2) : 0,
            'moyennes_par_module' => $moyennesParModule,
        ]);
    }
}
