<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AlamatUser;
use App\Models\Province;
use App\Models\Regency;
use App\Models\District;
use App\Models\Village;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AlamatUserController extends Controller
{
    /**
     * Get addresses for authenticated user
     * 
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $userId = Auth::user()->id_user;
        $addresses = AlamatUser::where('id_user', $userId)->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $addresses
        ]);
    }

    /**
     * Get a specific address
     * 
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $userId = Auth::user()->id_user;
        $address = AlamatUser::where('id_alamat', $id)
            ->where('id_user', $userId)
            ->first();
            
        if (!$address) {
            return response()->json([
                'status' => 'error',
                'message' => 'Address not found or not authorized'
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $address
        ]);
    }

    /**
     * Create a new address
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_penerima' => 'required|string|max:255',
            'no_telepon' => 'required|string|max:20',
            'alamat_lengkap' => 'required|string',
            'provinsi' => 'required|string|exists:provinces,id',
            'kota' => 'required|string|exists:regencies,id',
            'kecamatan' => 'required|string|exists:districts,id',
            'kode_pos' => 'required|string|max:10',
            'is_primary' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $userId = Auth::user()->id_user;
        
        // If is_primary is true, unset any existing primary address
        if ($request->input('is_primary', false)) {
            AlamatUser::where('id_user', $userId)
                ->where('is_primary', true)
                ->update(['is_primary' => false]);
        }
        
        $address = new AlamatUser();
        $address->id_user = $userId;
        $address->nama_penerima = $request->nama_penerima;
        $address->no_telepon = $request->no_telepon;
        $address->alamat_lengkap = $request->alamat_lengkap;
        $address->provinsi = $request->provinsi;
        $address->kota = $request->kota;
        $address->kecamatan = $request->kecamatan;
        $address->kode_pos = $request->kode_pos;
        $address->is_primary = $request->input('is_primary', false);
        $address->save();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Address created successfully',
            'data' => $address
        ], 201);
    }

    /**
     * Update an address
     * 
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $userId = Auth::user()->id_user;
        $address = AlamatUser::where('id_alamat', $id)
            ->where('id_user', $userId)
            ->first();
            
        if (!$address) {
            return response()->json([
                'status' => 'error',
                'message' => 'Address not found or not authorized'
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'nama_penerima' => 'string|max:255',
            'no_telepon' => 'string|max:20',
            'alamat_lengkap' => 'string',
            'provinsi' => 'string|exists:provinces,id',
            'kota' => 'string|exists:regencies,id',
            'kecamatan' => 'string|exists:districts,id',
            'kode_pos' => 'string|max:10',
            'is_primary' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // If is_primary is true, unset any existing primary address
        if ($request->has('is_primary') && $request->is_primary) {
            AlamatUser::where('id_user', $userId)
                ->where('id_alamat', '!=', $id)
                ->where('is_primary', true)
                ->update(['is_primary' => false]);
        }
        
        $address->fill($request->only([
            'nama_penerima', 
            'no_telepon',
            'alamat_lengkap',
            'provinsi',
            'kota',
            'kecamatan',
            'kode_pos',
            'is_primary'
        ]));
        
        $address->save();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Address updated successfully',
            'data' => $address
        ]);
    }

    /**
     * Delete an address
     * 
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $userId = Auth::user()->id_user;
        $address = AlamatUser::where('id_alamat', $id)
            ->where('id_user', $userId)
            ->first();
            
        if (!$address) {
            return response()->json([
                'status' => 'error',
                'message' => 'Address not found or not authorized'
            ], 404);
        }
        
        $address->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Address deleted successfully'
        ]);
    }

    /**
     * Set address as primary
     * 
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function setPrimary($id)
    {
        $userId = Auth::user()->id_user;
        $address = AlamatUser::where('id_alamat', $id)
            ->where('id_user', $userId)
            ->first();
            
        if (!$address) {
            return response()->json([
                'status' => 'error',
                'message' => 'Address not found or not authorized'
            ], 404);
        }
        
        // Unset any existing primary address
        AlamatUser::where('id_user', $userId)
            ->where('is_primary', true)
            ->update(['is_primary' => false]);
        
        // Set this address as primary
        $address->is_primary = true;
        $address->save();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Address set as primary successfully',
            'data' => $address
        ]);
    }
}
