<?php

namespace App\Console\Commands;

use App\Models\Notification;
use App\Models\Stage;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendStageNotifications extends Command
{
    protected $signature = 'stages:notify';
    protected $description = 'Envoyer des notifications aux admins pour les stages qui approchent ou se terminent bientôt';

    public function handle(): int
    {
        $today = Carbon::today();
        $in7Days = $today->copy()->addDays(7);
        $admins = User::where('role', 'admin')->get();

        if ($admins->isEmpty()) {
            $this->warn('Aucun admin trouvé.');
            return 0;
        }

        $notifCount = 0;

        // ── Stages qui commencent dans les 7 prochains jours ──
        $upcomingStages = Stage::with('stagiaire')
            ->whereBetween('date_debut', [$today, $in7Days])
            ->where('statut', 'en_attente')
            ->get();

        foreach ($upcomingStages as $stage) {
            $daysUntil = $today->diffInDays($stage->date_debut);
            $stagiaireNom = $stage->stagiaire->nom_complet ?? 'Inconnu';

            foreach ($admins as $admin) {
                // Éviter les doublons : pas de notif si une existe déjà aujourd'hui pour ce stage
                $exists = Notification::where('user_id', $admin->id)
                    ->where('type', 'stage_upcoming')
                    ->where('link', "/stages?highlight={$stage->id}")
                    ->whereDate('created_at', $today)
                    ->exists();

                if (!$exists) {
                    Notification::create([
                        'user_id' => $admin->id,
                        'title' => '📅 Stage imminent',
                        'message' => "Le stage de {$stagiaireNom} chez {$stage->entreprise_nom} commence dans {$daysUntil} jour(s).",
                        'type' => 'stage_upcoming',
                        'link' => "/stages?highlight={$stage->id}",
                    ]);
                    $notifCount++;
                }
            }
        }

        // ── Stages qui se terminent dans les 7 prochains jours ──
        $endingStages = Stage::with('stagiaire')
            ->whereBetween('date_fin', [$today, $in7Days])
            ->where('statut', 'en_cours')
            ->get();

        foreach ($endingStages as $stage) {
            $daysUntil = $today->diffInDays($stage->date_fin);
            $stagiaireNom = $stage->stagiaire->nom_complet ?? 'Inconnu';

            foreach ($admins as $admin) {
                $exists = Notification::where('user_id', $admin->id)
                    ->where('type', 'stage_ending')
                    ->where('link', "/stages?highlight={$stage->id}")
                    ->whereDate('created_at', $today)
                    ->exists();

                if (!$exists) {
                    Notification::create([
                        'user_id' => $admin->id,
                        'title' => '⏰ Stage bientôt terminé',
                        'message' => "Le stage de {$stagiaireNom} chez {$stage->entreprise_nom} se termine dans {$daysUntil} jour(s).",
                        'type' => 'stage_ending',
                        'link' => "/stages?highlight={$stage->id}",
                    ]);
                    $notifCount++;
                }
            }
        }

        $this->info("{$notifCount} notification(s) envoyée(s).");
        return 0;
    }
}
