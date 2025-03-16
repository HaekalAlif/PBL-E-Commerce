<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class KategoriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kategori = Kategori::where('is_deleted', false)->get();

        return response()->json([
            'status' => 'success',
            'data' => $kategori
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_kategori' => 'required|string|max:255',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 422);
        }

        try {
            $kategori = new Kategori();
            $kategori->nama_kategori = $request->nama_kategori;
            $kategori->slug = Str::slug($request->nama_kategori);
            $kategori->is_active = $request->has('is_active') ? $request->is_active : true;
            $kategori->created_by = Auth::id();
            $kategori->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Kategori berhasil dibuat',
                'data' => $kategori
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat kategori: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $kategori = Kategori::find($id);

        if (!$kategori || $kategori->is_deleted) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kategori tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $kategori
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'nama_kategori' => 'required|string|max:255',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 422);
        }

        try {
            $kategori = Kategori::find($id);

            if (!$kategori || $kategori->is_deleted) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Kategori tidak ditemukan'
                ], 404);
            }

            $kategori->nama_kategori = $request->nama_kategori;
            $kategori->slug = Str::slug($request->nama_kategori);
            $kategori->is_active = $request->has('is_active') ? $request->is_active : $kategori->is_active;
            $kategori->updated_by = Auth::id();
            $kategori->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Kategori berhasil diperbarui',
                'data' => $kategori
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui kategori: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Soft delete the specified resource.
     */
    public function destroy(string $id)
    {
        try {
            $kategori = Kategori::find($id);

            if (!$kategori || $kategori->is_deleted) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Kategori tidak ditemukan'
                ], 404);
            }

            $kategori->is_deleted = true;
            $kategori->updated_by = Auth::id();
            $kategori->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Kategori berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus kategori: ' . $e->getMessage()
            ], 500);
        }
    }
}
