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
        $data['shared_with_admin'] = false;

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
            'heure_fin' => 'required|date_format:H:i',
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
                'shared_with_admin' => false,
            ]);
        }

        return response()->json([
            'message' => count($created) . ' présences enregistrées avec succès.',
            'count' => count($created),
            'presence_ids' => array_map(fn($p) => $p->id, $created),
        ], 201);
    }

    /**
     * Partager une séance de présences avec l'administration
     * POST /api/presences/share
     */
    public function share(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'presence_ids' => 'required|array|min:1',
            'presence_ids.*' => 'required|exists:presences,id',
        ]);

        $updated = Presence::whereIn('id', $validated['presence_ids'])
            ->update([
                'shared_with_admin' => true,
                'shared_at' => now(),
            ]);

        return response()->json([
            'message' => sprintf('%d présences partagées avec l\'administration.', $updated),
            'shared_count' => $updated,
        ]);
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

    /**
     * Résumé des présences pour l'admin
     * GET /api/presences/summary
     */
    public function summary(Request $request): JsonResponse
    {
        $dateDebut = $request->get('date_debut', now()->subDays(30)->toDateString());
        $dateFin = $request->get('date_fin', now()->toDateString());
        $filiereId = $request->get('filiere_id');
        $groupeParam = $request->get('groupe');

        // Si un groupe spécifique est demandé, retourner le détail par stagiaire
        if ($groupeParam) {
            $stagiaires = Stagiaire::where('groupe', $groupeParam)
                ->when($filiereId, fn($q) => $q->where('filiere_id', $filiereId))
                ->get();

            $details = [];
            foreach ($stagiaires as $stagiaire) {
                // Presences du stagiaire sur la période
                $presencesQuery = Presence::where('stagiaire_id', $stagiaire->id)
                    ->whereBetween('date_seance', [$dateDebut, $dateFin])
                    ->where(function ($query) {
                        $query->where('shared_with_admin', true)
                            ->orWhereDate('date_seance', '<=', now()->subDays(6)->toDateString());
                    });

                $total = $presencesQuery->count();
                $presents = (clone $presencesQuery)->where('statut', 'present')->count();
                $absents = (clone $presencesQuery)->where('statut', 'absent')->count();
                $retards = (clone $presencesQuery)->where('statut', 'retard')->count();
                $justifies = (clone $presencesQuery)->where('statut', 'justifie')->count();

                $tauxPresence = $total > 0 ? round((($presents + $retards) / $total) * 100, 1) : 100;

                $details[] = [
                    'id' => $stagiaire->id,
                    'code_massar' => $stagiaire->code_massar,
                    'nom_complet' => $stagiaire->nom_complet,
                    'total_seances' => $total,
                    'absences' => $absents,
                    'retards' => $retards,
                    'justifies' => $justifies,
                    'taux_presence' => $tauxPresence,
                    'alerte' => ($total > 0 && ($absents / $total) > 0.3),
                ];
            }

            return response()->json([
                'groupe' => $groupeParam,
                'date_debut' => $dateDebut,
                'date_fin' => $dateFin,
                'stagiaires' => $details,
            ]);
        }

        // Sinon, retourner la liste des groupes avec les statistiques globales
        $groupesQuery = Stagiaire::select('groupe', 'filiere_id')
            ->groupBy('groupe', 'filiere_id')
            ->with('filiere');

        if ($filiereId) {
            $groupesQuery->where('filiere_id', $filiereId);
        }

        $groupes = $groupesQuery->get();
        $summary = [];

        foreach ($groupes as $g) {
            $stagiairesIds = Stagiaire::where('groupe', $g->groupe)
                ->where('filiere_id', $g->filiere_id)
                ->pluck('id');

            $totalStagiaires = $stagiairesIds->count();

            // Statistiques des présences de ces stagiaires sur la période
            $presencesQuery = Presence::whereIn('stagiaire_id', $stagiairesIds)
                ->whereBetween('date_seance', [$dateDebut, $dateFin])
                ->where(function ($query) {
                    $query->where('shared_with_admin', true)
                        ->orWhereDate('date_seance', '<=', now()->subDays(6)->toDateString());
                });

            $totalPresences = $presencesQuery->count();
            $presents = (clone $presencesQuery)->where('statut', 'present')->count();
            $absents = (clone $presencesQuery)->where('statut', 'absent')->count();
            $retards = (clone $presencesQuery)->where('statut', 'retard')->count();
            $justifies = (clone $presencesQuery)->where('statut', 'justifie')->count();

            // Le taux de présence est (presents + retards) / total
            $tauxPresence = $totalPresences > 0 ? round((($presents + $retards) / $totalPresences) * 100, 1) : 100;

            // Nombre total de séances uniques pour le groupe
            $totalSeances = Presence::whereIn('stagiaire_id', $stagiairesIds)
                ->whereBetween('date_seance', [$dateDebut, $dateFin])
                ->where(function ($query) {
                    $query->where('shared_with_admin', true)
                        ->orWhereDate('date_seance', '<=', now()->subDays(6)->toDateString());
                })
                ->select('date_seance', 'heure_debut', 'heure_fin', 'module_id')
                ->distinct()
                ->count();

            $summary[] = [
                'groupe' => $g->groupe,
                'filiere_id' => $g->filiere_id,
                'filiere_code' => $g->filiere->code ?? '',
                'filiere_libelle' => $g->filiere->libelle ?? '',
                'total_stagiaires' => $totalStagiaires,
                'total_seances' => $totalSeances,
                'total_absences' => $absents,
                'taux_presence' => $tauxPresence,
            ];
        }

        return response()->json([
            'date_debut' => $dateDebut,
            'date_fin' => $dateFin,
            'groupes' => $summary,
        ]);
    }
}
