<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StagiaireResource;
use App\Models\Stagiaire;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private function userPayload(User $user): array
    {
        $user->loadMissing('stagiaire.filiere');

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'stagiaire' => $user->stagiaire ? new StagiaireResource($user->stagiaire) : null,
        ];
    }

    private function createStagiaireProfile(User $user): void
    {
        if ($user->role !== 'stagiaire' || $user->stagiaire) {
            return;
        }

        $parts = preg_split('/\s+/', trim($user->name), 2);
        $prenom = $parts[0] ?: $user->name;
        $nom = $parts[1] ?? $parts[0] ?? $user->name;

        Stagiaire::create([
            'user_id' => $user->id,
            'code_massar' => 'USR' . str_pad((string) $user->id, 6, '0', STR_PAD_LEFT),
            'nom' => $nom,
            'prenom' => $prenom,
            'email' => $user->email,
            'annee_formation' => 1,
            'statut' => 'actif',
        ]);
    }

    /**
     * Connexion — retourne un token Sanctum
     * POST /api/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        // Vérification des identifiants
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        // Création du token avec le rôle comme ability
        $token = $user->createToken('auth-token', [$user->role])->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'user' => $this->userPayload($user),
            'token' => $token,
        ]);
    }

    /**
     * Déconnexion — révoque le token actuel
     * POST /api/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.',
        ]);
    }

    /**
     * Utilisateur connecté
     * GET /api/auth/me
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json($this->userPayload($user));
    }

    /**
     * Inscription — crée un nouvel utilisateur
     * POST /api/auth/register
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:stagiaire,formateur,admin',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);
        $this->createStagiaireProfile($user);

        // Création du token avec le rôle comme ability
        $token = $user->createToken('auth-token', [$user->role])->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie.',
            'user' => $this->userPayload($user),
            'token' => $token,
        ], 201);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $stagiaireRule = $user->role === 'stagiaire' ? 'required' : 'nullable';
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'filiere_id' => $stagiaireRule . '|exists:filieres,id',
            'groupe' => $stagiaireRule . '|string|max:20',
            'annee_formation' => $stagiaireRule . '|in:1,2',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($user->role === 'stagiaire') {
            $this->createStagiaireProfile($user);
            $parts = preg_split('/\s+/', trim($validated['name']), 2);

            $user->stagiaire()->update([
                'prenom' => $parts[0] ?: $validated['name'],
                'nom' => $parts[1] ?? $parts[0] ?? $validated['name'],
                'email' => $validated['email'],
                'filiere_id' => $validated['filiere_id'],
                'groupe' => strtoupper(trim($validated['groupe'])),
                'annee_formation' => $validated['annee_formation'],
            ]);
        }

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'user' => $this->userPayload($user->fresh()),
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Le mot de passe actuel est incorrect.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Mot de passe mis à jour avec succès.',
        ]);
    }
}
