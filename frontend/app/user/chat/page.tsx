'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

// Extend the Session type to include the id property
declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

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

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Fetch messages with polling
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', roomId],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${roomId}/messages`);
      return response.data as Message[];
    },
    refetchInterval: 1000,
    enabled: !!roomId,
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (newMessage: { message: string; type: 'Text' | 'Penawaran' }) => {
      return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${roomId}/messages`, newMessage);
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

  if (!roomId || !session) {
    return <div className="p-4">Chat room not found or not authenticated</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat Header */}
      <div className="bg-white border-b p-4">
        <h1 className="text-lg font-semibold">Chat Room #{roomId}</h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages?.map((msg) => (
          <div
            key={msg.id_pesan}
            className={`mb-4 ${session?.user && msg.id_user === session.user.id ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block max-w-[70%] p-3 rounded-lg ${
                msg.id_user === session.user.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border'
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
              <span className="text-xs opacity-70 block mt-1">
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
    </div>
  );
};

export default ChatPage;