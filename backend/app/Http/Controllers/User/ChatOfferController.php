<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\RuangChat;
use App\Models\Pesan;
use App\Models\Barang;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Events\MessageSent;

class ChatOfferController extends Controller
{
    /**
     * Create a chat room with an offer for a specific product
     */
    public function createOfferChat(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }
            
            Log::info("User {$user->id_user} creating offer chat", $request->all());
            
            $validated = $request->validate([
                'product_id' => 'required|exists:barang,id_barang',
                'amount' => 'required|numeric|min:1',
            ]);
            
            // Get the product with seller info
            $product = Barang::with('toko.user')->findOrFail($validated['product_id']);
            
            if (!$product->toko || !$product->toko->user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product does not have a valid seller'
                ], 400);
            }
            
            // Get seller ID from product
            $sellerId = $product->toko->user->id_user;
            
            // Buyer is the current user
            $buyerId = $user->id_user;
            
            // Cannot make offer on your own product
            if ($buyerId === $sellerId) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot make offers on your own products'
                ], 400);
            }
            
            // Check if product is available
            if ($product->status_barang !== 'Tersedia') {
                return response()->json([
                    'success' => false,
                    'message' => 'This product is not available for offers'
                ], 400);
            }
            
            // Check if a chat room already exists for this product
            $chatRoom = RuangChat::where('id_pembeli', $buyerId)
                ->where('id_penjual', $sellerId)
                ->where('id_barang', $product->id_barang)
                ->first();
            
            // If no room exists for this product, check for any room between these users
            if (!$chatRoom) {
                $chatRoom = RuangChat::where('id_pembeli', $buyerId)
                    ->where('id_penjual', $sellerId)
                    ->first();
                
                // If a room exists but with a different product, update it
                if ($chatRoom) {
                    $chatRoom->id_barang = $product->id_barang;
                    $chatRoom->save();
                    
                    // Add system message about product change
                    $systemMessage = new Pesan();
                    $systemMessage->id_ruang_chat = $chatRoom->id_ruang_chat;
                    $systemMessage->id_user = $user->id_user;
                    $systemMessage->tipe_pesan = 'System';
                    $systemMessage->isi_pesan = "Changed product for discussion to {$product->nama_barang}";
                    $systemMessage->is_read = false;
                    $systemMessage->save();
                }
            }
            
            // If no room exists at all, create a new one
            if (!$chatRoom) {
                $chatRoom = new RuangChat();
                $chatRoom->id_pembeli = $buyerId;
                $chatRoom->id_penjual = $sellerId;
                $chatRoom->id_barang = $product->id_barang;
                $chatRoom->status = 'Active';
                $chatRoom->save();
                
                // Add welcome message
                $systemMessage = new Pesan();
                $systemMessage->id_ruang_chat = $chatRoom->id_ruang_chat;
                $systemMessage->id_user = $user->id_user;
                $systemMessage->tipe_pesan = 'System';
                $systemMessage->isi_pesan = 'Chat room created';
                $systemMessage->is_read = false;
                $systemMessage->save();
            }
            
            // Create offer message
            $offerMessage = new Pesan();
            $offerMessage->id_ruang_chat = $chatRoom->id_ruang_chat;
            $offerMessage->id_user = $user->id_user;
            $offerMessage->tipe_pesan = 'Penawaran';
            $offerMessage->harga_tawar = $validated['amount'];
            $offerMessage->status_penawaran = 'Menunggu';
            $offerMessage->id_barang = $product->id_barang;
            $offerMessage->is_read = false;
            $offerMessage->save();
            
            // Load relationships
            $chatRoom->load(['pembeli', 'penjual', 'barang']);
            $offerMessage->load('user');
            
            // Broadcast the message
            event(new MessageSent($offerMessage));
            
            return response()->json([
                'success' => true,
                'data' => [
                    'chat_room' => $chatRoom,
                    'offer' => $offerMessage
                ],
                'message' => 'Offer sent successfully'
            ]);
        } catch (\Exception $e) {
            Log::error("Error creating offer: {$e->getMessage()}");
            
            return response()->json([
                'success' => false,
                'message' => "Failed to create offer: {$e->getMessage()}"
            ], 500);
        }
    }
    
    /**
     * Respond to an offer
     */
    public function respondToOffer(Request $request, int $id): JsonResponse
    {
        try {
            $user = Auth::user();
            
            $validated = $request->validate([
                'status' => 'required|in:Diterima,Ditolak',
            ]);
            
            // Get the offer message
            $message = Pesan::findOrFail($id);
            
            // Check if this is an offer message
            if ($message->tipe_pesan !== 'Penawaran') {
                return response()->json([
                    'success' => false,
                    'message' => 'This message is not an offer'
                ], 400);
            }
            
            // Get the chat room
            $chatRoom = RuangChat::findOrFail($message->id_ruang_chat);
            
            // Only the seller can respond to offers
            if ($chatRoom->id_penjual !== $user->id_user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only the seller can respond to offers'
                ], 403);
            }
            
            // Update offer status
            $message->status_penawaran = $validated['status'];
            $message->save();
            
            // Load user relation
            $message->load('user');
            
            // Update the room's updated_at timestamp
            $chatRoom->touch();
            
            // Broadcast the updated message
            event(new MessageSent($message));
            
            return response()->json([
                'success' => true,
                'data' => $message,
                'message' => "Offer {$validated['status']} successfully"
            ]);
        } catch (\Exception $e) {
            Log::error("Error responding to offer {$id}: {$e->getMessage()}");
            
            return response()->json([
                'success' => false,
                'message' => "Failed to respond to offer: {$e->getMessage()}"
            ], 500);
        }
    }
}
