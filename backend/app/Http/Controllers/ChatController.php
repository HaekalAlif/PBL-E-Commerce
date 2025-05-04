<?php

namespace App\Http\Controllers;

use App\Models\RuangChat;
use App\Models\Pesan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
}