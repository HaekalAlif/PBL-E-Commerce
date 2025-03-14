<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Toko;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TokoController extends Controller
{
    /**
     * Get user's store
     */
    public function getMyStore()
    {
        $toko = Toko::where('id_user', Auth::id())
                    ->where('is_deleted', false)
                    ->first();
        
        if (!$toko) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $toko
        ]);
    }

    /**
     * Create a new store
     */
    public function store(Request $request)
    {
        // Log the request for debugging
        \Log::info('Creating store with data:', $request->all());

        // Check if user already has a store
        $existingToko = Toko::where('id_user', Auth::id())
                           ->where('is_deleted', false)
                           ->first();
        
        if ($existingToko) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah memiliki toko'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'nama_toko' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'alamat' => 'required|string|max:255',
            'kontak' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        $toko = Toko::create([
            'id_user' => Auth::id(),
            'nama_toko' => $request->nama_toko,
            'deskripsi' => $request->deskripsi,
            'alamat' => $request->alamat,
            'kontak' => $request->kontak,
            'is_active' => true,
            'is_deleted' => false,
            'created_by' => Auth::id(),
            'updated_by' => Auth::id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Toko berhasil dibuat',
            'data' => $toko
        ], 201);
    }

    /**
     * Update user's store
     */
    public function update(Request $request)
    {
        $toko = Toko::where('id_user', Auth::id())
                    ->where('is_deleted', false)
                    ->first();

        if (!$toko) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_toko' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|string',
            'alamat' => 'sometimes|string|max:255',
            'kontak' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        $toko->fill($request->only([
            'nama_toko',
            'deskripsi',
            'alamat',
            'kontak'
        ]));
        
        $toko->updated_by = Auth::id();
        $toko->save();

        return response()->json([
            'success' => true,
            'message' => 'Toko berhasil diperbarui',
            'data' => $toko
        ]);
    }

    /**
     * Delete user's store (soft delete)
     */
    public function destroy()
    {
        $toko = Toko::where('id_user', Auth::id())
                    ->where('is_deleted', false)
                    ->first();

        if (!$toko) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan'
            ], 404);
        }

        $toko->is_deleted = true;
        $toko->is_active = false;
        $toko->updated_by = Auth::id();
        $toko->save();

        return response()->json([
            'success' => true,
            'message' => 'Toko berhasil dihapus'
        ]);
    }
}
