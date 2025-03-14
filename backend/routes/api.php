<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\User\TokoController;
use App\Http\Controllers\Admin\TokoManagementController;

// Add a test endpoint to check CSRF functionality
Route::get('/csrf-test', function() {
    return response()->json([
        'success' => true,
        'message' => 'CSRF token is working correctly'
    ]);
});

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
    
    // Store management for regular users
    Route::prefix('toko')->group(function () {
        Route::get('/my-store', [TokoController::class, 'getMyStore']);
        Route::post('/', [TokoController::class, 'store']);
        Route::put('/', [TokoController::class, 'update']);
        Route::delete('/', [TokoController::class, 'destroy']);
    });

    // Admin store management routes
    Route::prefix('admin/toko')->middleware('role:admin,superadmin')->group(function () {
        Route::get('/', [TokoManagementController::class, 'index']);
        Route::get('/{id}', [TokoManagementController::class, 'show']);
        Route::put('/{id}', [TokoManagementController::class, 'update']);
        Route::delete('/{id}', [TokoManagementController::class, 'destroy']);
        Route::put('/{id}/soft-delete', [TokoManagementController::class, 'softDelete']);
        Route::put('/{id}/restore', [TokoManagementController::class, 'restore']);
    });
});