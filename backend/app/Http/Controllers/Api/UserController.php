<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Liste des formateurs
     */
    public function formateurs(): JsonResponse
    {
        $formateurs = User::where('role', 'formateur')->with('affectations.filiere')->get();
        return response()->json(['data' => $formateurs]);
    }

    /**
     * Liste de tous les utilisateurs (admin uniquement)
     */
    public function index(): JsonResponse
    {
        $users = User::orderBy('name')->get();
        return response()->json(['data' => $users]);
    }

    /**
     * Créer un nouvel utilisateur (formateur)
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'formateur', // Par défaut pour ce bouton
        ]);

        return response()->json([
            'message' => 'Formateur créé avec succès.',
            'data' => $user
        ], 201);
    }

    /**
     * Supprimer un utilisateur
     */
    public function destroy($id): JsonResponse
    {
        $user = User::findOrFail($id);
        
        if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            return response()->json(['message' => 'Impossible de supprimer le dernier administrateur.'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
    }
}
