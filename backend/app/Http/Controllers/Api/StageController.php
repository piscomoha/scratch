<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStageRequest;
use App\Http\Resources\StageResource;
use App\Models\Notification;
use App\Models\Stage;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class StageController extends Controller
{
    /**
     * Liste des stages
     * GET /api/stages?statut=&entreprise_ville=&soumis_par_stagiaire=
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
        // Filtre pour les stages soumis par les stagiaires
        if ($request->has('soumis_par_stagiaire')) {
            $query->where('soumis_par_stagiaire', $request->boolean('soumis_par_stagiaire'));
        }
        // Recherche générale
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('entreprise_nom', 'like', "%{$search}%")
                  ->orWhere('entreprise_secteur', 'like', "%{$search}%")
                  ->orWhereHas('stagiaire', function ($sq) use ($search) {
                      $sq->where('nom', 'like', "%{$search}%")
                        ->orWhere('prenom', 'like', "%{$search}%");
                  });
            });
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

        // Envoyer une notification si le stage approche
        $this->notifyIfUpcoming($stage);

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
     * Modifier un stage (Admin uniquement)
     * PUT /api/stages/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $stage = Stage::findOrFail($id);

        // Seul l'admin peut modifier les stages
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Seul l\'admin peut modifier les stages.'], 403);
        }

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
            'papiers_administratifs_ok' => 'nullable|boolean',
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

    /**
     * Formulaire de stage soumis par le stagiaire
     * POST /api/stages/submit-form
     * 
     * Le stagiaire doit d'abord confirmer ses papiers administratifs,
     * puis remplir les détails du stage. Le formulaire est envoyé
     * au formateur et à l'admin.
     */
    public function submitForm(Request $request): JsonResponse
    {
        $user = $request->user();

        // Vérifier que l'utilisateur est un stagiaire
        if ($user->role !== 'stagiaire') {
            return response()->json(['message' => 'Seuls les stagiaires peuvent soumettre un formulaire de stage.'], 403);
        }

        $stagiaire = $user->stagiaire;
        if (!$stagiaire) {
            return response()->json(['message' => 'Profil stagiaire introuvable.'], 404);
        }

        // Vérifier si le stagiaire a déjà soumis un stage
        $existingStage = Stage::where('stagiaire_id', $stagiaire->id)
            ->where('soumis_par_stagiaire', true)
            ->first();

        if ($existingStage) {
            return response()->json([
                'message' => 'Vous avez déjà soumis un formulaire de stage.',
                'data' => new StageResource($existingStage->load('stagiaire.filiere')),
            ], 422);
        }

        $validated = $request->validate([
            'papiers_administratifs_ok' => 'required|accepted',
            'entreprise_nom' => 'required|string|max:255',
            'entreprise_secteur' => 'nullable|string|max:255',
            'entreprise_ville' => 'nullable|string|max:100',
            'responsable_nom' => 'nullable|string|max:255',
            'responsable_telephone' => 'nullable|string|max:20',
            'responsable_email' => 'nullable|email|max:255',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'duree_semaines' => 'nullable|integer|min:1',
            'observations' => 'nullable|string',
        ]);

        // Créer le stage
        $stage = Stage::create([
            'stagiaire_id' => $stagiaire->id,
            'entreprise_nom' => $validated['entreprise_nom'],
            'entreprise_secteur' => $validated['entreprise_secteur'] ?? null,
            'entreprise_ville' => $validated['entreprise_ville'] ?? null,
            'responsable_nom' => $validated['responsable_nom'] ?? null,
            'responsable_telephone' => $validated['responsable_telephone'] ?? null,
            'responsable_email' => $validated['responsable_email'] ?? null,
            'date_debut' => $validated['date_debut'],
            'date_fin' => $validated['date_fin'],
            'duree_semaines' => $validated['duree_semaines'] ?? null,
            'observations' => $validated['observations'] ?? null,
            'papiers_administratifs_ok' => true,
            'soumis_par_stagiaire' => true,
            'date_soumission' => now(),
            'statut' => 'en_attente',
        ]);

        $stage->load('stagiaire.filiere');

        // Notifier les admins et formateurs
        $this->notifyAdminsAndFormateurs(
            '📋 Nouveau formulaire de stage',
            "{$stagiaire->nom_complet} a soumis son formulaire de stage chez {$stage->entreprise_nom}.",
            'stage_form_submitted',
            "/stages?highlight={$stage->id}"
        );

        return response()->json([
            'message' => 'Formulaire de stage soumis avec succès.',
            'data' => new StageResource($stage),
        ], 201);
    }

    /**
     * Vérification manuelle des notifications de stage (Admin)
     * POST /api/stages/check-notifications
     */
    public function checkNotifications(Request $request): JsonResponse
    {
        Artisan::call('stages:notify');

        return response()->json([
            'message' => 'Vérification des stages effectuée.',
            'output' => Artisan::output(),
        ]);
    }

    /**
     * Récupérer le stage du stagiaire connecté
     * GET /api/stages/my-stage
     */
    public function myStage(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'stagiaire' || !$user->stagiaire) {
            return response()->json(['data' => null]);
        }

        $stage = Stage::with('stagiaire.filiere')
            ->where('stagiaire_id', $user->stagiaire->id)
            ->first();

        if (!$stage) {
            return response()->json(['data' => null]);
        }

        return new StageResource($stage);
    }

    // ── Méthodes privées ──

    /**
     * Envoyer une notification si le stage approche (dans les 7 jours)
     */
    private function notifyIfUpcoming(Stage $stage): void
    {
        $today = Carbon::today();
        $daysUntilStart = $today->diffInDays($stage->date_debut, false);

        if ($daysUntilStart >= 0 && $daysUntilStart <= 7) {
            $stagiaireNom = $stage->stagiaire->nom_complet ?? 'Inconnu';

            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'title' => '📅 Stage imminent',
                    'message' => "Le stage de {$stagiaireNom} chez {$stage->entreprise_nom} commence dans {$daysUntilStart} jour(s).",
                    'type' => 'stage_upcoming',
                    'link' => "/stages?highlight={$stage->id}",
                ]);
            }
        }
    }

    /**
     * Notifier tous les admins et formateurs
     */
    private function notifyAdminsAndFormateurs(string $title, string $message, string $type, string $link): void
    {
        $users = User::whereIn('role', ['admin', 'formateur'])->get();

        foreach ($users as $user) {
            Notification::create([
                'user_id' => $user->id,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'link' => $link,
            ]);
        }
    }
}
