"use client";
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatRoom from "./components/ChatRoom";
import { ChatRoomList } from "./components/ChatRoomList";
import { ChatRoomSkeleton } from "./components/ChatRoomSkeleton";
import { ChatRoomListSkeleton } from "./components/ChatRoomListSkeleton";
import { getCurrentUser } from "../../../lib/auth";
import axios from "../../../lib/axios";

// Dynamically import components that use window
const ChatRoom = dynamic(() => import('./components/ChatRoom'), {
  ssr: false,
  loading: () => <ChatRoomSkeleton />
});

const ChatRoomList = dynamic(() => import('./components/ChatRoomList'), {
  ssr: false,
  loading: () => <ChatRoomListSkeleton />
});

interface User {
  id_user: number;
  name: string;
  email: string;
}

interface ChatRoomData {
  id_ruang_chat: number;
  id_pembeli: number;
  id_penjual: number;
  id_barang: number | null;
  status: string;
  barang?: {
    id_barang: number;
    nama_barang: string;
    slug: string;
    harga: number;
  };
}

function ChatContent() {
    const [isMounted, setIsMounted] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [chatRoom, setChatRoom] = useState<ChatRoomData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showChatList, setShowChatList] = useState(true);
  
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomId = searchParams?.get("room");
    const isOfferMode = searchParams?.get("offer") === "true";
    const quantity = searchParams?.get("quantity");
    const productSlug = searchParams?.get("product");
  
    useEffect(() => {
      setIsMounted(true);
    }, []);
  
    useEffect(() => {
      if (!isMounted) return;
  
      const initializeChat = async () => {
        try {
          setLoading(true);
          setError(null);
  
          const currentUser = await getCurrentUser();
          if (!currentUser) {
            setError("Please log in to access the chat");
            return;
          }
          setUser(currentUser);
  
          if (roomId) {
            try {
              const roomResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/chat/${roomId}`
              );
              if (roomResponse.data.success) {
                setChatRoom(roomResponse.data.data);
                setShowChatList(false);
              } else {
                setError("Chat room not found");
              }
            } catch (error) {
              console.error("Error loading specific room:", error);
              setError("Failed to load chat room");
            }
          }
        } catch (error: any) {
          console.error("Error initializing chat:", error);
          setError("Failed to load chat. Please try again.");
        } finally {
          setLoading(false);
        }
      };
  
      initializeChat();
    }, [roomId, isMounted]);
  
    if (!isMounted) {
      return <ChatRoomSkeleton />;
    }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 to-amber-50/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div
              className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden flex"
              style={{
                height: "80vh",
                minHeight: "600px",
              }}
            >
              {/* Chat List Skeleton */}
              <div className="w-80 border-r border-orange-100">
                <ChatRoomListSkeleton />
              </div>

              {/* Chat Room Skeleton */}
              <div className="flex-1">
                <ChatRoomSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 to-amber-50/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
              <div className="text-center">
                <div className="p-4 rounded-full bg-red-50 mb-6 inline-block">
                  <MessageCircle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Terjadi Kesalahan
                </h2>
                <p className="text-red-500 mb-6">{error}</p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => router.refresh()}
                    className="bg-[#F79E0E] text-white hover:bg-[#F79E0E]/90"
                  >
                    Coba Lagi
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Kembali
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className="text-gray-500 text-center">
          Please log in to access chat
        </div>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 bg-[#F79E0E] text-white rounded hover:bg-[#F79E0E]/90"
        >
          Login
        </button>
      </div>
    );
  }

  const handleRoomSelect = (roomId: number) => {
    router.push(`/chat?room=${roomId}`);
    setShowChatList(false);
  };

  const handleBackToList = () => {
    router.push("/chat");
    setShowChatList(true);
    setChatRoom(null);
  };

  // Create a session-like object for compatibility
  const sessionLike = {
    user: {
      id: user.id_user,
      name: user.name,
      email: user.email,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 to-amber-50/20">
      <div className="container mx-auto px-4 py-6">
        {/* Header - Reduced padding */}
        <div className="mb-6">
          {isOfferMode && quantity && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <h3 className="font-medium text-amber-800">
                    Mode Penawaran Aktif
                  </h3>
                  <p className="text-amber-700 text-sm">
                    Siap membuat penawaran untuk {quantity} item? Mulai
                    percakapan di bawah!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Container - Adjusted height calculation */}
        <div className="max-w-7xl mx-auto">
          <div
            className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden flex"
            style={{
              height:
                isOfferMode && quantity
                  ? "calc(100vh - 200px)"
                  : "calc(100vh - 140px)",
              minHeight: "500px",
              maxHeight: "calc(100vh - 120px)", // Ensure minimum margin
            }}
          >
            {/* Chat Room List - Hidden on mobile when chat is selected */}
            <div
              className={`${
                showChatList ? "block" : "hidden lg:block"
              } lg:w-80 w-full lg:border-r border-orange-100`}
            >
              <ChatRoomList
                currentUserId={user.id_user}
                selectedRoomId={chatRoom?.id_ruang_chat}
                onRoomSelect={handleRoomSelect}
                onBack={handleBackToList}
              />
            </div>

            {/* Chat Room - Hidden on mobile when chat list is shown */}
            <div
              className={`${
                !showChatList ? "block" : "hidden lg:block"
              } flex-1 flex flex-col`}
            >
              {chatRoom ? (
                <div className="h-full flex flex-col">
                  {/* Mobile back button */}
                  <div className="lg:hidden p-3 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToList}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Kembali ke Chat
                    </Button>
                  </div>

                  <div className="flex-1">
                    <ChatRoom
                      roomId={chatRoom.id_ruang_chat}
                      session={sessionLike}
                      offerMode={isOfferMode}
                      offerQuantity={quantity ? parseInt(quantity) : undefined}
                      productSlug={productSlug || undefined}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="p-6 rounded-full bg-gradient-to-br from-orange-50 to-amber-50 mb-6 inline-block border border-orange-100">
                      <MessageCircle className="h-12 w-12 text-[#F79E0E]" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                      Pilih Chat untuk Memulai
                    </h3>
                    <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                      Pilih percakapan dari daftar sebelah kiri untuk memulai
                      chat
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatRoomSkeleton />}>
      <ChatContent />
    </Suspense>
  );
}
