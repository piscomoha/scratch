<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePresenceRequest;
use App\Http\Resources\PresenceResource;
use App\Models\Presence;
use App\Models\Stagiaire;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresenceController extends Controller
{
    /**
     * Liste des présences avec filtres
     * GET /api/presences?date=&module_id=&statut=&groupe=
     */
    public function index(Request $request)
    {
        $query = Presence::with(['stagiaire', 'module', 'formateur']);

        if ($date = $request->get('date')) {
            $query->whereDate('date_seance', $date);
        }
        if ($moduleId = $request->get('module_id')) {
            $query->where('module_id', $moduleId);
        }
        if ($statut = $request->get('statut')) {
            $query->where('statut', $statut);
        }
        if ($groupe = $request->get('groupe')) {
            $query->whereHas('stagiaire', fn($q) => $q->where('groupe', $groupe));
        }
        if ($stagiaireId = $request->get('stagiaire_id')) {
            $query->where('stagiaire_id', $stagiaireId);
        }

        $presences = $query->orderByDesc('date_seance')->paginate(20);

        return PresenceResource::collection($presences);
    }

    /**
     * Enregistrer une présence
     * POST /api/presences
     */
    public function store(StorePresenceRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['formateur_id'] = $request->user()->id;

        $presence = Presence::create($data);
        $presence->load(['stagiaire', 'module']);

        return response()->json([
            'message' => 'Présence enregistrée avec succès.',
            'data' => new PresenceResource($presence),
        ], 201);
    }

    /**
     * Enregistrement en masse pour toute une séance
     * POST /api/presences/bulk
     * Body : { module_id, date_seance, heure_debut, heure_fin, presences: [{stagiaire_id, statut, motif?}] }
     */
    public function bulk(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'module_id' => 'required|exists:modules,id',
            'date_seance' => 'required|date',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
            'presences' => 'required|array|min:1',
            'presences.*.stagiaire_id' => 'required|exists:stagiaires,id',
            'presences.*.statut' => 'required|in:present,absent,retard,justifie',
            'presences.*.motif' => 'nullable|string|max:255',
        ]);

        $created = [];
        foreach ($validated['presences'] as $p) {
            $created[] = Presence::create([
                'stagiaire_id' => $p['stagiaire_id'],
                'module_id' => $validated['module_id'],
                'date_seance' => $validated['date_seance'],
                'heure_debut' => $validated['heure_debut'],
                'heure_fin' => $validated['heure_fin'],
                'statut' => $p['statut'],
                'motif' => $p['motif'] ?? null,
                'formateur_id' => $request->user()->id,
            ]);
        }

        return response()->json([
            'message' => count($created) . ' présences enregistrées avec succès.',
            'count' => count($created),
        ], 201);
    }

    /**
     * Modifier une présence
     * PUT /api/presences/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $presence = Presence::findOrFail($id);

        $validated = $request->validate([
            'statut' => 'sometimes|in:present,absent,retard,justifie',
            'motif' => 'nullable|string|max:255',
            'justificatif' => 'nullable|file|max:5120',
        ]);

        if ($request->hasFile('justificatif')) {
            $validated['justificatif'] = $request->file('justificatif')
                ->store('justificatifs', 'public');
        }

        $presence->update($validated);

        return response()->json([
            'message' => 'Présence modifiée avec succès.',
            'data' => new PresenceResource($presence->load(['stagiaire', 'module'])),
        ]);
    }

    /**
     * Statistiques de présence par stagiaire
     * GET /api/presences/stats/{id}
     * Retourne le taux de présence et le détail par statut
     */
    public function stats(string $id): JsonResponse
    {
        $stagiaire = Stagiaire::findOrFail($id);
        $presences = $stagiaire->presences;

        $total = $presences->count();
        $presents = $presences->where('statut', 'present')->count();
        $absents = $presences->where('statut', 'absent')->count();
        $retards = $presences->where('statut', 'retard')->count();
        $justifies = $presences->where('statut', 'justifie')->count();

        $tauxPresence = $total > 0 ? round((($presents + $retards) / $total) * 100, 1) : 100;
        $tauxAbsence = $total > 0 ? round(($absents / $total) * 100, 1) : 0;

        // Signalement si > 30% d'absences
        $alerte = $tauxAbsence > 30;

        return response()->json([
            'stagiaire_id' => (int) $id,
            'nom_complet' => $stagiaire->nom_complet,
            'total_seances' => $total,
            'presents' => $presents,
            'absents' => $absents,
            'retards' => $retards,
            'justifies' => $justifies,
            'taux_presence' => $tauxPresence,
            'taux_absence' => $tauxAbsence,
            'alerte_absence' => $alerte, // true si > 30% d'absences
        ]);
    }
}
