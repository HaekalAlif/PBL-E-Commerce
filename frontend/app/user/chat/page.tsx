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
  // Add these after the existing useState declarations
const [selectedImage, setSelectedImage] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  // Replace the existing sendMessage mutation
const sendMessage = useMutation({
  mutationFn: async (data: FormData | { message: string; type: 'Text' | 'Penawaran' }) => {
    await getCsrfToken();
    
    const config = {
      headers: {
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    };
    
    return axiosInstance.post(`/api/chat/${roomId}/messages`, data, config);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
    setMessage('');
  },
});

  // Add after the sendMessage mutation
const markAsRead = useMutation({
  mutationFn: async (messageIds: number[]) => {
    await getCsrfToken();
    return axiosInstance.post(`/api/chat/${roomId}/mark-as-read`, { messageIds });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
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
  
// Add before the return statement
useEffect(() => {
  if (messages && currentUserId) {
    const unreadMessages = messages.filter(
      msg => !msg.is_read && msg.id_user !== currentUserId
    );
    
    if (unreadMessages.length > 0) {
      markAsRead.mutate(unreadMessages.map(msg => msg.id_pesan));
    }
  }
}, [messages, currentUserId]);

// Add these before the return statement
const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  }
};

const handleImageUpload = async () => {
  if (!selectedImage) return;

  const formData = new FormData();
  formData.append('image', selectedImage);
  formData.append('type', 'Gambar');

  try {
    await sendMessage.mutateAsync(formData);
    setSelectedImage(null);
    setImagePreview(null);
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

const cancelImageUpload = () => {
  setSelectedImage(null);
  setImagePreview(null);
};

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
) : msg.tipe_pesan === 'Gambar' ? (
  <img 
    src={msg.isi_pesan || ''} 
    alt="Chat image" 
    className="max-w-full rounded-lg"
  />
) : (
  <p>{msg.isi_pesan}</p>
)}
                    <span
                      className={`text-xs block mt-1 ${
                        msg.id_user === currentUserId ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString()}
  {msg.id_user === currentUserId && (
    <span className="ml-2">
      {msg.is_read ? '✓✓' : '✓'}
    </span>
  )}
                    </span>
                  </div>
                </div>
              ))}
            </div>

<div className="border-t bg-white p-4">
  {imagePreview ? (
    <div className="mb-4">
      <div className="relative inline-block">
        <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg" />
        <button
          onClick={cancelImageUpload}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <button
        onClick={handleImageUpload}
        disabled={sendMessage.isPending}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        Send Image
      </button>
    </div>
  ) : (
    <div className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        className="flex-1 border rounded-lg px-4 py-2"
        placeholder="Ketik pesan..."
      />
      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
      </label>
      <button
        onClick={handleSend}
        disabled={sendMessage.isPending}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        Kirim
      </button>
    </div>
  )}
</div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;