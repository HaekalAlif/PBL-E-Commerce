"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Loader2, ShoppingCart } from "lucide-react";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface Product {
  id_barang: number;
  nama_barang: string;
  slug: string;
  harga: number;
  deskripsi_barang: string;
  status_barang: string;
  grade: string;
  gambarBarang?: Array<{
    id_gambar_barang: number;
    url_gambar: string;
    is_primary: boolean;
  }>;
  gambar_barang?: Array<{
    id_gambar: number;
    url_gambar: string;
    is_primary: boolean;
  }>;
  toko: {
    nama_toko: string;
    slug: string;
  };
  kategori: {
    nama_kategori: string;
  };
}

interface Category {
  id_kategori: number;
  nama_kategori: string;
}

export default function Katalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/kategori`
        );
        if (response.data) {
          setCategories(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append("search", searchQuery);
        if (selectedCategory)
          queryParams.append("category", selectedCategory.toString());
        queryParams.append("page", currentPage.toString());

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products?${queryParams}`
        );

        if (response.data.status === "success") {
          setProducts(response.data.data.data || []);
          setTotalPages(
            Math.ceil(response.data.data.total / response.data.data.per_page)
          );
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handleBuyNow = async (product: Product) => {
    console.log("Buy Now clicked for product:", product.slug);

    // Add loading state for better UX
    toast.info("Processing your purchase...");
    
    try {
      // Get the user's primary address
      const addressResponse = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/addresses`
      );
      
      if (addressResponse.data.status !== "success" || !addressResponse.data.data.length) {
        toast.error("Please add a shipping address first");
        router.push("/user/alamat");
        return;
      }
      
      // Find primary address or use the first one
      const addresses = addressResponse.data.data;
      const primaryAddress = addresses.find((addr: any) => addr.is_primary) || addresses[0];
      
      // Use the new buy-now endpoint which combines adding to cart and checkout
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/buy-now`,
        {
          id_barang: product.id_barang,
          jumlah: 1, // Default quantity for catalog buy now
          id_alamat: primaryAddress.id_alamat
        }
      );
      
      if (response.data.status === "success") {
        const { kode_pembelian } = response.data.data;
        
        // Redirect to checkout page with the purchase code
        router.push(`/user/checkout?code=${kode_pembelian}`);
      } else {
        toast.error(response.data.message || "Failed to process your purchase");
      }
    } catch (error: any) {
      console.error("Error processing buy now:", error);
      
      // Provide helpful error messages
      if (error.response?.status === 401) {
        toast.error("Please log in to continue");
        router.push("/login");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to process your purchase. Please try again.");
      }
    }
  };

  const handleMakeOffer = (slug: string) => {
    // Will be implemented later
    alert(
      `Make Offer functionality will be implemented later for product: ${slug}`
    );
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    e.stopPropagation(); // Prevent event bubbling
    
    setAddingToCart(product.id_barang);
    
    try {
      const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        id_barang: product.id_barang,
        jumlah: 1 // Default to 1 when adding from catalog
      });
      
      if (response.data.status === "success") {
        toast.success(`${product.nama_barang} added to cart`);
      }
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      
      if (error.response?.status === 401) {
        toast.error("Please login to add items to cart");
      } else {
        toast.error("Failed to add item to cart");
      }
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Katalog Produk</h1>

      {/* Search and Filter Section */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Cari produk..."
              className="flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="outline">
              Cari
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleCategoryChange(null)}
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              Semua
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id_kategori}
                onClick={() => handleCategoryChange(category.id_kategori)}
                variant={
                  selectedCategory === category.id_kategori
                    ? "default"
                    : "outline"
                }
                size="sm"
                className="rounded-full"
              >
                {category.nama_kategori}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-gray-500">Tidak ada produk yang ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id_barang}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link href={`/user/katalog/detail/${product.slug}`}>
                <div className="relative h-48 w-full">
                  {(product.gambarBarang && product.gambarBarang.length > 0) ||
                  (product.gambar_barang &&
                    product.gambar_barang.length > 0) ? (
                    <img
                      src={
                        product.gambarBarang?.[0]?.url_gambar ||
                        product.gambar_barang?.[0]?.url_gambar
                      }
                      alt={product.nama_barang}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-product.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-400">No Image</p>
                    </div>
                  )}
                </div>
              </Link>

              <CardContent className="p-4">
                <Link
                  href={`/user/katalog/detail/${product.slug}`}
                  className="no-underline text-black"
                >
                  <h2 className="font-semibold text-lg mb-1 hover:text-gray-700 transition-colors">
                    {product.nama_barang}
                  </h2>
                </Link>

                <p className="font-bold text-lg mb-2">
                  Rp {product.harga.toLocaleString("id-ID")}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>Toko: {product.toko.nama_toko}</span>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4 gap-2">
                  <Badge variant="outline" className="rounded-full">
                    {product.kategori.nama_kategori}
                  </Badge>
                  <Badge variant="secondary" className="rounded-full">
                    Grade {product.grade}
                  </Badge>
                </div>
              </CardContent>

              <Separator />

              <CardFooter className="p-3 gap-2">
                <Button
                  onClick={() => handleBuyNow(product)}
                  variant="default"
                  className="flex-1 text-sm"
                >
                  Beli Langsung
                </Button>
                <Button
                  onClick={(e) => handleAddToCart(product, e)}
                  variant="outline"
                  className="flex-1 text-sm"
                  disabled={addingToCart === product.id_barang}
                >
                  {addingToCart === product.id_barang ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-1" />
                  )}
                  Keranjang
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Prev
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
              >
                {page}
              </Button>
            ))}

            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
