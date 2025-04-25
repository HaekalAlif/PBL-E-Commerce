'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function PembayaranBerhasil() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6">
        <Image
          src="/checklist.png"
          alt="Pembayaran Berhasil"
          width={240}
          height={240}
        />
      </div>

      <h2 className="text-[#F79E0E] font-semibold text-xl mb-2">
        Pembayaran Berhasil
      </h2>
      <p className="textlg text-gray-600 mb-6">
        Terima kasih atas transaksi Anda. <br className="hidden sm:block" />
        Pesanan Anda kini telah dikonfirmasi!
      </p>

      <button
        onClick={() => router.push('/')}
        className="bg-[#F79E0E] text-white px-6 py-2 rounded hover:opacity-90 transition font-semibold text-lg cursor-pointer"
      >
        Pesanan Saya
      </button>
    </div>
  );
}
