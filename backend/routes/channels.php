<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\RuangChat;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
*/

// Private chat channel
Broadcast::channel('chat.{roomId}', function ($user, $roomId) {
    // Get the chat room
    $room = RuangChat::findOrFail($roomId);
    
    // User can access the channel if they are either the buyer or seller
    return (int)$user->id_user === (int)$room->id_pembeli || 
           (int)$user->id_user === (int)$room->id_penjual;
});

// User specific channel
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int)$user->id_user === (int)$userId;
});
