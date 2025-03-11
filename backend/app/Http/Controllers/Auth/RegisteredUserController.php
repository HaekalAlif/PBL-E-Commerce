<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'no_hp' => ['required', 'string', 'max:20'],
            'tanggal_lahir' => ['required', 'date'],
        ]);

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'no_hp' => $request->no_hp,
            'tanggal_lahir' => $request->tanggal_lahir,
            'role' => 2, // default role for new users
            'poin_reputasi' => 0,
            'is_verified' => false,
            'is_active' => true,
            'is_deleted' => false,
        ]);

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Registration successful',
            'data' => [
                'user' => [
                    'id_user' => $user->id_user,
                    'username' => $user->username,
                    'email' => $user->email,
                    'no_hp' => $user->no_hp,
                    'tanggal_lahir' => $user->tanggal_lahir,
                    'role' => $user->role,
                    'role_name' => $this->getRoleName($user->role)
                ],
                'token' => $token
            ]
        ], 201);
    }

    private function getRoleName($role)
    {
        return match ($role) {
            0 => 'superadmin',
            1 => 'admin',
            2 => 'user',
            default => 'Unknown'
        };
    }
}
