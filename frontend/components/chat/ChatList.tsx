'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';

interface ChatRoom {
  id_ruang_chat: number;
  id_pembeli: number;
  id_penjual: number;
  id_barang: number | null;
  status: 'Active' | 'Inactive' | 'Archived';
  updated_at: string;
  barang?: {
    nama_barang: string;
    harga: number;
    gambar_barang?: { url_gambar: string }[];
  };
  pembeli: {
    name: string;
    username: string;
  };
  penjual: {
    name: string;
    username: string;
  };
  pesan_terakhir?: {
    isi_pesan: string;
    created_at: string;
    tipe_pesan: 'Text' | 'Penawaran' | 'Gambar' | 'System';
  };
  opposingUser: {
    name: string;
    username: string;
  };
}

export const ChatList = ({ activeRoomId }: { activeRoomId?: string | null }) => {
  const { data: chatRooms, isLoading } = useQuery<ChatRoom[]>({
    queryKey: ['chatRooms'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/chat/rooms');
      const currentUser = await axiosInstance.get('/api/user/profile');
      const currentUserId = currentUser.data.data.id_user;

      // Add opposing user info to each room
      return (response.data.data || []).map((room: ChatRoom) => ({
        ...room,
        opposingUser: room.id_pembeli === currentUserId ? room.penjual : room.pembeli
      }));
    },
  });

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-80 border-r bg-white h-full overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Pesan</h2>
      </div>
      <div className="divide-y">
        {chatRooms?.map((room) => (
          <Link
            href={`/user/chat?roomId=${room.id_ruang_chat}`}
            key={room.id_ruang_chat}
          >
            <div 
              className={`p-4 hover:bg-gray-50 transition-colors ${
                activeRoomId === room.id_ruang_chat.toString() ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between it</p>ems-start mb-1">
                <h3 className="font-medium text-sm">
                  {room.barang ? room.barang.nama_barang : 'Chat Room'}
                </h3>
                <span className="text-xs text-gray-500">
                  {new Date(room.updated_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">
              dengan {room.opposingUser.name}
              </p>
              {room.pesan_terakhir && (
                <p className="text-xs text-gray-500 truncate mt-1">
                  {room.pesan_terakhir.tipe_pesan === 'Penawaran'
                    ? '💰 Penawaran Harga'
                    : room.pesan_terakhir.isi_pesan}
                </p>
              )}
            </div>
          </Link>
        ))}
        {chatRooms?.length === 0 && (
          <div className="p-4 text-center text-gray-500 text-sm">
            Belum ada pesan
          </div>
        )}
      </div>
    </div>
  );
};