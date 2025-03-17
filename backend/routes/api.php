<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\User\TokoController;
use App\Http\Controllers\User\BarangController;
use App\Http\Controllers\User\GambarBarangController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\TokoManagementController;
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\BarangManagementController;

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

// Add a public kategori endpoint for the frontend
Route::get('/kategori', [KategoriController::class, 'index']);

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
    
    // Barang (Product) management for users
    Route::prefix('barang')->group(function() {
        Route::get('/', [BarangController::class, 'index']);
        Route::post('/', [BarangController::class, 'store']);
        // Add route for slug-based access
        Route::get('/slug/{slug}', [BarangController::class, 'getBySlug']);
        // Keep ID-based routes for backward compatibility
        Route::get('/{id}', [BarangController::class, 'show'])->where('id', '[0-9]+');
        Route::put('/slug/{slug}', [BarangController::class, 'updateBySlug']);
        Route::put('/{id}', [BarangController::class, 'update'])->where('id', '[0-9]+');
        Route::delete('/slug/{slug}', [BarangController::class, 'destroyBySlug']);
        Route::delete('/{id}', [BarangController::class, 'destroy'])->where('id', '[0-9]+');
        
        // Nested routes for GambarBarang (Product Images)
        // Update to support both ID and slug-based parent routes
        Route::get('/{id_barang}/gambar', [GambarBarangController::class, 'index'])->where('id_barang', '[0-9]+');
        Route::get('/slug/{slug}/gambar', [GambarBarangController::class, 'indexByBarangSlug']);
        Route::post('/{id_barang}/gambar', [GambarBarangController::class, 'store'])->where('id_barang', '[0-9]+');
        Route::post('/slug/{slug}/gambar', [GambarBarangController::class, 'storeByBarangSlug']);
        Route::put('/{id_barang}/gambar/{id_gambar}', [GambarBarangController::class, 'update'])->where('id_barang', '[0-9]+');
        Route::delete('/{id_barang}/gambar/{id_gambar}', [GambarBarangController::class, 'destroy'])->where('id_barang', '[0-9]+');
    });
    
    // Admin routes
    Route::middleware('role:admin,superadmin')->group(function() {  // Fixed typo from jmiddleware to middleware
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
        
        // Kategori management (admin only)
        Route::prefix('admin/kategori')->group(function() {
            Route::get('/', [KategoriController::class, 'index']);
            Route::post('/', [KategoriController::class, 'store']);
            Route::get('/{id}', [KategoriController::class, 'show']);
            Route::put('/{id}', [KategoriController::class, 'update']);
            Route::delete('/{id}', [KategoriController::class, 'destroy']);
        });

        // Admin product management
        Route::prefix('admin/barang')->group(function() {
            Route::get('/', [BarangManagementController::class, 'index']);
            Route::get('/filter', [BarangManagementController::class, 'filter']);  // Add separate filter endpoint
            Route::get('/categories', [BarangManagementController::class, 'getCategories']);
            Route::get('/{id}', [BarangManagementController::class, 'show'])->where('id', '[0-9]+');
            Route::get('/slug/{slug}', [BarangManagementController::class, 'showBySlug']);
            Route::put('/{id}', [BarangManagementController::class, 'update'])->where('id', '[0-9]+');
            Route::put('/{id}/soft-delete', [BarangManagementController::class, 'softDelete'])->where('id', '[0-9]+');
            Route::put('/{id}/restore', [BarangManagementController::class, 'restore'])->where('id', '[0-9]+');
            Route::delete('/{id}', [BarangManagementController::class, 'destroy'])->where('id', '[0-9]+');
        });
    });
});