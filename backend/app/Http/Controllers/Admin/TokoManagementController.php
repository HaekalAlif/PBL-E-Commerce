<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Toko;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TokoManagementController extends Controller
{
    /**
     * Display a listing of the stores.
     */
    public function index(Request $request)
    {
        $query = Toko::with('user');
        
        // Filter by active status if specified
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }
        
        // Filter by deletion status if specified
        if ($request->has('is_deleted')) {
            $query->where('is_deleted', $request->is_deleted);
        } else {
            // By default, show only non-deleted stores
            $query->where('is_deleted', false);
        }
        
        // Search by store name
        if ($request->has('search')) {
            $query->where('nama_toko', 'like', '%' . $request->search . '%');
        }
        
        // Paginate results
        $perPage = $request->per_page ?? 15;
        $toko = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $toko
        ]);
    }

    /**
     * Display the specified store by ID.
     */
    public function show($id)
    {
        $toko = Toko::with('user', 'creator', 'updater')->find($id);
        
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
     * Display the specified store by slug.
     */
    public function showBySlug($slug)
    {
        $toko = Toko::with('user', 'creator', 'updater')
                    ->where('slug', $slug)
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
     * Update the specified store.
     */
    public function update(Request $request, $id)
    {
        $toko = Toko::find($id);
        
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
            'is_active' => 'sometimes|boolean',
            'is_deleted' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }
        
        // If name has changed, update the slug
        if ($request->has('nama_toko') && $request->nama_toko !== $toko->nama_toko) {
            $slug = Str::slug($request->nama_toko);
            
            // Ensure slug is unique
            $originalSlug = $slug;
            $count = 1;
            
            while (Toko::where('slug', $slug)->where('id_toko', '!=', $toko->id_toko)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }
            
            $request->merge(['slug' => $slug]);
        }
        
        $toko->fill($request->only([
            'nama_toko',
            'slug',
            'deskripsi',
            'alamat',
            'kontak',
            'is_active',
            'is_deleted'
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
     * Remove the specified store (hard delete).
     */
    public function destroy($id)
    {
        $toko = Toko::find($id);
        
        if (!$toko) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan'
            ], 404);
        }
        
        // Perform hard delete
        $toko->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Toko berhasil dihapus permanen'
        ]);
    }
    
    /**
     * Soft delete a store
     */
    public function softDelete($id)
    {
        $toko = Toko::find($id);
        
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
    
    /**
     * Restore a soft-deleted store
     */
    public function restore($id)
    {
        $toko = Toko::find($id);
        
        if (!$toko) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan'
            ], 404);
        }
        
        $toko->is_deleted = false;
        $toko->updated_by = Auth::id();
        $toko->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Toko berhasil dipulihkan',
            'data' => $toko
        ]);
    }
}
