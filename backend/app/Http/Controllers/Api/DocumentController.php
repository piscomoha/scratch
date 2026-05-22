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
                $query->whereIn('shared_with', ['all', 'stagiaires'])
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
                return response()->json(['success' => true, 'data' => []]);
            }
        } elseif ($user->isFormateur()) {
            $query->where(function ($q) use ($user) {
                // Formateurs see docs they uploaded
                $q->where('user_id', $user->id)
                  // OR docs shared with them
                  ->orWhereIn('shared_with', ['all', 'formateurs'])
                  // OR docs related to their assigned groups (affectations)
                  ->orWhereIn('groupe', $user->affectations->pluck('groupe'));
            });
        }

        if ($request->has('search') && $request->search !== '') {
            $query->where('title', 'like', '%' . $request->search . '%');
        }
        if ($request->has('category') && $request->category !== '') {
            $query->where('category', $request->category);
        }
        if ($request->has('shared_with') && $request->shared_with !== '') {
            $query->where('shared_with', $request->shared_with);
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
            'shared_with' => 'nullable|string|in:all,formateurs,stagiaires',
        ]);

        $file = $request->file('file');
        $path = $file->store('documents', 'public');
        
        $document = Document::create([
            'title' => $request->title,
            'file_path' => $path,
            'file_type' => $file->getClientOriginalExtension() ?: 'unknown',
            'file_size' => $file->getSize(),
            'category' => $request->category,
            'shared_with' => $request->shared_with ?: 'all',
            'filiere_id' => $request->filiere_id ?: null,
            'module_id' => $request->module_id ?: null,
            'groupe' => $request->groupe ?: null,
            'annee_formation' => $request->annee_formation ?: null,
            'user_id' => Auth::id(),
        ]);

        $document->load(['filiere', 'formateur', 'module']);
        $document->file_url = url('storage/' . $document->file_path);

        // Optional: Auto-notify based on shared_with
        if ($request->has('notify') && $request->notify == 'true') {
            $this->autoNotify($document);
        }

        return response()->json([
            'success' => true,
            'data' => $document,
            'message' => 'Document uploadé avec succès'
        ], 201);
    }

    private function autoNotify(Document $document)
    {
        $userIds = collect();

        if ($document->shared_with === 'all' || $document->shared_with === 'formateurs') {
            $userIds = $userIds->merge(User::where('role', 'formateur')->pluck('id'));
        }

        if ($document->shared_with === 'all' || $document->shared_with === 'stagiaires') {
            if ($document->filiere_id || $document->groupe) {
                $q = Stagiaire::query();
                if ($document->filiere_id) $q->where('filiere_id', $document->filiere_id);
                if ($document->groupe) $q->where('groupe', $document->groupe);
                $userIds = $userIds->merge($q->pluck('user_id'));
            } else {
                $userIds = $userIds->merge(User::where('role', 'stagiaire')->pluck('id'));
            }
        }

        $userIds = $userIds->unique()->filter()->whereNotIn('', [Auth::id()]);

        foreach ($userIds as $userId) {
            Notification::create([
                'user_id' => $userId,
                'title' => 'Nouveau document partagé',
                'message' => "Un nouveau document a été partagé : {$document->title}",
                'type' => 'info',
                'link' => url('storage/' . $document->file_path)
            ]);
        }
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
        $recipients = $request->input('recipients', []); // ['formateurs', 'stagiaires']
        
        // Update visibility if broad categories are selected
        if (in_array('formateurs', $recipients) && in_array('stagiaires', $recipients)) {
            $document->update(['shared_with' => 'all']);
        } elseif (in_array('formateurs', $recipients)) {
            $document->update(['shared_with' => 'formateurs']);
        } elseif (in_array('stagiaires', $recipients)) {
            $document->update(['shared_with' => 'stagiaires']);
        }

        $userIds = collect();

        if (in_array('formateurs', $recipients)) {
            $userIds = $userIds->merge(User::where('role', 'formateur')->pluck('id'));
        }

        if (in_array('stagiaires', $recipients)) {
            $targetIds = $request->input('target_ids', []);
            
            if (!empty($targetIds['groups']) || !empty($targetIds['filieres'])) {
                $q = Stagiaire::query();
                if (!empty($targetIds['groups'])) $q->whereIn('groupe', $targetIds['groups']);
                if (!empty($targetIds['filieres'])) $q->whereIn('filiere_id', $targetIds['filieres']);
                $userIds = $userIds->merge($q->pluck('user_id'));
            } else {
                $userIds = $userIds->merge(User::where('role', 'stagiaire')->pluck('id'));
            }
        }

        $userIds = $userIds->unique()->filter()->whereNotIn('', [Auth::id()]);

        foreach ($userIds as $userId) {
            Notification::create([
                'user_id' => $userId,
                'title' => 'Nouveau document partagé',
                'message' => "L'administration a partagé un nouveau document : {$document->title}",
                'type' => 'info',
                'link' => url('storage/' . $document->file_path)
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Notification envoyée à ' . $userIds->count() . ' utilisateurs'
        ]);
    }
}
