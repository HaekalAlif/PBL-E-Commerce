'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Pembayaran() {
  const router = useRouter();
  const [waktu, setWaktu] = useState(24 * 60 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaktu((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatWaktu = (detik: number) => {
    const jam = Math.floor(detik / 3600);
    const menit = Math.floor((detik % 3600) / 60);
    const sisaDetik = detik % 60;
    return `${jam} Jam ${menit} Menit ${sisaDetik} Detik`;
  };

  const salinRekening = () => {
    navigator.clipboard.writeText('123456789098886');
    alert('Nomor rekening disalin!');


  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-[#F79E0E] text-xl font-semibold mb-6">Pembayaran</h1>

      <div className="bg-white w-full max-w-xl rounded-md shadow-md p-5 space-y-6">
        <div className="flex justify-between text-sm font-semibold">
          <span>Total</span>
          <span>Rp40.000</span>
        </div>

        <div className="flex justify-between text-sm font-medium">
          <span>Bayar Dalam</span>
          <span className="text-red-500">{formatWaktu(waktu)}</span>
        </div>

        <hr />

        <div className="space-y-2 text-sm">
          <p className="font-semibold">Bank BCA</p>
          <p className="text-gray-500">No Rekening</p>
          <div className="flex items-center justify-between">
            <span className="text-[#F79E0E] font-semibold">123456789098886</span>
            <button
              onClick={salinRekening}
              className="text-sm text-blue-500 hover:underline"
            >
              Salin
            </button>
          </div>
        </div>

        <div className="pt-4">
          <button className="w-full bg-[#F79E0E] text-white py-2 rounded font-semibold hover:opacity-90 transition cursor-pointer"
            onClick={() => router.push('/pembayaranberhasil')}>
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
