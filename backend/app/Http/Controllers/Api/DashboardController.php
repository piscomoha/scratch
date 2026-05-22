<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stagiaire;
use App\Models\Presence;
use App\Models\Stage;
use App\Models\Filiere;
use App\Models\Document;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Statistiques globales pour le tableau de bord
     * GET /api/dashboard/stats
     */
    public function stats(): JsonResponse
    {
        try {
            $today = Carbon::today();
            $user = Auth::user();

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

            // Stagiaires by filière (Admin only)
            $parFiliere = [];
            if ($user->isAdmin() || $user->isFormateur()) {
                $parFiliere = Filiere::withCount(['stagiaires' => fn($q) => $q->where('statut', 'actif')])
                    ->get()
                    ->map(fn($f) => [
                        'filiere' => $f->libelle,
                        'code' => $f->code,
                        'count' => $f->stagiaires_count,
                    ]);
            }

            // Stagiaire-specific data
            $myStats = [
                'moyenne_generale' => 0,
                'total_absences' => 0,
                'recent_notes' => [],
            ];

            // Shared Documents
            $docQuery = Document::with(['filiere', 'formateur', 'module']);

            if ($user->isStagiaire()) {
                $stagiaire = $user->stagiaire;
                if ($stagiaire) {
                    $myStats = [
                        'moyenne_generale' => round($stagiaire->notes()->avg('note_finale'), 2) ?: 0,
                        'total_absences' => $stagiaire->presences()->where('statut', 'absent')->count(),
                        'recent_notes' => $stagiaire->notes()->with('module')->latest()->limit(5)->get()->map(fn($n) => [
                            'module' => $n->module->intitule,
                            'valeur' => $n->note_finale,
                            'date' => $n->created_at->format('Y-m-d'),
                        ]),
                    ];

                    $docQuery->whereIn('shared_with', ['all', 'stagiaires'])
                             ->where(function($q) use ($stagiaire) {
                                 $q->where('category', 'administrative')
                                   ->orWhere(function($sub) use ($stagiaire) {
                                       $sub->where('category', 'schedule')
                                           ->where(function($filter) use ($stagiaire) {
                                               $filter->where(function($specific) use ($stagiaire) {
                                                   $specific->where('filiere_id', $stagiaire->filiere_id)
                                                           ->where('groupe', $stagiaire->groupe);
                                               })
                                               ->orWhere(function($general) {
                                                   $general->whereNull('filiere_id')
                                                           ->whereNull('groupe');
                                               });
                                           });
                                   });
                             });
                } else {
                    $docQuery->where('id', 0);
                }
            } elseif ($user->isFormateur()) {
                $docQuery->where(function ($q) use ($user) {
                    $q->where('user_id', $user->id)
                      ->orWhereIn('shared_with', ['all', 'formateurs'])
                      ->orWhereIn('groupe', $user->affectations->pluck('groupe'));
                });
            } else {
                $docQuery->whereIn('shared_with', ['all', 'formateurs', 'stagiaires']);
            }

            $sharedDocuments = $docQuery->latest()->limit(5)->get();
            $sharedDocuments->transform(function ($doc) {
                $doc->file_url = url('storage/' . $doc->file_path);
                return $doc;
            });

            // Absences récentes (7 derniers jours) - Admin/Formateur only
            $absencesRecentes = [];
            if ($user->isAdmin() || $user->isFormateur()) {
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
            }

            // Présences par jour (7 derniers jours) for chart - Admin/Formateur only
            $presencesParJour = [];
            if ($user->isAdmin() || $user->isFormateur()) {
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
            }

            // Recent Notifications for the user
            $notifications = Notification::where('user_id', $user->id)
                ->latest()
                ->limit(5)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_stagiaires' => $totalStagiaires,
                    'actifs' => $actifs,
                    'suspendus' => $suspendus,
                    'diplomes' => $diplomes,
                    'en_stage' => $enStage,
                    'taux_presence_global' => $tauxPresenceGlobal,
                    'stagiaires_par_filiere' => $parFiliere,
                    'absences_recentes' => $absencesRecentes,
                    'presences_par_jour' => $presencesParJour,
                    'shared_documents' => $sharedDocuments,
                    'my_stats' => $myStats,
                    'recent_notifications' => $notifications,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => [
                    'total_stagiaires' => 0,
                    'actifs' => 0,
                    'suspendus' => 0,
                    'diplomes' => 0,
                    'en_stage' => 0,
                    'taux_presence_global' => 0,
                    'stagiaires_par_filiere' => [],
                    'absences_recentes' => [],
                    'presences_par_jour' => [],
                    'shared_documents' => [],
                    'my_stats' => ['moyenne_generale' => 0, 'total_absences' => 0, 'recent_notes' => []],
                    'recent_notifications' => [],
                ]
            ], 200); // Return 200 with default data to prevent frontend crash/loading loop
        }
    }
}
