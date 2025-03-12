<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Admin\UserManagementController;    

require __DIR__.'/auth.php';

// Protected routes (requiring authentication)
Route::middleware(['auth:sanctum'])->group(function () {
    // User routes
    Route::get('/user/profile', [UserController::class, 'getCurrentUser']);
    
    // User Management routes (admin and superadmin only)
    Route::prefix('users')->middleware('role:admin,superadmin')->group(function () {
        Route::get('/', [UserManagementController::class, 'index']);
        Route::post('/', [UserManagementController::class, 'store']);
        Route::get('/{id}', [UserManagementController::class, 'show']);
        Route::put('/{id}', [UserManagementController::class, 'update']);
        Route::delete('/{id}', [UserManagementController::class, 'destroy']);
    });
}); 