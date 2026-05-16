<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Notification;
use App\Models\User;
use App\Models\Stagiaire;
use App\Models\Filiere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Document::with(['filiere', 'formateur', 'module']);

        // Access Control
        if ($user->isStagiaire()) {
            $stagiaire = $user->stagiaire;
            if ($stagiaire) {
                $query->where(function ($q) use ($stagiaire) {
                    $q->where('category', 'schedule')
                      ->where('filiere_id', $stagiaire->filiere_id)
                      ->where('groupe', $stagiaire->groupe)
                      ->where('annee_formation', $stagiaire->annee_formation);
                })->orWhere('category', 'administrative'); // Allow all administrative docs for now or filter further
            } else {
                return response()->json(['success' => true, 'data' => []]);
            }
        } elseif ($user->isFormateur()) {
            $query->where(function ($q) use ($user) {
                // Formateurs see docs they uploaded
                $q->where('user_id', $user->id)
                  // OR docs related to their assigned groups (affectations)
                  ->orWhereIn('groupe', $user->affectations->pluck('groupe'))
                  ->orWhere('category', 'administrative');
            });
        }

        if ($request->has('search') && $request->search !== '') {
            $query->where('title', 'like', '%' . $request->search . '%');
        }
        if ($request->has('category') && $request->category !== '') {
            $query->where('category', $request->category);
        }
        if ($request->has('filiere_id') && $request->filiere_id !== '') {
            $query->where('filiere_id', $request->filiere_id);
        }
        if ($request->has('module_id') && $request->module_id !== '') {
            $query->where('module_id', $request->module_id);
        }
        if ($request->has('groupe') && $request->groupe !== '') {
            $query->where('groupe', $request->groupe);
        }
        if ($request->has('annee_formation') && $request->annee_formation !== '') {
            $query->where('annee_formation', $request->annee_formation);
        }
        if ($request->has('user_id') && $request->user_id !== '') {
            $query->where('user_id', $request->user_id);
        }

        $documents = $query->latest()->get();

        // Transform file_path to absolute URL
        $documents->transform(function ($doc) {
            $doc->file_url = url('storage/' . $doc->file_path);
            return $doc;
        });

        return response()->json([
            'success' => true,
            'data' => $documents
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required|file|max:20480', // Max 20MB
            'category' => 'required|string',
        ]);

        $file = $request->file('file');
        $path = $file->store('documents', 'public');
        
        $document = Document::create([
            'title' => $request->title,
            'file_path' => $path,
            'file_type' => $file->getClientOriginalExtension() ?: 'unknown',
            'file_size' => $file->getSize(),
            'category' => $request->category,
            'filiere_id' => $request->filiere_id ?: null,
            'module_id' => $request->module_id ?: null,
            'groupe' => $request->groupe ?: null,
            'annee_formation' => $request->annee_formation ?: null,
            'user_id' => $request->user_id ?: Auth::id(),
        ]);

        $document->load(['filiere', 'formateur', 'module']);
        $document->file_url = url('storage/' . $document->file_path);

        return response()->json([
            'success' => true,
            'data' => $document,
            'message' => 'Document uploadé avec succès'
        ], 201);
    }

    public function destroy($id)
    {
        $document = Document::findOrFail($id);
        
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }
        
        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Document supprimé'
        ]);
    }

    public function distribute(Request $request, $id)
    {
        $document = Document::findOrFail($id);
        $recipients = $request->input('recipients', []); // ['formateurs', 'groups', 'filieres', 'stagiaires']
        $targetIds = $request->input('target_ids', []); // ids of specific groups, filieres etc if applicable
        
        $userIds = collect();

        if (in_array('formateurs', $recipients)) {
            $userIds = $userIds->merge(User::where('role', 'formateur')->pluck('id'));
        }

        if (in_array('stagiaires', $recipients)) {
            $userIds = $userIds->merge(User::where('role', 'stagiaire')->pluck('id'));
        }

        if (!empty($targetIds['groups'])) {
            // Find users (stagiaires) in these groups
            $stagiaireUserIds = Stagiaire::whereIn('groupe', $targetIds['groups'])->pluck('user_id');
            $userIds = $userIds->merge($stagiaireUserIds);
        }

        if (!empty($targetIds['filieres'])) {
            $stagiaireUserIds = Stagiaire::whereIn('filiere_id', $targetIds['filieres'])->pluck('user_id');
            $userIds = $userIds->merge($stagiaireUserIds);
        }

        $userIds = $userIds->unique()->filter();

        foreach ($userIds as $userId) {
            Notification::create([
                'user_id' => $userId,
                'title' => 'Nouveau planning disponible',
                'message' => "L'administration a partagé un nouvel emploi du temps : {$document->title}",
                'type' => 'info',
                'link' => '/documents' // Assuming there is a documents page for everyone
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Notification envoyée à ' . $userIds->count() . ' utilisateurs'
        ]);
    }
}
