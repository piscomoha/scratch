<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StagiaireController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\PresenceController;
use App\Http\Controllers\Api\StageController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FiliereModuleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes API — Application Suivi Stagiaires OFPPT
|--------------------------------------------------------------------------
*/

// ═══ Routes publiques (authentification) ═══
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// ═══ Routes protégées par Sanctum ═══
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

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
    Route::get('/presences/stats/{stagiaire}', [PresenceController::class, 'stats']);
    Route::middleware('role:admin,formateur')->group(function () {
        Route::post('/presences', [PresenceController::class, 'store']);
        Route::post('/presences/bulk', [PresenceController::class, 'bulk']);
        Route::put('/presences/{presence}', [PresenceController::class, 'update']);
    });

    // Stages
    Route::get('/stages', [StageController::class, 'index']);
    Route::get('/stages/{stage}', [StageController::class, 'show']);
    Route::middleware('role:admin,formateur')->group(function () {
        Route::post('/stages', [StageController::class, 'store']);
        Route::put('/stages/{stage}', [StageController::class, 'update']);
    });
});
