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
use App\Http\Controllers\RegionController;
use App\Http\Controllers\User\AlamatUserController;
use App\Http\Controllers\User\AlamatTokoController;
use App\Http\Controllers\User\PembelianController;
use App\Http\Controllers\User\DetailPembelianController;
use App\Http\Controllers\User\TagihanController;
use App\Http\Controllers\User\KeranjangController;
use App\Http\Controllers\User\PesananTokoController;
use App\Http\Controllers\Admin\PesananManagementController;
use App\Http\Controllers\Admin\PaymentManagementController;

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

// Public product catalog routes
Route::get('/products', [BarangController::class, 'getPublicProducts']);
Route::get('/products/{slug}', [BarangController::class, 'getPublicProductBySlug']);

// Region routes
Route::get('/provinces', [RegionController::class, 'getProvinces']);
Route::get('/provinces/{id}/regencies', [RegionController::class, 'getRegencies']);
Route::get('/regencies/{id}/districts', [RegionController::class, 'getDistricts']);
Route::get('/districts/{id}/villages', [RegionController::class, 'getVillages']);

// Public Midtrans notification callback
Route::post('/payments/callback', [TagihanController::class, 'callback']);

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
    
    // User Address Management
    Route::get('/user/addresses', [AlamatUserController::class, 'index']);
    Route::get('/user/addresses/{id}', [AlamatUserController::class, 'show']);
    Route::post('/user/addresses', [AlamatUserController::class, 'store']);
    Route::put('/user/addresses/{id}', [AlamatUserController::class, 'update']);
    Route::delete('/user/addresses/{id}', [AlamatUserController::class, 'destroy']);
    Route::put('/user/addresses/{id}/primary', [AlamatUserController::class, 'setPrimary']);
    
    // Store Address Management
    Route::get('/toko/addresses', [AlamatTokoController::class, 'index']);
    Route::get('/toko/addresses/{id}', [AlamatTokoController::class, 'show']);
    Route::post('/toko/addresses', [AlamatTokoController::class, 'store']);
    Route::put('/toko/addresses/{id}', [AlamatTokoController::class, 'update']);
    Route::delete('/toko/addresses/{id}', [AlamatTokoController::class, 'destroy']);
    Route::patch('/toko/addresses/{id}/primary', [AlamatTokoController::class, 'setPrimary']);

    // Purchase Management
    Route::prefix('purchases')->group(function() {
        Route::get('/', [PembelianController::class, 'index']);
        Route::post('/', [PembelianController::class, 'store']);
        Route::get('/{kode}', [PembelianController::class, 'show']);
        Route::post('/{kode}/checkout', [PembelianController::class, 'checkout']);
        Route::post('/{kode}/multi-checkout', [PembelianController::class, 'multiCheckout']); // Add multi-checkout route here
        Route::put('/{kode}/cancel', [PembelianController::class, 'cancel']);
        Route::put('/{kode}/confirm-delivery', [PembelianController::class, 'confirmDelivery']); // Add this new route
        
        // Purchase Details Management
        Route::get('/{kode}/items', [DetailPembelianController::class, 'index']);
        Route::post('/{kode}/items', [DetailPembelianController::class, 'store']);
        Route::get('/{kode}/items/{id}', [DetailPembelianController::class, 'show']);
        Route::put('/{kode}/items/{id}', [DetailPembelianController::class, 'update']);
        Route::delete('/{kode}/items/{id}', [DetailPembelianController::class, 'destroy']);
    });
    
    // Payment Management
    Route::prefix('payments')->group(function() {
        Route::get('/', [TagihanController::class, 'getAll']); 
        Route::get('/{kode}', [TagihanController::class, 'show']);
        Route::post('/{kode}/process', [TagihanController::class, 'processPayment']);
        Route::get('/{kode}/status', [TagihanController::class, 'checkStatus']);
    });

    // Cart Management
    Route::prefix('cart')->group(function() {
        Route::get('/', [KeranjangController::class, 'index']);
        Route::post('/', [KeranjangController::class, 'store']);
        Route::put('/{id}', [KeranjangController::class, 'update']);
        Route::delete('/{id}', [KeranjangController::class, 'destroy']);
        Route::post('/select-all', [KeranjangController::class, 'selectAll']);
        Route::post('/checkout', [KeranjangController::class, 'checkout']);
        Route::post('/buy-now', [KeranjangController::class, 'buyNow']);
    });

    // Seller Order Management Routes
    Route::middleware(['auth:sanctum', 'verified'])->prefix('seller')->group(function () {
        // List all orders for seller's shop
        Route::get('/orders', [PesananTokoController::class, 'index']);
        
        // Get order statistics
        Route::get('/orders/stats', [PesananTokoController::class, 'getOrderStats']);
        
        // Get individual order details
        Route::get('/orders/{kode}', [PesananTokoController::class, 'show']);
        
        // Confirm receipt of the order and move to 'Diproses' status
        Route::post('/orders/{kode}/confirm', [PesananTokoController::class, 'confirmOrder']);
        
        // Ship an order and add shipping information
        Route::post('/orders/{kode}/ship', [PesananTokoController::class, 'shipOrder']);
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
            Route::get('/filter', [BarangManagementController::class, 'filter']);
            Route::get('/categories', [BarangManagementController::class, 'getCategories']);
            Route::get('/{id}', [BarangManagementController::class, 'show'])->where('id', '[0-9]+');
            Route::get('/slug/{slug}', [BarangManagementController::class, 'showBySlug']);
            Route::put('/{id}', [BarangManagementController::class, 'update'])->where('id', '[0-9]+');
            Route::put('/{id}/soft-delete', [BarangManagementController::class, 'softDelete'])->where('id', '[0-9]+');
            Route::put('/{id}/restore', [BarangManagementController::class, 'restore'])->where('id', '[0-9]+');
            Route::delete('/{id}', [BarangManagementController::class, 'destroy'])->where('id', '[0-9]+');
        });

        // Admin order management
        Route::prefix('admin/pesanan')->group(function() {
            Route::get('/', [PesananManagementController::class, 'index']);
            Route::get('/stats', [PesananManagementController::class, 'getOrderStats']);
            Route::get('/{kode}', [PesananManagementController::class, 'show']);
            Route::put('/{kode}/status', [PesananManagementController::class, 'updateStatus']);
            Route::post('/{kode}/comment', [PesananManagementController::class, 'addComment']);
        });

        // Admin payment management
        Route::prefix('admin/payments')->group(function() {
            Route::get('/', [PaymentManagementController::class, 'index']);
            Route::get('/stats', [PaymentManagementController::class, 'getPaymentStats']);
            Route::get('/{kode}', [PaymentManagementController::class, 'show']);
            Route::put('/{kode}/status', [PaymentManagementController::class, 'updateStatus']);
            Route::post('/{kode}/refund', [PaymentManagementController::class, 'processRefund']);
            Route::post('/{kode}/verify', [PaymentManagementController::class, 'verifyManually']);
        });
    });

    // Debug endpoints
    Route::middleware('auth:sanctum')->group(function() {
        // Debug endpoint to check purchase details directly
        Route::get('/debug/purchases/{kode}', function($kode) {
            $user = auth()->user();
            
            // Check if purchase exists
            $purchase = \App\Models\Pembelian::where('kode_pembelian', $kode)
                ->where('id_pembeli', $user->id_user)
                ->first();
            
            if (!$purchase) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Purchase not found'
                ], 404);
            }
            
            // Check if detail pembelian exists
            $details = \App\Models\DetailPembelian::where('id_pembelian', $purchase->id_pembelian)
                ->with(['barang.gambarBarang', 'toko'])
                ->get();
            
            return response()->json([
                'status' => 'success',
                'purchase' => $purchase,
                'details_count' => $details->count(),
                'details' => $details
            ]);
        });

        // New debug endpoint to fetch purchase by ID
        Route::get('/debug/purchases/by-id/{id}', function($id) {
            $user = auth()->user();
            
            // Check if purchase exists
            $purchase = \App\Models\Pembelian::where('id_pembelian', $id)
                ->where('id_pembeli', $user->id_user)
                ->first();
            
            if (!$purchase) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Purchase not found'
                ], 404);
            }
            
            // Check if detail pembelian exists
            $details = \App\Models\DetailPembelian::where('id_pembelian', $purchase->id_pembelian)
                ->with(['barang.gambarBarang', 'toko'])
                ->get();
            
            return response()->json([
                'status' => 'success',
                'purchase' => $purchase,
                'details_count' => $details->count(),
                'details' => $details
            ]);
        });

        // Debug routes for payment
        Route::get('/debug/midtrans-config', [App\Http\Controllers\User\TagihanController::class, 'debugMidtransConfig']);
    });
});