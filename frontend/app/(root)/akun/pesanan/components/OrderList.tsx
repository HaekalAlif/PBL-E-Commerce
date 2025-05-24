import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, PackageSearch, RefreshCw } from "lucide-react";
import { OrderCard } from "./OrderCard";
import { OrderListProps } from "../types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const OrderList = ({ 
  orders, 
  activeTab, 
  searchQuery, 
  onSearch, 
  onTabChange,
  refetchOrders 
}: OrderListProps) => {
  const router = useRouter();

  const filteredOrders = orders.filter(order => {
    if (activeTab !== "all" && order.status_pembelian !== activeTab) {
      return false;
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        order.kode_pembelian.toLowerCase().includes(query) ||
        order.alamat?.nama_penerima?.toLowerCase().includes(query) ||
        order.detail_pembelian?.some(item =>
          item.barang?.nama_barang?.toLowerCase().includes(query)
        )
      );
    }
    
    return true;
  });

  const EmptyState = ({ message, isSearch }: { message: string, isSearch?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="bg-orange-50 p-4 rounded-full mb-4">
        <PackageSearch className="w-12 h-12 text-[#F79E0E]" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pesanan</h3>
      <p className="text-gray-500 mb-6 max-w-sm">{message}</p>
      {isSearch && (
        <div className="space-y-3">
          <p className="text-sm text-[#F79E0E]">
            Hasil pencarian untuk "{searchQuery}"
          </p>
          <Button 
            variant="outline" 
            onClick={() => onSearch("")}
            className="gap-2 border-[#F79E0E] text-[#F79E0E] hover:bg-orange-50"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Pencarian
          </Button>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-4">
        {/* Search Section */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F79E0E]" />
            <Input
              type="text"
              placeholder="Cari berdasarkan No. Pesanan, Nama Penerima, atau Produk..."
              className="pl-10 pr-4 py-2 h-11 bg-gray-50/50 border-gray-200 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={refetchOrders}
            className="h-11 gap-2 border-[#F79E0E] text-[#F79E0E] hover:bg-orange-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Tabs Section */}
        <Tabs
          defaultValue={activeTab}
          onValueChange={onTabChange}
          className="w-full"
        >
          <TabsList className="bg-gray-50/80 p-1 border border-gray-100 rounded-lg">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F79E0E] data-[state=active]:shadow-sm"
            >
              Semua Pesanan
            </TabsTrigger>
            <TabsTrigger
              value="Menunggu Pembayaran"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F79E0E] data-[state=active]:shadow-sm"
            >
              Belum Dibayar
            </TabsTrigger>
            <TabsTrigger
              value="Dibayar"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F79E0E] data-[state=active]:shadow-sm"
            >
              Sudah Dibayar
            </TabsTrigger>
            <TabsTrigger
              value="Diproses"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F79E0E] data-[state=active]:shadow-sm"
            >
              Diproses
            </TabsTrigger>
            <TabsTrigger
              value="Dikirim"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F79E0E] data-[state=active]:shadow-sm"
            >
              Dikirim
            </TabsTrigger>
            <TabsTrigger
              value="Diterima"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F79E0E] data-[state=active]:shadow-sm"
            >
              Diterima
            </TabsTrigger>
            <TabsTrigger
              value="Selesai"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F79E0E] data-[state=active]:shadow-sm"
            >
              Selesai
            </TabsTrigger>
            <TabsTrigger
              value="Dibatalkan"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F79E0E] data-[state=active]:shadow-sm"
            >
              Dibatalkan
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <AnimatePresence mode="wait">
              {filteredOrders.length === 0 ? (
                <EmptyState
                  message={
                    searchQuery
                      ? "Tidak dapat menemukan pesanan yang sesuai dengan pencarian Anda"
                      : activeTab === "all"
                      ? "Anda belum memiliki pesanan"
                      : `Tidak ada pesanan dengan status "${activeTab}"`
                  }
                  isSearch={!!searchQuery}
                />
              ) : (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {filteredOrders.map((order) => (
                    <OrderCard
                      key={order.id_pembelian}
                      order={order}
                      onOrderClick={(kode) =>
                        router.push(`/akun/pesanan/${kode}`)
                      }
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
