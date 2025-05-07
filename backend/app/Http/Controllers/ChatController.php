<?php

namespace App\Http\Controllers;

use App\Models\RuangChat;
use App\Models\Pesan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function createRoom(Request $request)
    {
        $validated = $request->validate([
            'id_barang' => 'required|exists:barang,id_barang',
            'id_penjual' => 'required|exists:users,id_user',
        ]);

        $room = RuangChat::create([
            'id_pembeli' => Auth::id(),
            'id_penjual' => $validated['id_penjual'],
            'id_barang' => $validated['id_barang'],
            'status' => 'Active',
        ]);

        return response()->json($room);
    }

    public function getMessages($roomId)
    {
        $messages = Pesan::where('id_ruang_chat', $roomId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    public function sendMessage(Request $request, $roomId)
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'type' => 'required|in:Text,Penawaran',
        ]);

        $message = Pesan::create([
            'id_ruang_chat' => $roomId,
            'id_user' => Auth::id(),
            'tipe_pesan' => $validated['type'],
            'isi_pesan' => $validated['message'],
            'is_read' => false,
        ]);

        return response()->json($message);
    }

    public function getRooms()
    {
        try {
            $user = auth()->user();
            Log::info('Fetching chat rooms for user:', ['user_id' => $user->id_user]);
            
            $rooms = RuangChat::where('id_pembeli', $user->id_user)
                ->orWhere('id_penjual', $user->id_user)
                ->with([
                    'barang:id_barang,nama_barang,harga',
                    'pembeli:id_user,name,username',
                    'penjual:id_user,name,username',
                    'pesan' => function($query) {
                        $query->latest()->first();
                    }
                ])
                ->orderBy('updated_at', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $rooms
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching chat rooms:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch chat rooms: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getRoom($roomId)
{
    try {
        $currentUser = auth()->user();
        
        $room = RuangChat::where('id_ruang_chat', $roomId)
            ->with([
                'pembeli:id_user,name,username',
                'penjual:id_user,name,username',
                'barang:id_barang,nama_barang,harga'
            ])
            ->firstOrFail();

        // Check if current user is part of this chat room
        if ($currentUser->id_user !== $room->id_pembeli && 
            $currentUser->id_user !== $room->id_penjual) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access to chat room'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $room
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Chat room not found'
        ], 404);
    }
}
}