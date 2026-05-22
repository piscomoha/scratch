<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Affectation;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AffectationController extends Controller
{
    /**
     * Liste toutes les affectations
     */
    public function index(): JsonResponse
    {
        $affectations = Affectation::with(['user', 'filiere'])->get();
        return response()->json(['data' => $affectations]);
    }

    /**
     * Assigner des groupes à un formateur (Vider et Remplacer)
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'affectations' => 'required|array',
            'affectations.*.filiere_id' => 'required|exists:filieres,id',
            'affectations.*.groupe' => 'required|string',
        ]);

        $userId = $request->user_id;
        
        // Supprimer les anciennes affectations pour ce formateur
        Affectation::where('user_id', $userId)->delete();

        // Créer les nouvelles
        foreach ($request->affectations as $aff) {
            Affectation::create([
                'user_id' => $userId,
                'filiere_id' => $aff['filiere_id'],
                'groupe' => $aff['groupe'],
            ]);
        }

        // Créer une notification pour le formateur
        Notification::create([
            'user_id' => $userId,
            'title' => 'Mise à jour de vos affectations',
            'message' => 'L\'administrateur a mis à jour vos groupes affectés. Veuillez consulter votre tableau de bord.',
            'type' => 'info',
            'link' => '/dashboard',
        ]);

        return response()->json([
            'message' => 'Affectations mises à jour avec succès.',
            'data' => Affectation::where('user_id', $userId)->with('filiere')->get()
        ]);
    }

    /**
     * Liste des groupes par formateur
     */
    public function show($userId): JsonResponse
    {
        $affectations = Affectation::where('user_id', $userId)->with('filiere')->get();
        return response()->json(['data' => $affectations]);
    }

    /**
     * Supprimer une affectation spécifique
     */
    public function destroy($id): JsonResponse
    {
        $affectation = Affectation::findOrFail($id);
        $affectation->delete();

        return response()->json(['message' => 'Affectation supprimée.']);
    }
}
