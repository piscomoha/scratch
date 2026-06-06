<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StagiaireController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\PresenceController;
use App\Http\Controllers\Api\StageController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FiliereModuleController;
use App\Http\Controllers\Api\AffectationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes API — Application Suivi Stagiaires OFPPT
|--------------------------------------------------------------------------
*/

// ═══ Routes publiques (authentification) ═══
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// ═══ Routes protégées par Sanctum ═══
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::put('/auth/password', [AuthController::class, 'updatePassword']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // Filières et Modules (accessibles par tous les authentifiés)
    Route::get('/filieres', [FiliereModuleController::class, 'filieres']);
    Route::get('/modules', [FiliereModuleController::class, 'modules']);

    // Dashboard (admin et formateur)
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Stagiaires
    Route::get('/stagiaires', [StagiaireController::class, 'index']);
    Route::get('/stagiaires/{stagiaire}', [StagiaireController::class, 'show'])
        ->name('stagiaires.show');
    Route::get('/stagiaires/{stagiaire}/notes', [StagiaireController::class, 'notes']);
    Route::get('/stagiaires/{stagiaire}/presences', [StagiaireController::class, 'presences']);
    Route::get('/stagiaires/{stagiaire}/stage', [StagiaireController::class, 'stage']);

    // Stagiaires — écriture (admin uniquement)
    Route::middleware('role:admin')->group(function () {
        Route::post('/stagiaires', [StagiaireController::class, 'store']);
        Route::put('/stagiaires/{stagiaire}', [StagiaireController::class, 'update']);
        Route::delete('/stagiaires/{stagiaire}', [StagiaireController::class, 'destroy']);

        // Affectations
        Route::get('/affectations', [AffectationController::class, 'index']);
        Route::get('/affectations/user/{user}', [AffectationController::class, 'show']);
        Route::post('/affectations', [AffectationController::class, 'store']);
        Route::delete('/affectations/{id}', [AffectationController::class, 'destroy']);

        // Users
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/formateurs', [UserController::class, 'formateurs']);
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Documents
        Route::get('/documents', [DocumentController::class, 'index']);
        Route::post('/documents', [DocumentController::class, 'store']);
        Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);
        Route::post('/documents/{id}/distribute', [DocumentController::class, 'distribute']);
    });

    // Notes
    Route::get('/notes', [NoteController::class, 'index']);
    Route::get('/notes/moyennes/{stagiaire}', [NoteController::class, 'moyennes']);
    Route::middleware('role:admin,formateur')->group(function () {
        Route::post('/notes', [NoteController::class, 'store']);
        Route::put('/notes/{note}', [NoteController::class, 'update']);
        Route::delete('/notes/{note}', [NoteController::class, 'destroy']);
    });

    // Présences
    Route::get('/presences', [PresenceController::class, 'index']);
    Route::get('/presences/summary', [PresenceController::class, 'summary']);
    Route::get('/presences/stats/{stagiaire}', [PresenceController::class, 'stats']);
    Route::middleware('role:admin,formateur')->group(function () {
        Route::post('/presences', [PresenceController::class, 'store']);
        Route::post('/presences/bulk', [PresenceController::class, 'bulk']);
        Route::post('/presences/share', [PresenceController::class, 'share']);
        Route::put('/presences/{presence}', [PresenceController::class, 'update']);
    });

    // Stages
    Route::get('/stages', [StageController::class, 'index']);
    Route::get('/stages/my-stage', [StageController::class, 'myStage']);
    Route::get('/stages/{stage}', [StageController::class, 'show']);

    // Stages — soumission par le stagiaire
    Route::middleware('role:stagiaire')->group(function () {
        Route::post('/stages/submit-form', [StageController::class, 'submitForm']);
    });

    // Stages — gestion admin uniquement
    Route::middleware('role:admin')->group(function () {
        Route::post('/stages', [StageController::class, 'store']);
        Route::put('/stages/{stage}', [StageController::class, 'update']);
        Route::post('/stages/check-notifications', [StageController::class, 'checkNotifications']);
    });
});
