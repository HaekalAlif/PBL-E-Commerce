'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const rekomendasiData = Array(20).fill({
  image: '/baju.png', 
  name: 'Nama Barang',
  price: '00000000',
});

const itemsPerPage = 8;

const ProdukLain = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const totalPages = Math.ceil(rekomendasiData.length / itemsPerPage);
  const currentItems = rekomendasiData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-[#FFF8F3] py-12 px-4 text-center">
      <h2 className="text-xl md:text-2xl font-semibold text-[#F79E0E] mb-10">
        Kamu Mungkin Juga Suka
      </h2>

      {/* Produk Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {currentItems.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer border"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-60 md:h-60 xl:h-72 object-cover rounded-md"
            />
            <div className="flex flex-col gap-2 p-2 bg-[#F79E0E] lg:flex-wrap lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-md text-white font-medium text-left">
                  {product.name}
                </h3>
                <div className="flex items-center text-sm text-white">
                  <span className="mr-1">Rp</span>
                  <span>{product.price}</span>
                </div>
              </div>
              <button
                className="bg-white text-[#F79E0E] py-1 px-4 rounded text-sm hover:bg-[#F79E0E] hover:text-white transition"
                onClick={() => router.push('/detail')}
              >
                Beli
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination className="mt-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              className={`${
                currentPage === 1
                  ? 'opacity-50 pointer-events-none'
                  : 'cursor-pointer'
              }`}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              className={`${
                currentPage === totalPages
                  ? 'opacity-50 pointer-events-none'
                  : 'cursor-pointer'
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
};

export default ProdukLain;
