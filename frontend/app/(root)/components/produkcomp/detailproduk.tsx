'use client'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const categories = [
  'Pakaian', 'Elektronik', 'Motor', 'Mobil', 
  'Aksesoris', 'Perabotan', 'Olahraga', 'Lain - Lain'
]

const products = Array(18).fill({
  image: '/camera.png',
  name: 'Nama Barang',
  price: '100.000.00',
})

const itemsPerPage = 16

const DetailProduk = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(products.length / itemsPerPage)

  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="bg-white min-h-screen mt-12">
      <div className="flex justify-end mb-4 mx-48">
        <Select>
          <SelectTrigger className="w-[180px] h-[40px] rounded-xl">
            <SelectValue placeholder="Urutkan" className="text-white" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="termurah">Termurah</SelectItem>
              <SelectItem value="terbaru">Terbaru</SelectItem>
              <SelectItem value="terlaris">Terlaris</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-8 mx-48">
        <div className="bg-white p-6 rounded-lg shadow-md w-1/4 h-[700px]">
          <h2 className="text-2xl font-bold text-orange-500 mb-6">Filter</h2>
          <h3 className="text-lg font-semibold mb-4">Filter Kategori</h3>
          {categories.map((cat, index) => (
            <label key={index} className="flex items-center mb-2">
              <input type="radio" name="category" className="mr-2" />
              {cat}
            </label>
          ))}
          <h3 className="text-lg font-semibold mt-6 mb-4">Harga</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Range Harga Minimum"
              className="w-full p-2 border rounded-md mb-2"
            />
            <input
              type="text"
              placeholder="Range Harga Maksimum"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button className="w-full bg-[#F79E0E] text-white py-2 rounded-md mb-2">
            Terapkan
          </button>
          <button className="w-full text-[#F79E0E] border border-[#F79E0E] py-2 rounded-md">
            Reset Filter
          </button>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-4 gap-6">
            {currentProducts.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-72 object-cover rounded-md"
                />
                <div className="flex justify-between items-center p-2 bg-[#F79E0E]">
                  <div>
                    <h3 className="text-lg text-white font-medium">{product.name}</h3>
                    <p className="text-white">
                      Rp {product.price}
                    </p>
                  </div>
                  <button className="bg-white text-[#F79E0E] py-1 px-4 rounded">
                    Beli Barang
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination className="mt-8 mb-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={`${currentPage === 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`} 
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={`${currentPage === totalPages ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

export default DetailProduk
