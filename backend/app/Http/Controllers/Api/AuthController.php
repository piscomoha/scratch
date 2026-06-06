<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StagiaireResource;
use App\Models\Stagiaire;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private function userPayload(User $user): array
    {
        $user->loadMissing(['stagiaire.filiere', 'affectations.filiere']);

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'avatar' => $user->avatar ? url('storage/' . $user->avatar) : null,
            'photo' => $user->avatar ? url('storage/' . $user->avatar) : null,
            'stagiaire' => $user->stagiaire ? new StagiaireResource($user->stagiaire) : null,
            'affectations' => $user->affectations ?? [],
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
        $stagiaireRule = 'nullable';
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'avatar' => 'nullable|image|max:2048',
            'photo' => 'nullable|image|max:2048',
            'filiere_id' => $stagiaireRule . '|exists:filieres,id',
            'groupe' => $stagiaireRule . '|string|max:20',
            'annee_formation' => $stagiaireRule . '|in:1,2',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        $avatarFile = $request->file('avatar') ?? $request->file('photo');
        if ($avatarFile) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $userData['avatar'] = $avatarFile->store('photos/users', 'public');
        }

        $user->update($userData);

        if ($user->role === 'stagiaire') {
            $this->createStagiaireProfile($user);
            $parts = preg_split('/\s+/', trim($validated['name']), 2);

            $stagiaireData = [
                'prenom' => $parts[0] ?: $validated['name'],
                'nom' => $parts[1] ?? $parts[0] ?? $validated['name'],
                'email' => $validated['email'],
                'filiere_id' => $validated['filiere_id'],
                'groupe' => filled($validated['groupe'] ?? null) ? strtoupper(trim($validated['groupe'])) : null,
                'annee_formation' => $validated['annee_formation'],
            ];

            if (isset($userData['avatar'])) {
                $oldPhoto = $user->stagiaire?->photo;
                if ($oldPhoto && $oldPhoto !== $userData['avatar']) {
                    Storage::disk('public')->delete($oldPhoto);
                }
                $stagiaireData['photo'] = $userData['avatar'];
            }

            $user->stagiaire()->update($stagiaireData);
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
