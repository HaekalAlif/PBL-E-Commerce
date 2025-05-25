import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageCircle, Search, Users, Clock, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "../../../../lib/axios";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import echo from "../libs/echo";
import { ChatRoomListSkeleton } from "./ChatRoomListSkeleton";

interface ChatRoom {
  id_ruang_chat: number;
  id_pembeli: number;
  id_penjual: number;
  id_barang: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  unread_messages?: number;
  pembeli: {
    id_user: number;
    name: string;
  };
  penjual: {
    id_user: number;
    name: string;
  };
  barang?: {
    id_barang: number;
    nama_barang: string;
    slug: string;
    harga: number;
  };
  pesan?: Array<{
    id_pesan: number;
    isi_pesan: string;
    tipe_pesan: string;
    created_at: string;
    user: {
      id_user: number;
      name: string;
    };
  }>;
  last_message?: {
    id_pesan: number;
    isi_pesan: string;
    tipe_pesan: string;
    created_at: string;
    user: {
      id_user: number;
      name: string;
    };
  };
}

interface ChatRoomListProps {
  currentUserId: number;
  selectedRoomId?: number;
  onRoomSelect: (roomId: number) => void;
  onBack?: () => void;
}

export function ChatRoomList({
  currentUserId,
  selectedRoomId,
  onRoomSelect,
  onBack,
}: ChatRoomListProps) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchChatRooms();
  }, []);

  // Real-time updates for chat rooms
  useEffect(() => {
    const subscriptions: any[] = [];

    // Subscribe to each chat room for real-time updates using a different channel pattern
    chatRooms.forEach((room) => {
      try {
        // Use different channel name for ChatRoomList to avoid conflicts
        const channelName = `chat-list.${room.id_ruang_chat}`;
        console.log(`🔗 ChatRoomList subscribing to ${channelName}`);

        const channel = echo.private(channelName);

        // Listen for new messages
        channel.listen(".MessageSent", (data: any) => {
          console.log(
            `📨 ChatRoomList received MessageSent for room ${room.id_ruang_chat}:`,
            data
          );

          // Update the specific room's last message and unread count
          setChatRooms((prevRooms) => {
            return prevRooms.map((prevRoom) => {
              if (prevRoom.id_ruang_chat === room.id_ruang_chat) {
                const isOwnMessage = data.user.id_user === currentUserId;

                return {
                  ...prevRoom,
                  updated_at: data.created_at,
                  last_message: {
                    id_pesan: data.id_pesan,
                    isi_pesan: data.isi_pesan,
                    tipe_pesan: data.tipe_pesan,
                    created_at: data.created_at,
                    user: data.user,
                  },
                  // Only increment unread count if it's not our own message and not the selected room
                  unread_messages:
                    !isOwnMessage && selectedRoomId !== room.id_ruang_chat
                      ? (prevRoom.unread_messages || 0) + 1
                      : prevRoom.unread_messages,
                };
              }
              return prevRoom;
            });
          });
        });

        // Handle subscription success
        channel.subscribed(() => {
          console.log(
            `✅ ChatRoomList successfully subscribed to ${channelName}`
          );
        });

        // Handle subscription errors
        channel.error((error: any) => {
          console.error(
            `❌ ChatRoomList subscription error for ${channelName}:`,
            error
          );
        });

        subscriptions.push({ channel, roomId: room.id_ruang_chat });
      } catch (error) {
        console.error(
          `❌ Error subscribing to room ${room.id_ruang_chat}:`,
          error
        );
      }
    });

    // Cleanup subscriptions
    return () => {
      subscriptions.forEach((subscription) => {
        try {
          if (subscription.channel) {
            const channelName = `chat-list.${subscription.roomId}`;
            console.log(`👋 ChatRoomList leaving channel: ${channelName}`);
            echo.leave(channelName);
          }
        } catch (error) {
          console.error("❌ Error leaving subscription:", error);
        }
      });
    };
  }, [chatRooms, currentUserId, selectedRoomId]);

  // Clear unread count when a room is selected
  useEffect(() => {
    if (selectedRoomId) {
      setChatRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id_ruang_chat === selectedRoomId
            ? { ...room, unread_messages: 0 }
            : room
        )
      );
    }
  }, [selectedRoomId]);

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/chat`
      );

      if (response.data.success) {
        // Sort rooms by updated_at (most recent first)
        const sortedRooms = response.data.data.sort(
          (a: ChatRoom, b: ChatRoom) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setChatRooms(sortedRooms);
      }
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOtherUser = (room: ChatRoom) => {
    return room.id_pembeli === currentUserId ? room.penjual : room.pembeli;
  };

  const getLastMessage = (room: ChatRoom) => {
    // First check if we have last_message from API
    if (room.last_message) {
      return {
        text:
          room.last_message.tipe_pesan === "Penawaran"
            ? "💰 Penawaran harga"
            : room.last_message.isi_pesan,
        time: room.last_message.created_at,
        isOwn: room.last_message.user.id_user === currentUserId,
      };
    }

    // Fallback to pesan array if available
    if (room.pesan && room.pesan.length > 0) {
      const lastMessage = room.pesan[room.pesan.length - 1];
      return {
        text:
          lastMessage.tipe_pesan === "Penawaran"
            ? "💰 Penawaran harga"
            : lastMessage.isi_pesan,
        time: lastMessage.created_at,
        isOwn: lastMessage.user.id_user === currentUserId,
      };
    }

    // Default fallback
    return {
      text: "Belum ada pesan",
      time: room.created_at,
      isOwn: false,
    };
  };

  const filteredRooms = chatRooms.filter((room) => {
    const otherUser = getOtherUser(room);
    const productName = room.barang?.nama_barang || "";

    return (
      otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Sort filtered rooms by updated_at (most recent first)
  const sortedFilteredRooms = filteredRooms.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  if (loading) {
    return <ChatRoomListSkeleton />;
  }

  return (
    <div className="h-full bg-white border-r border-orange-100 flex flex-col lg:w-80 w-full">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="flex items-center gap-3 mb-4">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Chat</h2>
            <p className="text-sm text-gray-600">
              {chatRooms.length} percakapan
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari percakapan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F79E0E]/20 focus:border-[#F79E0E] text-sm"
          />
        </div>
      </div>

      {/* Chat Room List - Scrollable */}
      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {sortedFilteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="p-4 rounded-full bg-orange-50 mb-4">
              <MessageCircle className="h-8 w-8 text-[#F79E0E]" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">
              {searchQuery ? "Tidak ada hasil" : "Belum ada chat"}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? "Coba kata kunci yang berbeda"
                : "Mulai chat dengan penjual untuk membahas produk"}
            </p>
          </div>
        ) : (
          sortedFilteredRooms.map((room) => {
            const otherUser = getOtherUser(room);
            const lastMessage = getLastMessage(room);
            const isSelected = selectedRoomId === room.id_ruang_chat;

            return (
              <div
                key={room.id_ruang_chat}
                onClick={() => onRoomSelect(room.id_ruang_chat)}
                className={`
                  p-4 border-b border-orange-50 cursor-pointer transition-all duration-200 hover:bg-orange-25
                  ${
                    isSelected
                      ? "bg-gradient-to-r from-orange-50 to-amber-50 border-r-4 border-r-[#F79E0E]"
                      : "hover:bg-orange-25"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F79E0E] to-[#FFB648] flex items-center justify-center text-white font-medium">
                      {otherUser.name.charAt(0).toUpperCase()}
                    </div>
                    {room.unread_messages && room.unread_messages > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {room.unread_messages > 9 ? "9+" : room.unread_messages}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-medium truncate ${
                          isSelected ? "text-[#F79E0E]" : "text-gray-900"
                        }`}
                      >
                        {otherUser.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(lastMessage.time), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    {room.barang && (
                      <div className="text-xs text-[#F79E0E] mb-1 truncate">
                        📦 {room.barang.nama_barang}
                      </div>
                    )}

                    {/* Last Message */}
                    <p
                      className={`text-sm truncate ${
                        lastMessage.isOwn
                          ? "text-gray-600"
                          : room.unread_messages && room.unread_messages > 0
                          ? "text-gray-900 font-medium"
                          : "text-gray-800"
                      }`}
                    >
                      {lastMessage.isOwn && (
                        <span className="text-gray-400 mr-1">Anda:</span>
                      )}
                      {lastMessage.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer - Fixed */}
      <div className="flex-shrink-0 p-4 border-t border-orange-100 bg-orange-25">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Users className="h-3 w-3" />
          <span>Chatting dengan aman di platform kami</span>
        </div>
      </div>
    </div>
  );
}
