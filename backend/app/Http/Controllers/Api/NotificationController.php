<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    /**
     * Liste des notifications de l'utilisateur connecté
     */
    public function index(Request $request): JsonResponse
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();
            
        return response()->json(['data' => $notifications]);
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead($id): JsonResponse
    {
        $notification = Notification::findOrFail($id);
        
        // Vérifier que la notification appartient à l'utilisateur
        if ($notification->user_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $notification->update(['is_read' => true]);
        
        return response()->json(['message' => 'Notification marquée comme lue.']);
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);
            
        return response()->json(['message' => 'Toutes les notifications marquées comme lues.']);
    }
}
