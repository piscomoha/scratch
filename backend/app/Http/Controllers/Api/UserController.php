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
}
