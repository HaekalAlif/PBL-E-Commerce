import { useEffect, useState, useRef } from "react";
import echo from "../libs/echo";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import axios from "../../../../lib/axios";
import { Message } from "../types";
import OfferForm from "./OfferForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Users } from "lucide-react";
import { MessagesSkeleton } from "./MessagesSkeleton";

interface UserSession {
  id: number;
  name?: string | null | undefined;
  email?: string | null | undefined;
}

interface ChatRoomProps {
  roomId: number;
  session: { user?: UserSession | null } | null;
  offerMode?: boolean;
  offerQuantity?: number;
  productSlug?: string;
}

function ChatRoom({
  roomId,
  session,
  offerMode = false,
  offerQuantity,
  productSlug,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOfferForm, setShowOfferForm] = useState(offerMode);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setLoadingMessages(true);
        setError(null);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/chat/${roomId}/messages`
        );

        if (response.data.status === "success" || response.data.success) {
          setMessages(response.data.data);
        } else {
          setError(response.data.message || "Failed to load messages");
        }
      } catch (error: any) {
        console.error("Error fetching messages:", error);
        setError(error.response?.data?.message || "Failed to load messages");
      } finally {
        setLoading(false);
        setLoadingMessages(false);
      }
    };

    fetchMessages();

    // Subscribe to real-time messages - Use a dedicated channel for ChatRoom
    let channel: any = null;
    let reconnectInterval: NodeJS.Timeout | null = null;

    const setupChannel = () => {
      try {
        // Use different channel name for ChatRoom to avoid conflicts
        const channelName = `chat-room.${roomId}`;
        console.log(`🔗 ChatRoom subscribing to private channel: ${channelName}`);
        channel = echo.private(channelName);

        // Listen for new messages
        channel.listen(".MessageSent", (data: any) => {
          console.log("📨 ChatRoom received MessageSent event:", data);

          setMessages((prevMessages) => {
            const exists = prevMessages.some(
              (msg) => msg.id_pesan === data.id_pesan
            );
            if (exists) {
              console.log(
                "⚠️ ChatRoom: Message already exists, skipping:",
                data.id_pesan
              );
              return prevMessages;
            }

            console.log("✅ ChatRoom: Adding new message:", data.id_pesan);
            return [...prevMessages, data];
          });
        });

        // Handle subscription events
        channel.subscribed(() => {
          console.log(`✅ ChatRoom successfully subscribed to ${channelName}`);
          setIsConnected(true);
          if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
          }
        });

        channel.error((error: any) => {
          console.error("❌ ChatRoom subscription error:", error);
          setIsConnected(false);
          if (!reconnectInterval) {
            reconnectInterval = setTimeout(() => {
              console.log("🔄 ChatRoom attempting to reconnect...");
              setupChannel();
            }, 3000);
          }
        });
      } catch (error) {
        console.error("❌ ChatRoom error setting up real-time connection:", error);
        setIsConnected(false);
      }
    };

    setupChannel();

    return () => {
      if (reconnectInterval) {
        clearTimeout(reconnectInterval);
      }
      if (channel) {
        try {
          const channelName = `chat-room.${roomId}`;
          console.log(`👋 ChatRoom leaving channel: ${channelName}`);
          echo.leave(channelName);
        } catch (error) {
          console.error("❌ ChatRoom error leaving channel:", error);
        }
      }
    };
  }, [roomId]);

  const handleSendMessage = async (messageText: string): Promise<void> => {
    try {
      console.log("📤 Sending message:", messageText);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/${roomId}/messages`,
        {
          tipe_pesan: "Text",
          isi_pesan: messageText,
        }
      );

      console.log("📤 Message sent response:", response.data);

      if (!response.data.success && response.data.status !== "success") {
        throw new Error(response.data.message || "Failed to send message");
      }

      // Remove the temporary message addition - let broadcasting handle it
      // This ensures consistent behavior for both sender and receiver
    } catch (error: any) {
      console.error("❌ Error sending message:", error);
      throw error;
    }
  };

  const handleSendOffer = async (
    offerPrice: number,
    quantity: number,
    message: string
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/${roomId}/messages`,
        {
          tipe_pesan: "Penawaran",
          isi_pesan: message,
          harga_tawar: offerPrice,
          status_penawaran: "Menunggu",
          // You might want to include product ID if available
        }
      );

      if (!response.data.success && response.data.status !== "success") {
        throw new Error(response.data.message || "Failed to send offer");
      }

      setShowOfferForm(false);
    } catch (error: any) {
      console.error("Error sending offer:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <Card className="border-orange-100 h-full">
        <CardContent className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-6">
            {/* Multi-layer spinner */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-orange-100 rounded-full"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-orange-400 rounded-full animate-spin"></div>
              <div
                className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-amber-400 rounded-full animate-spin animation-delay-150"
                style={{ animationDirection: "reverse" }}
              ></div>
              <div className="absolute inset-4 w-8 h-8 border-4 border-transparent border-t-orange-300 rounded-full animate-spin animation-delay-300"></div>
            </div>

            {/* Loading text with typewriter effect */}
            <div className="text-center space-y-3">
              <div className="relative">
                <h3 className="text-lg font-semibold text-gray-800 inline-block">
                  Menghubungkan ke server
                  <span className="animate-pulse">...</span>
                </h3>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">Menyiapkan chat room</p>
              </div>

              {/* Progress bar */}
              <div className="w-48 bg-orange-100 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-orange-100 h-full">
        <CardContent className="flex justify-center items-center h-96">
          <div className="text-center max-w-md">
            <div className="p-4 rounded-full bg-red-50 mb-6 inline-block">
              <MessageCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">
              Tidak Dapat Memuat Chat
            </h3>
            <p className="text-red-500 text-sm mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#F79E0E] text-white rounded-lg hover:bg-[#F79E0E]/90 transition-colors font-medium"
              >
                Coba Lagi
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Kembali
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-orange-100">
      {/* Chat Header - Fixed at top */}
      <div className="flex-shrink-0 p-4 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Chat Room #{roomId}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isConnected ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-xs text-gray-500">
                  {isConnected ? "Terhubung" : "Menghubungkan..."}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="h-4 w-4" />
            <span>2 anggota</span>
          </div>
        </div>

        {/* Offer Mode Banner */}
        {showOfferForm && (
          <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-amber-800">Mode Penawaran</h4>
                <p className="text-sm text-amber-600">
                  Jumlah: {offerQuantity} item
                </p>
              </div>
              <button
                onClick={() => setShowOfferForm(false)}
                className="text-amber-600 hover:text-amber-800 text-lg font-bold transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Messages Container - Scrollable area */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={messagesContainerRef}
          className="absolute inset-0 overflow-y-auto bg-gradient-to-b from-orange-50/20 to-transparent chat-scrollbar"
          style={{
            scrollBehavior: "smooth",
          }}
        >
          {loadingMessages ? (
            <MessagesSkeleton />
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="p-6 rounded-full bg-gradient-to-br from-orange-50 to-amber-50 mb-6 border border-orange-100">
                <MessageCircle className="h-12 w-12 text-[#F79E0E]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                {offerMode ? "Mulai dengan Penawaran!" : "Belum Ada Pesan"}
              </h3>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                {offerMode
                  ? "Buat penawaran Anda menggunakan tombol di bawah untuk memulai negosiasi"
                  : "Mulai percakapan dengan mengirim pesan pertama Anda"}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id_pesan}
                  message={message}
                  isOwnMessage={message.id_user === session?.user?.id}
                />
              ))}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-orange-100 bg-white">
        {showOfferForm ? (
          <div className="p-3">
            <OfferForm
              quantity={offerQuantity || 1}
              onSendOffer={handleSendOffer}
              onCancel={() => setShowOfferForm(false)}
            />
          </div>
        ) : (
          <>
            <ChatInput onSendMessage={handleSendMessage} />
            {offerMode && (
              <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 border-t border-orange-100">
                <button
                  onClick={() => setShowOfferForm(true)}
                  className="w-full py-2 bg-gradient-to-r from-[#F79E0E] to-[#FFB648] text-white rounded-lg hover:from-[#F79E0E]/90 hover:to-[#FFB648]/90 transition-all font-medium shadow-sm"
                >
                  💰 Buat Penawaran
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ChatRoom;
