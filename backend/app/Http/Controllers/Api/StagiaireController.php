<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStagiaireRequest;
use App\Http\Requests\UpdateStagiaireRequest;
use App\Http\Resources\StagiaireResource;
use App\Http\Resources\NoteResource;
use App\Http\Resources\PresenceResource;
use App\Http\Resources\StageResource;
use App\Models\Stagiaire;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class StagiaireController extends Controller
{
    /**
     * Liste paginée des stagiaires avec filtres
     * GET /api/stagiaires?search=&filiere_id=&statut=&groupe=&page=
     */
    public function index(Request $request)
    {
        $query = Stagiaire::with(['filiere', 'stage']);
        $user = $request->user();

        // Si l'utilisateur est un formateur, on filtre par ses groupes affectés
        if ($user->role === 'formateur') {
            $assignedGroups = $user->affectations()->pluck('groupe')->toArray();
            $query->whereIn('groupe', $assignedGroups);
        }

        // Recherche par nom, prénom ou code massar
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%")
                  ->orWhere('code_massar', 'like', "%{$search}%");
            });
        }

        // Filtres
        if ($filiereId = $request->get('filiere_id')) {
            $query->where('filiere_id', $filiereId);
        }
        if ($statut = $request->get('statut')) {
            $query->where('statut', $statut);
        }
        if ($groupe = $request->get('groupe')) {
            $query->where('groupe', $groupe);
        }

        $stagiaires = $query->orderBy('nom')->paginate(10);

        return StagiaireResource::collection($stagiaires);
    }

    /**
     * Créer un stagiaire
     * POST /api/stagiaires
     */
    public function store(StoreStagiaireRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Upload photo si fournie
        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('photos/stagiaires', 'public');
        }

        // Créer d'abord l'utilisateur pour l'authentification
        $user = User::create([
            'name' => $data['prenom'] . ' ' . $data['nom'],
            'email' => $data['email'],
            'password' => Hash::make('password'), // Mot de passe par défaut
            'role' => 'stagiaire',
        ]);

        $data['user_id'] = $user->id;
        $stagiaire = Stagiaire::create($data);
        $stagiaire->load('filiere');

        return response()->json([
            'message' => 'Stagiaire créé avec succès.',
            'data' => new StagiaireResource($stagiaire),
        ], 201);
    }

    /**
     * Détail complet d'un stagiaire (notes, présences, stage)
     * GET /api/stagiaires/{id}
     */
    public function show(string $id)
    {
        $stagiaire = Stagiaire::with(['filiere', 'notes.module', 'presences.module', 'stage'])
            ->findOrFail($id);

        return new StagiaireResource($stagiaire);
    }

    /**
     * Modifier un stagiaire
     * PUT /api/stagiaires/{id}
     */
    public function update(UpdateStagiaireRequest $request, string $id): JsonResponse
    {
        $stagiaire = Stagiaire::findOrFail($id);
        $data = $request->validated();

        // Upload nouvelle photo si fournie
        if ($request->hasFile('photo')) {
            // Supprimer l'ancienne photo
            if ($stagiaire->photo) {
                Storage::disk('public')->delete($stagiaire->photo);
            }
            $data['photo'] = $request->file('photo')->store('photos/stagiaires', 'public');
        }

        $stagiaire->update($data);
        $stagiaire->load('filiere');

        return response()->json([
            'message' => 'Stagiaire modifié avec succès.',
            'data' => new StagiaireResource($stagiaire),
        ]);
    }

    /**
     * Supprimer un stagiaire (Suppression définitive)
     * DELETE /api/stagiaires/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        $stagiaire = Stagiaire::findOrFail($id);
        
        // Supprimer l'utilisateur lié si existe
        if ($stagiaire->user_id) {
            $stagiaire->user()->delete();
        }

        $stagiaire->delete();

        return response()->json([
            'message' => 'Stagiaire supprimé avec succès.',
        ]);
    }

    /**
     * Notes d'un stagiaire
     * GET /api/stagiaires/{id}/notes
     */
    public function notes(string $id)
    {
        $stagiaire = Stagiaire::findOrFail($id);
        $notes = $stagiaire->notes()->with('module')->get();

        return NoteResource::collection($notes);
    }

    /**
     * Présences d'un stagiaire
     * GET /api/stagiaires/{id}/presences
     */
    public function presences(string $id)
    {
        $stagiaire = Stagiaire::findOrFail($id);
        $presences = $stagiaire->presences()->with('module')->orderByDesc('date_seance')->get();

        return PresenceResource::collection($presences);
    }

    /**
     * Stage d'un stagiaire
     * GET /api/stagiaires/{id}/stage
     */
    public function stage(string $id)
    {
        $stagiaire = Stagiaire::findOrFail($id);
        $stage = $stagiaire->stage;

        if (!$stage) {
            return response()->json(['message' => 'Aucun stage trouvé pour ce stagiaire.'], 404);
        }

        return new StageResource($stage);
    }
}
