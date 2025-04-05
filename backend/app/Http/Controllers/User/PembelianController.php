<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Pembelian;
use App\Models\DetailPembelian;
use App\Models\Tagihan;
use App\Models\Barang;
use App\Models\AlamatUser;
use Carbon\Carbon;
use Illuminate\Support\Str;

class PembelianController extends Controller
{
    /**
     * Display a listing of purchases for the authenticated user
     */
    public function index()
    {
        try {
            $user = Auth::user();
            
            // Query purchases with eager loading
            $purchases = Pembelian::where('id_pembeli', $user->id_user)
                ->with([
                    'alamat',
                    'detailPembelian.barang.gambarBarang',
                    'tagihan'
                ])
                ->orderBy('created_at', 'desc')
                ->get();
            
            // Ensure $purchases is always an array even if empty
            $result = $purchases->toArray();
            
            // Log the number of purchases for debugging
            \Log::info('User purchases fetched', [
                'user_id' => $user->id_user,
                'count' => count($result)
            ]);
            
            return response()->json([
                'status' => 'success',
                'data' => $result // Ensure we're returning an array
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching purchases: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to load purchases: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Show purchase details by code
     */
    public function show($kode)
    {
        $user = Auth::user();
        
        // Debug the incoming code parameter
        \Log::debug('Fetching purchase with code: ' . $kode);
        
        // First, check if the purchase exists with this code
        $pembelian = Pembelian::where('kode_pembelian', $kode)
            ->where('id_pembeli', $user->id_user)
            ->where('is_deleted', false)
            ->first();
        
        if (!$pembelian) {
            \Log::error('Purchase not found with code: ' . $kode);
            return response()->json([
                'status' => 'error',
                'message' => 'Pembelian tidak ditemukan'
            ], 404);
        }
        
        // Now that we confirmed it exists, get all related data
        \Log::debug('Found purchase with ID: ' . $pembelian->id_pembelian);
        
        // Check if detail pembelian exists for this purchase
        $detailCount = DetailPembelian::where('id_pembelian', $pembelian->id_pembelian)->count();
        \Log::debug('Detail pembelian count in database: ' . $detailCount);
        
        if ($detailCount === 0) {
            \Log::error('No detail pembelian found for purchase ID: ' . $pembelian->id_pembelian);
            return response()->json([
                'status' => 'error',
                'message' => 'Data detail pembelian tidak ditemukan'
            ], 404);
        }
        
        // Load the purchase with all its related data - improved eager loading
        $completeData = Pembelian::with([
                'detailPembelian',
                'detailPembelian.barang',
                'detailPembelian.barang.gambarBarang',
                'detailPembelian.toko',
                'tagihan',
                'alamat.province',
                'alamat.regency',
                'alamat.district',
                'alamat.village'
            ])
            ->where('id_pembelian', $pembelian->id_pembelian)
            ->first();
            
        if (!$completeData) {
            \Log::error('Failed to load complete purchase data for ID: ' . $pembelian->id_pembelian);
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memuat data pembelian lengkap'
            ], 500);
        }
        
        // Debug the loaded data structure
        \Log::debug('Detail pembelian count in loaded data: ' . count($completeData->detailPembelian));
        
        // Ensure we have detail pembelian data
        if (count($completeData->detailPembelian) === 0) {
            \Log::error('DetailPembelian relationship loaded but empty for purchase ID: ' . $pembelian->id_pembelian);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $completeData
        ]);
    }
    
    /**
     * Create a new purchase (direct buy)
     * Fixed to prevent creating empty orders
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        // Validate request
        $validator = Validator::make($request->all(), [
            // Accept either id_barang or product_slug
            'id_barang' => 'required_without:product_slug|exists:barang,id_barang',
            'product_slug' => 'required_without:id_barang|string',
            'jumlah' => 'required|integer|min:1',
            'id_alamat' => 'required|exists:alamat_user,id_alamat',
            'catatan_pembeli' => 'nullable|string'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Get the product by ID or slug - with improved logging
        $barang = null;
        try {
            if ($request->has('id_barang')) {
                $barang = Barang::findOrFail($request->id_barang);
                \Log::info('Product found by ID', ['id' => $request->id_barang, 'name' => $barang->nama_barang]);
            } else {
                $barang = Barang::where('slug', $request->product_slug)->firstOrFail();
                \Log::info('Product found by slug', ['slug' => $request->product_slug, 'name' => $barang->nama_barang]);
            }
        } catch (\Exception $e) {
            \Log::error('Product not found', [
                'id' => $request->id_barang, 
                'slug' => $request->product_slug,
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Produk tidak ditemukan'
            ], 404);
        }
        
        // Check if product is available
        if ($barang->status_barang != 'Tersedia' || $barang->is_deleted) {
            return response()->json([
                'status' => 'error',
                'message' => 'Produk tidak tersedia'
            ], 400);
        }
        
        // Check stock availability
        if ($barang->stok < $request->jumlah) {
            return response()->json([
                'status' => 'error',
                'message' => 'Stok tidak mencukupi'
            ], 400);
        }
        
        // Check if address belongs to user
        $alamat = AlamatUser::where('id_alamat', $request->id_alamat)
                          ->where('id_user', $user->id_user)
                          ->first();
        
        if (!$alamat) {
            return response()->json([
                'status' => 'error',
                'message' => 'Alamat tidak valid'
            ], 400);
        }
        
        DB::beginTransaction();
        try {
            \Log::info('Creating purchase for product', [
                'product' => $barang->nama_barang,
                'quantity' => $request->jumlah
            ]);
            
            // Create purchase
            $pembelian = new Pembelian();
            $pembelian->id_pembeli = $user->id_user;
            $pembelian->id_alamat = $request->id_alamat;
            $pembelian->kode_pembelian = Pembelian::generateKodePembelian();
            $pembelian->status_pembelian = 'Draft';
            $pembelian->catatan_pembeli = $request->catatan_pembeli;
            $pembelian->is_deleted = false;
            $pembelian->created_by = $user->id_user;
            $pembelian->save();
            
            \Log::info('Purchase created', [
                'purchase_code' => $pembelian->kode_pembelian,
                'purchase_id' => $pembelian->id_pembelian
            ]);
            
            // Create purchase detail
            $detail = new DetailPembelian();
            $detail->id_pembelian = $pembelian->id_pembelian;
            $detail->id_barang = $barang->id_barang;
            $detail->id_toko = $barang->id_toko;
            $detail->harga_satuan = $barang->harga;
            $detail->jumlah = $request->jumlah;
            $detail->subtotal = $barang->harga * $request->jumlah;
            $detail->save();
            
            \Log::info('Purchase detail created', [
                'detail_id' => $detail->id_detail_pembelian
            ]);
            
            // Double-check that purchase details were created successfully
            $detailCount = DetailPembelian::where('id_pembelian', $pembelian->id_pembelian)->count();
            
            if ($detailCount === 0) {
                // If no details were created, roll back the transaction
                \Log::error('No purchase details were created for purchase ID: ' . $pembelian->id_pembelian);
                DB::rollback();
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to create purchase details'
                ], 500);
            }
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Pembelian berhasil dibuat',
                'data' => [
                    'kode_pembelian' => $pembelian->kode_pembelian,
                    'id_pembelian' => $pembelian->id_pembelian
                ]
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Error creating purchase', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Process checkout for the purchase
     */
    public function checkout(Request $request, $kode)
    {
        $user = Auth::user();
        
        $pembelian = Pembelian::where('kode_pembelian', $kode)
                           ->where('id_pembeli', $user->id_user)
                           ->where('status_pembelian', 'Draft')
                           ->with('detailPembelian.barang', 'alamat')
                           ->first();
        
        if (!$pembelian) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pembelian tidak ditemukan atau sudah diproses'
            ], 404);
        }
        
        // Validate checkout data
        $validator = Validator::make($request->all(), [
            'opsi_pengiriman' => 'required|string',
            'biaya_kirim' => 'required|numeric|min:0',
            'metode_pembayaran' => 'required|string'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Check if products are still available and have enough stock before checkout
        foreach ($pembelian->detailPembelian as $detail) {
            $barang = $detail->barang;
            
            // Check if product is still available
            if ($barang->status_barang != 'Tersedia' || $barang->is_deleted) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Produk ' . $barang->nama_barang . ' tidak tersedia lagi'
                ], 400);
            }
            
            // Check if there's enough stock
            if ($barang->stok < $detail->jumlah) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Stok produk ' . $barang->nama_barang . ' tidak mencukupi. Tersedia: ' . $barang->stok
                ], 400);
            }
        }
        
        DB::beginTransaction();
        try {
            // Calculate total product price
            $totalHarga = 0;
            foreach ($pembelian->detailPembelian as $detail) {
                $totalHarga += $detail->subtotal;
                
                // IMPORTANT: Removed stock reduction logic from here
                // We'll only reduce stock after payment is confirmed
            }
            
            // Set admin fee (you can adjust this as needed)
            $biayaAdmin = 1000; // Fixed admin fee of Rp 1.000
            
            // Calculate total invoice amount
            $totalTagihan = $totalHarga + $request->biaya_kirim + $biayaAdmin;
            
            // Update purchase status
            $pembelian->status_pembelian = 'Menunggu Pembayaran';
            $pembelian->updated_by = $user->id_user;
            $pembelian->save();
            
            // Create invoice
            $tagihan = new Tagihan();
            $tagihan->id_pembelian = $pembelian->id_pembelian;
            $tagihan->kode_tagihan = Tagihan::generateKodeTagihan();
            $tagihan->total_harga = $totalHarga;
            $tagihan->biaya_kirim = $request->biaya_kirim;
            $tagihan->opsi_pengiriman = $request->opsi_pengiriman;
            $tagihan->biaya_admin = $biayaAdmin;
            $tagihan->total_tagihan = $totalTagihan;
            $tagihan->metode_pembayaran = $request->metode_pembayaran;
            $tagihan->status_pembayaran = 'Menunggu';
            $tagihan->setPaymentDeadline(24); // Set 24 hours payment deadline
            $tagihan->save();
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Checkout berhasil',
                'data' => [
                    'id_tagihan' => $tagihan->id_tagihan,
                    'kode_tagihan' => $tagihan->kode_tagihan,
                    'total_tagihan' => $tagihan->total_tagihan,
                    'deadline_pembayaran' => $tagihan->deadline_pembayaran
                ]
            ]);
            
        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat checkout: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Process checkout for multiple stores in single purchase
     * Uses existing Tagihan model instead of MultiTagihan
     * Fixed to prevent creating empty orders
     */
    public function multiCheckout(Request $request, $kode)
    {
        $user = Auth::user();
        
        $pembelian = Pembelian::where('kode_pembelian', $kode)
                           ->where('id_pembeli', $user->id_user)
                           ->where('status_pembelian', 'Draft')
                           ->with(['detailPembelian.barang', 'detailPembelian.toko'])
                           ->first();
        
        if (!$pembelian) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pembelian tidak ditemukan atau sudah diproses'
            ], 404);
        }
        
        // Verify the original purchase has detail items
        if ($pembelian->detailPembelian->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Purchase has no items'
            ], 400);
        }
        
        // Validate checkout data
        $validator = Validator::make($request->all(), [
            'stores' => 'required|array',
            'stores.*.id_toko' => 'required|exists:toko,id_toko',
            'stores.*.id_alamat' => 'required|exists:alamat_user,id_alamat',
            'stores.*.opsi_pengiriman' => 'required|string',
            'stores.*.biaya_kirim' => 'required|numeric|min:0',
            'stores.*.catatan_pembeli' => 'nullable|string',
            'metode_pembayaran' => 'required|string'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Group details by store
        $detailsByStore = collect($pembelian->detailPembelian)->groupBy('id_toko');
        
        // Check if all stores from the purchase are included in the request
        $requestStoreIds = collect($request->stores)->pluck('id_toko')->toArray();
        $purchaseStoreIds = $detailsByStore->keys()->toArray();
        
        $missingStores = array_diff($purchaseStoreIds, $requestStoreIds);
        if (!empty($missingStores)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Not all stores from the purchase are included in checkout configuration'
            ], 400);
        }
        
        // Check if products are still available and have enough stock
        foreach ($pembelian->detailPembelian as $detail) {
            $barang = $detail->barang;
            
            // Check if product is still available
            if ($barang->status_barang != 'Tersedia' || $barang->is_deleted) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Produk ' . $barang->nama_barang . ' tidak tersedia lagi'
                ], 400);
            }
            
            // Check if there's enough stock
            if ($barang->stok < $detail->jumlah) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Stok produk ' . $barang->nama_barang . ' tidak mencukupi. Tersedia: ' . $barang->stok
                ], 400);
            }
        }
        
        DB::beginTransaction();
        try {
            // Set admin fee (you can adjust this as needed)
            $biayaAdmin = 1000; // Fixed admin fee of Rp 1.000
            
            // Split the original purchase by store
            $storePurchases = [];
            $invoices = [];
            $totalAllPurchases = 0;
            $firstTagihan = null;
            
            // Generate a group ID to identify related orders
            $groupId = 'GRP' . time() . rand(1000, 9999);
            
            // Create a counter to track successfully created store purchases
            $successfulPurchases = 0;
            
            // Process each store
            foreach ($request->stores as $storeConfig) {
                $storeId = $storeConfig['id_toko'];
                
                // Get details for this store
                $storeDetails = $detailsByStore->get($storeId);
                
                if (!$storeDetails || $storeDetails->isEmpty()) {
                    \Log::warning('No details found for store ID: ' . $storeId);
                    continue; // Skip if no details for this store
                }
                
                // Create a new purchase for this store
                $storePurchase = new Pembelian();
                $storePurchase->id_pembeli = $user->id_user;
                $storePurchase->id_alamat = $storeConfig['id_alamat'];
                $storePurchase->kode_pembelian = Pembelian::generateKodePembelian();
                $storePurchase->status_pembelian = 'Menunggu Pembayaran';
                $storePurchase->catatan_pembeli = $storeConfig['catatan_pembeli'] ?? null;
                $storePurchase->is_deleted = false;
                $storePurchase->created_by = $user->id_user;
                $storePurchase->save();
                
                // Calculate store totals
                $storeTotalHarga = 0;
                $detailsCreated = 0;
                
                // Copy details to the new purchase
                foreach ($storeDetails as $detail) {
                    $newDetail = new DetailPembelian();
                    $newDetail->id_pembelian = $storePurchase->id_pembelian;
                    $newDetail->id_barang = $detail->id_barang;
                    $newDetail->id_toko = $detail->id_toko;
                    $newDetail->harga_satuan = $detail->harga_satuan;
                    $newDetail->jumlah = $detail->jumlah;
                    $newDetail->subtotal = $detail->subtotal;
                    $newDetail->save();
                    
                    $detailsCreated++;
                    $storeTotalHarga += $detail->subtotal;
                }
                
                // Verify details were actually created
                if ($detailsCreated === 0) {
                    \Log::error('No details created for purchase ID: ' . $storePurchase->id_pembelian);
                    // Delete the empty purchase
                    $storePurchase->delete();
                    continue; // Skip to the next store
                }
                
                // Create invoice for this store
                $tagihan = new Tagihan();
                $tagihan->id_pembelian = $storePurchase->id_pembelian;
                $tagihan->kode_tagihan = Tagihan::generateKodeTagihan();
                $tagihan->total_harga = $storeTotalHarga;
                $tagihan->biaya_kirim = $storeConfig['biaya_kirim'];
                $tagihan->opsi_pengiriman = $storeConfig['opsi_pengiriman'];
                
                // Add admin fee to first invoice only
                if (empty($invoices)) {
                    $tagihan->biaya_admin = $biayaAdmin;
                    $tagihan->total_tagihan = $storeTotalHarga + $storeConfig['biaya_kirim'] + $biayaAdmin;
                    $firstTagihan = $tagihan;
                } else {
                    $tagihan->biaya_admin = 0;
                    $tagihan->total_tagihan = $storeTotalHarga + $storeConfig['biaya_kirim'];
                }
                
                $tagihan->metode_pembayaran = $request->metode_pembayaran;
                $tagihan->status_pembayaran = 'Menunggu';
                $tagihan->group_id = $groupId; // Set the group ID for related orders
                $tagihan->setPaymentDeadline(24); // Set 24 hours payment deadline
                $tagihan->save();
                
                $successfulPurchases++;
                $storePurchases[] = $storePurchase;
                $invoices[] = $tagihan;
                $totalAllPurchases += $tagihan->total_tagihan;
            }
            
            // If no successful purchases were created, rollback and return error
            if ($successfulPurchases === 0) {
                DB::rollback();
                return response()->json([
                    'status' => 'error',
                    'message' => 'No valid store purchases could be created'
                ], 400);
            }
            
            // IMPORTANT: Instead of setting original purchase to "Diproses", mark it as "Dibatalkan"
            // and is_deleted to true so it doesn't show up in the order list
            $pembelian->status_pembelian = 'Dibatalkan';
            $pembelian->is_deleted = true;  // Set is_deleted to true to hide it completely
            $pembelian->updated_by = $user->id_user;
            $pembelian->save();
            
            DB::commit();
            
            // We'll use the first invoice for payment processing
            // but the payment will apply to all invoices in the group
            return response()->json([
                'status' => 'success',
                'message' => 'Multi-store checkout berhasil',
                'data' => [
                    'kode_tagihan' => $firstTagihan->kode_tagihan,
                    'group_id' => $groupId,
                    'total_tagihan' => $totalAllPurchases,
                    'deadline_pembayaran' => $firstTagihan->deadline_pembayaran,
                    'store_count' => count($storePurchases)
                ]
            ]);
            
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Error during multi-store checkout: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat checkout: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Cancel a purchase
     */
    public function cancel($kode)
    {
        $user = Auth::user();
        
        $pembelian = Pembelian::where('kode_pembelian', $kode)
                           ->where('id_pembeli', $user->id_user)
                           ->first();
        
        if (!$pembelian) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pembelian tidak ditemukan'
            ], 404);
        }
        
        if (!$pembelian->canBeCancelled()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pembelian tidak dapat dibatalkan'
            ], 400);
        }
        
        DB::beginTransaction();
        try {
            // Update purchase status
            $pembelian->status_pembelian = 'Dibatalkan';
            $pembelian->updated_by = $user->id_user;
            $pembelian->save();
            
            // Cancel related invoice if it exists
            $tagihan = $pembelian->tagihan;
            if ($tagihan) {
                $tagihan->status_pembayaran = 'Gagal';
                $tagihan->save();
            }
            
            // We don't need to restore stock anymore since we're not reducing it at checkout
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Pembelian berhasil dibatalkan'
            ]);
            
        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat membatalkan pembelian: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Confirm delivery of an order
     */
    public function confirmDelivery($kode)
    {
        $user = Auth::user();
        
        $pembelian = Pembelian::where('kode_pembelian', $kode)
                           ->where('id_pembeli', $user->id_user)
                           ->where('status_pembelian', 'Dikirim')
                           ->first();
        
        if (!$pembelian) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pembelian tidak ditemukan atau tidak dapat dikonfirmasi'
            ], 404);
        }
        
        DB::beginTransaction();
        try {
            // Update purchase status to 'Selesai'
            $pembelian->status_pembelian = 'Selesai';
            $pembelian->updated_by = $user->id_user;
            $pembelian->save();
            
            // You could add more logic here like triggering seller notification, etc.
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Pengiriman berhasil dikonfirmasi',
                'data' => [
                    'status_pembelian' => $pembelian->status_pembelian
                ]
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengonfirmasi pengiriman: ' . $e->getMessage()
            ], 500);
        }
    }
}
