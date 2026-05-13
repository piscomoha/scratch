<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stagiaire;
use App\Models\Presence;
use App\Models\Stage;
use App\Models\Filiere;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Statistiques globales pour le tableau de bord
     * GET /api/dashboard/stats
     */
    public function stats(): JsonResponse
    {
        $today = Carbon::today();

        // Total stagiaires par statut
        $totalStagiaires = Stagiaire::count();
        $actifs = Stagiaire::where('statut', 'actif')->count();
        $suspendus = Stagiaire::where('statut', 'suspendu')->count();
        $diplomes = Stagiaire::where('statut', 'diplome')->count();

        // Stagiaires en stage (stage en cours)
        $enStage = Stage::where('statut', 'en_cours')->count();

        // Taux de présence global (30 derniers jours)
        $dateDebut = $today->copy()->subDays(30);
        $totalPresences = Presence::where('date_seance', '>=', $dateDebut)->count();
        $presentsCount = Presence::where('date_seance', '>=', $dateDebut)
            ->whereIn('statut', ['present', 'retard'])
            ->count();
        $tauxPresenceGlobal = $totalPresences > 0
            ? round(($presentsCount / $totalPresences) * 100, 1)
            : 100;

        // Stagiaires par filière
        $parFiliere = Filiere::withCount(['stagiaires' => fn($q) => $q->where('statut', 'actif')])
            ->get()
            ->map(fn($f) => [
                'filiere' => $f->libelle,
                'code' => $f->code,
                'count' => $f->stagiaires_count,
            ]);

        // Absences récentes (7 derniers jours)
        $absencesRecentes = Presence::with(['stagiaire', 'module'])
            ->where('statut', 'absent')
            ->where('date_seance', '>=', $today->copy()->subDays(7))
            ->orderByDesc('date_seance')
            ->limit(10)
            ->get()
            ->map(fn($p) => [
                'stagiaire' => $p->stagiaire->nom_complet,
                'module' => $p->module->intitule,
                'date' => $p->date_seance->format('Y-m-d'),
            ]);

        // Présences par jour (7 derniers jours) pour le graphique
        $presencesParJour = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = $today->copy()->subDays($i);
            $dayTotal = Presence::whereDate('date_seance', $date)->count();
            $dayPresent = Presence::whereDate('date_seance', $date)
                ->whereIn('statut', ['present', 'retard'])
                ->count();
            $dayAbsent = Presence::whereDate('date_seance', $date)
                ->where('statut', 'absent')
                ->count();

            $presencesParJour[] = [
                'date' => $date->format('Y-m-d'),
                'jour' => $date->locale('fr')->isoFormat('ddd'),
                'presents' => $dayPresent,
                'absents' => $dayAbsent,
                'total' => $dayTotal,
            ];
        }

        return response()->json([
            'total_stagiaires' => $totalStagiaires,
            'actifs' => $actifs,
            'suspendus' => $suspendus,
            'diplomes' => $diplomes,
            'en_stage' => $enStage,
            'taux_presence_global' => $tauxPresenceGlobal,
            'stagiaires_par_filiere' => $parFiliere,
            'absences_recentes' => $absencesRecentes,
            'presences_par_jour' => $presencesParJour,
        ]);
    }
}
