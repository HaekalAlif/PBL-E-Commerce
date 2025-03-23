<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Keranjang;
use App\Models\Barang;

class KeranjangController extends Controller
{
    /**
     * Display cart items for the authenticated user
     */
    public function index()
    {
        $user = Auth::user();
        
        $cartItems = Keranjang::where('id_user', $user->id_user)
            ->with(['barang.gambarBarang', 'barang.toko'])
            ->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $cartItems
        ]);
    }
    
    /**
     * Add item to cart
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        // Validate request
        $validator = Validator::make($request->all(), [
            'id_barang' => 'required|exists:barang,id_barang',
            'jumlah' => 'required|integer|min:1',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Check if product exists and is available
        $barang = Barang::findOrFail($request->id_barang);
        
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
        
        // Check if item already exists in cart
        $existingItem = Keranjang::where('id_user', $user->id_user)
            ->where('id_barang', $request->id_barang)
            ->first();
        
        if ($existingItem) {
            // Update existing cart item
            $newQuantity = $existingItem->jumlah + $request->jumlah;
            
            // Check if new quantity exceeds stock
            if ($newQuantity > $barang->stok) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Total jumlah melebihi stok yang tersedia'
                ], 400);
            }
            
            $existingItem->jumlah = $newQuantity;
            $existingItem->save();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Jumlah produk dalam keranjang diperbarui',
                'data' => $existingItem
            ]);
        } else {
            // Create new cart item
            $cartItem = new Keranjang();
            $cartItem->id_user = $user->id_user;
            $cartItem->id_barang = $request->id_barang;
            $cartItem->jumlah = $request->jumlah;
            $cartItem->is_selected = false;
            $cartItem->save();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Produk berhasil ditambahkan ke keranjang',
                'data' => $cartItem
            ], 201);
        }
    }
    
    /**
     * Update cart item (quantity or selection status)
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        
        // Find cart item
        $cartItem = Keranjang::where('id_keranjang', $id)
            ->where('id_user', $user->id_user)
            ->first();
        
        if (!$cartItem) {
            return response()->json([
                'status' => 'error',
                'message' => 'Item tidak ditemukan dalam keranjang'
            ], 404);
        }
        
        // Validate request
        $validator = Validator::make($request->all(), [
            'jumlah' => 'sometimes|required|integer|min:1',
            'is_selected' => 'sometimes|required|boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Update quantity if provided
        if ($request->has('jumlah')) {
            // Check stock availability
            $barang = Barang::findOrFail($cartItem->id_barang);
            
            if ($barang->stok < $request->jumlah) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Jumlah melebihi stok yang tersedia'
                ], 400);
            }
            
            $cartItem->jumlah = $request->jumlah;
        }
        
        // Update selection status if provided
        if ($request->has('is_selected')) {
            $cartItem->is_selected = $request->is_selected;
        }
        
        $cartItem->save();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Item keranjang berhasil diperbarui',
            'data' => $cartItem
        ]);
    }
    
    /**
     * Remove item from cart
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        // Find cart item
        $cartItem = Keranjang::where('id_keranjang', $id)
            ->where('id_user', $user->id_user)
            ->first();
        
        if (!$cartItem) {
            return response()->json([
                'status' => 'error',
                'message' => 'Item tidak ditemukan dalam keranjang'
            ], 404);
        }
        
        $cartItem->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Item berhasil dihapus dari keranjang'
        ]);
    }
    
    /**
     * Select all items in cart
     */
    public function selectAll(Request $request)
    {
        $user = Auth::user();
        
        $select = $request->has('select') ? $request->select : true;
        
        Keranjang::where('id_user', $user->id_user)
            ->update(['is_selected' => $select]);
        
        return response()->json([
            'status' => 'success',
            'message' => $select ? 'Semua item dipilih' : 'Semua item tidak dipilih'
        ]);
    }
    
    /**
     * Create purchase from selected cart items
     */
    public function checkout(Request $request)
    {
        $user = Auth::user();
        
        // Validate request
        $validator = Validator::make($request->all(), [
            'id_alamat' => 'required|exists:alamat_user,id_alamat',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Get selected cart items
        $selectedItems = Keranjang::where('id_user', $user->id_user)
            ->where('is_selected', true)
            ->with('barang')
            ->get();
        
        if ($selectedItems->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak ada item yang dipilih untuk checkout'
            ], 400);
        }
        
        // Check if all selected items are still available and have enough stock
        foreach ($selectedItems as $item) {
            $barang = $item->barang;
            
            if ($barang->status_barang != 'Tersedia' || $barang->is_deleted) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Produk '{$barang->nama_barang}' tidak tersedia"
                ], 400);
            }
            
            if ($barang->stok < $item->jumlah) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Stok produk '{$barang->nama_barang}' tidak mencukupi"
                ], 400);
            }
        }
        
        // Create a new purchase
        $pembelian = \App\Models\Pembelian::create([
            'id_pembeli' => $user->id_user,
            'id_alamat' => $request->id_alamat,
            'kode_pembelian' => \App\Models\Pembelian::generateKodePembelian(),
            'status_pembelian' => 'Draft',
            'is_deleted' => false,
            'created_by' => $user->id_user
        ]);
        
        // Create purchase details from selected cart items
        foreach ($selectedItems as $item) {
            \App\Models\DetailPembelian::create([
                'id_pembelian' => $pembelian->id_pembelian,
                'id_barang' => $item->id_barang,
                'id_toko' => $item->barang->id_toko,
                'harga_satuan' => $item->barang->harga,
                'jumlah' => $item->jumlah,
                'subtotal' => $item->barang->harga * $item->jumlah
            ]);
        }
        
        // Remove selected items from cart
        Keranjang::where('id_user', $user->id_user)
            ->where('is_selected', true)
            ->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Checkout berhasil',
            'data' => [
                'kode_pembelian' => $pembelian->kode_pembelian,
                'id_pembelian' => $pembelian->id_pembelian
            ]
        ], 201);
    }
    
    /**
     * Buy Now - Add item to cart and immediately checkout
     * This combines add to cart + checkout in one operation
     */
    public function buyNow(Request $request)
    {
        $user = Auth::user();
        
        // Validate request
        $validator = Validator::make($request->all(), [
            'id_barang' => 'required_without:product_slug|exists:barang,id_barang',
            'product_slug' => 'required_without:id_barang|string',
            'jumlah' => 'required|integer|min:1',
            'id_alamat' => 'required|exists:alamat_user,id_alamat',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Find product by ID or slug
        $barang = null;
        if ($request->has('id_barang')) {
            $barang = Barang::findOrFail($request->id_barang);
        } else {
            $barang = Barang::where('slug', $request->product_slug)->firstOrFail();
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
        
        // Clear any previously selected items
        Keranjang::where('id_user', $user->id_user)
            ->update(['is_selected' => false]);
        
        // Check if item already exists in cart
        $existingItem = Keranjang::where('id_user', $user->id_user)
            ->where('id_barang', $barang->id_barang)
            ->first();
        
        if ($existingItem) {
            // Update quantity and mark as selected
            $existingItem->jumlah = $request->jumlah; // Set to exactly what was requested
            $existingItem->is_selected = true;
            $existingItem->save();
        } else {
            // Add new item to cart and mark as selected
            $cartItem = new Keranjang();
            $cartItem->id_user = $user->id_user;
            $cartItem->id_barang = $barang->id_barang;
            $cartItem->jumlah = $request->jumlah;
            $cartItem->is_selected = true;
            $cartItem->save();
        }
        
        // Create a new purchase directly from cart
        $pembelian = \App\Models\Pembelian::create([
            'id_pembeli' => $user->id_user,
            'id_alamat' => $request->id_alamat,
            'kode_pembelian' => \App\Models\Pembelian::generateKodePembelian(),
            'status_pembelian' => 'Draft',
            'is_deleted' => false,
            'created_by' => $user->id_user
        ]);
        
        // Create purchase detail
        \App\Models\DetailPembelian::create([
            'id_pembelian' => $pembelian->id_pembelian,
            'id_barang' => $barang->id_barang,
            'id_toko' => $barang->id_toko,
            'harga_satuan' => $barang->harga,
            'jumlah' => $request->jumlah,
            'subtotal' => $barang->harga * $request->jumlah
        ]);
        
        // Optional: keep item in cart for future purchases
        // If you want to remove it from cart after checkout, uncomment this:
        /*
        Keranjang::where('id_user', $user->id_user)
            ->where('id_barang', $barang->id_barang)
            ->delete();
        */
        
        return response()->json([
            'status' => 'success',
            'message' => 'Buy Now successful',
            'data' => [
                'kode_pembelian' => $pembelian->kode_pembelian,
                'id_pembelian' => $pembelian->id_pembelian
            ]
        ], 201);
    }
}
