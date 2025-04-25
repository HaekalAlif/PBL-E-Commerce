'use client';
import { useState } from 'react';

const Deskripsi = () => {
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'review'>('deskripsi');

  const reviews = [
    {
      name: 'Samantha D.',
      comment: 'Saya sangat menyukai kaos ini!',
      date: '16 Agustus 2023',
      rating: 5,
      verified: true,
    },
    {
      name: 'Alex M.',
      comment: 'Kaos ini memiliki ekspresi keren!',
      date: '16 Agustus 2023',
      rating: 4,
      verified: false,
    },
  ];

  return (
    <div className=" bg-[#FFF8F3] px-6 flex flex-col items-center">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl w-full">
        {/* Tab Navigation */}
        <div className="flex justify-center gap-10 border-b border-gray-200">
          {['Deskripsi Produk', 'Penilaian Produk'].map((label, idx) => {
            const tab = idx === 0 ? 'deskripsi' : 'review';
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'deskripsi' | 'review')}
                className={`pb-2 text-sm font-semibold ${
                  activeTab === tab
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'deskripsi' ? (
          <div className="mt-6 space-y-3 text-sm leading-relaxed text-gray-700">
            <h3 className="font-semibold text-black">Kaos 30s Cotton Hydro - ROWN Division</h3>
            <ul className="list-disc list-inside">
              <li>Material 100% cotton hydro (160gsm) – Lembut & Nyaman</li>
              <li>Kaos panjang pendek dengan round neck</li>
              <li>Regular cutting untuk kenyamanan maksimal</li>
              <li>Cocok untuk penggunaan sehari-hari & iklim tropis</li>
              <li>Desain grafis Personal printed – Tahan lama & berkualitas</li>
            </ul>

            <h4 className="font-semibold mt-4">Panduan Ukuran Berdasarkan Tinggi & Berat Badan:</h4>
            <ul className="list-disc list-inside">
              <li>S → 155cm–165cm | 40kg–50kg</li>
              <li>M → 160cm–170cm | 50kg–60kg</li>
              <li>L → 170cm–175cm | 70kg–80kg</li>
              <li>XL → 175cm–180cm | 85kg–90kg</li>
            </ul>

            <p className="mt-2 text-red-500 text-xs font-medium">
              Note: Toleransi ukuran 1–2cm dapat terjadi karena proses produksi.
            </p>
          </div>
        ) : (
          <div className="mt-6">
            {/* Top bar */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">All Reviews</h3>
              <div className="flex items-center gap-2">
                <select className="text-sm border rounded px-2 py-1">
                  <option>Latest</option>
                  <option>Rating Tertinggi</option>
                </select>
                <button className="bg-orange-400 text-white text-sm px-3 py-1 rounded">
                  Write a Review
                </button>
              </div>
            </div>

            {/* Review Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map((review, i) => (
                <div
                  key={i}
                  className="border border-orange-200 rounded-xl p-5 shadow-md bg-white transition hover:shadow-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-yellow-400 text-sm">★★★★★</div>
                    <button className="text-gray-400 text-sm">⋯</button>
                  </div>
                  <div className="font-semibold text-sm">
                    {review.name}{' '}
                    {review.verified && <span className="text-green-500 ml-1">✅</span>}
                  </div>
                  <p className="text-sm mt-1 text-gray-700">{review.comment}</p>
                  <p className="text-xs text-gray-500 mt-2">Diposting pada {review.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deskripsi;
