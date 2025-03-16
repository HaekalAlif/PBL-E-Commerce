<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\User\TokoController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\TokoManagementController;

// Debug endpoint for checking auth status
Route::middleware('auth:sanctum')->get('/auth-check', function (Request $request) {
    $user = auth()->user();
    return response()->json([
        'authenticated' => true,
        'user' => [
            'id_user' => $user->id_user,
            'email' => $user->email,
            'role' => $user->role_name
        ]
    ]);
});

// Auth routes are imported from another file
require __DIR__.'/auth.php';

// Public routes - no auth required
Route::prefix('toko')->group(function() {
    // Public store access by slug
    Route::get('/slug/{slug}', [TokoController::class, 'getBySlug']);
});

// Protected routes - require authentication
Route::middleware('auth:sanctum')->group(function () {
    // User profile
    Route::get('/user/profile', [UserController::class, 'getCurrentUser']);
    
    // Toko (Store) management for regular users
    Route::prefix('toko')->group(function() {
        // Get my store (based on authenticated user)
        Route::get('/my-store', [TokoController::class, 'getMyStore']);
        
        // Get store by ID (when ID is known)
        Route::get('/{id}', [TokoController::class, 'getById'])->where('id', '[0-9]+');
        
        // Store CRUD operations
        Route::post('/', [TokoController::class, 'store']);
        Route::put('/', [TokoController::class, 'update']);
        Route::delete('/', [TokoController::class, 'destroy']);
    });
    
    // Admin routes
    Route::middleware('role:admin,superadmin')->group(function() {
        // User management (admin only)
        Route::prefix('users')->group(function() {
            Route::get('/', [UserManagementController::class, 'index']);
            Route::get('/{id}', [UserManagementController::class, 'show']);
            Route::put('/{id}', [UserManagementController::class, 'update']);
            Route::delete('/{id}', [UserManagementController::class, 'destroy']);
        });
        
        // Toko management (admin only) - Moved outside the admin prefix to match the frontend request URL
        Route::prefix('admin/toko')->group(function() {
            Route::get('/', [TokoManagementController::class, 'index']);
            Route::get('/{id}', [TokoManagementController::class, 'show']);
            Route::put('/{id}', [TokoManagementController::class, 'update']);
            Route::delete('/{id}', [TokoManagementController::class, 'destroy']);
            Route::put('/{id}/soft-delete', [TokoManagementController::class, 'softDelete']);
            Route::put('/{id}/restore', [TokoManagementController::class, 'restore']);
        });
    });
});