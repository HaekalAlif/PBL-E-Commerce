'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import axiosInstance, { getCsrfToken } from '@/lib/axios';
import { ChatList } from '@/components/chat/ChatList';

interface Message {
  id_pesan: number;
  id_ruang_chat: number;
  id_user: number;
  tipe_pesan: 'Text' | 'Penawaran' | 'Gambar' | 'System';
  isi_pesan: string | null;
  harga_tawar: number | null;
  status_penawaran: 'Menunggu' | 'Diterima' | 'Ditolak' | null;
  is_read: boolean;
  created_at: string;
}

interface ChatRoom {
  id_ruang_chat: number;
  pembeli: {
    id_user: number;
    name: string;
  };
  penjual: {
    id_user: number;
    name: string;
  };
}

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const roomId = searchParams.get('roomId');
  const queryClient = useQueryClient();

  console.log('Current user ID:', currentUserId);

// Add room details query
const { data: roomDetails } = useQuery<ChatRoom>({
  queryKey: ['room', roomId],
  queryFn: async () => {
    const response = await axiosInstance.get(`/api/chat/rooms/${roomId}`);
    return response.data.data;
  },
  enabled: !!roomId,
});

 // Function to get opposing user's name
 const getOpposingUserName = () => {
  if (!roomDetails || !currentUserId) return 'Loading...';
  
  return currentUserId === roomDetails.pembeli.id_user 
    ? roomDetails.penjual.name 
    : roomDetails.pembeli.name;
};

  // Fetch current user with better error handling
useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      await getCsrfToken();
      const response = await axiosInstance.get('/api/user/profile');
      console.log('User profile response:', response.data);
      
      // Access id_user from the correct path in response
      if (response.data?.data?.id_user) {
        setCurrentUserId(response.data.data.id_user);
      } else {
        console.error('User ID not found in response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  fetchCurrentUser();
}, []);

  // Add debug log for currentUserId
  console.log('Current user ID state:', currentUserId);


  // Fetch messages with polling
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ['messages', roomId],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/api/chat/${roomId}/messages`);
        console.log('API Response:', response); // Log full response
        
        // Make sure we're getting an array back
        const messages = response.data || [];
        if (!Array.isArray(messages)) {
          console.error('Messages is not an array:', messages);
          return [];
        }
        
        return messages;
      } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
    },
    refetchInterval: 1000,
    enabled: !!roomId,
    initialData: [],
  });

  // Add this console log to check messages in render
  console.log('Render messages:', messages);

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (newMessage: { message: string; type: 'Text' | 'Penawaran' }) => {
      // Get CSRF token before sending message
      await getCsrfToken();
      
      return axiosInstance.post(`/api/chat/${roomId}/messages`, newMessage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
      setMessage('');
    },
  });

  const handleSend = () => {
    if (message.trim()) {
      sendMessage.mutate({ message, type: 'Text' });
    }
  };

  if (!roomId) {
    return <div className="p-4">Chat room not found</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }
  
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Chat List Sidebar */}
      <ChatList activeRoomId={roomId} />

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {!roomId ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Pilih chat untuk memulai percakapan
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b p-4">
            <h1 className="text-lg font-semibold">{getOpposingUserName()}</h1>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages?.map((msg) => (
                <div
                  key={msg.id_pesan}
                  className={`flex mb-4 ${
                    msg.id_user === currentUserId ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`relative max-w-[70%] p-3 ${
                      msg.id_user === currentUserId
                        ? 'bg-blue-500 text-white ml-4'
                        : 'bg-white border mr-4'
                    } rounded-2xl ${
                      msg.id_user === currentUserId ? 'rounded-tr-none' : 'rounded-tl-none'
                    }`}
                  >
                    {msg.tipe_pesan === 'Penawaran' ? (
                      <div>
                        <p className="font-semibold">Penawaran Harga</p>
                        <p className="text-lg">Rp {msg.harga_tawar?.toLocaleString('id-ID')}</p>
                        <p className="text-sm mt-1">
                          Status: {msg.status_penawaran || 'Menunggu'}
                        </p>
                      </div>
                    ) : (
                      <p>{msg.isi_pesan}</p>
                    )}
                    <span
                      className={`text-xs block mt-1 ${
                        msg.id_user === currentUserId ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 border rounded-lg px-4 py-2"
                  placeholder="Ketik pesan..."
                />
                <button
                  onClick={handleSend}
                  disabled={sendMessage.isPending}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Kirim
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;