import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Order, OrderStats } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { formatRupiah } from "@/lib/utils";
import { Loader2, Search, PackageSearch, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { OrderTableSkeleton } from "./OrderTableSkeleton";

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  orderStats: OrderStats;
  onRefresh: () => void;
}

export function OrderTable({
  orders,
  loading,
  error,
  orderStats,
  onRefresh,
}: OrderTableProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

  // Format date helper function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Apply filters when orders, tab, or search term changes
  useEffect(() => {
    let filtered = orders;

    // First apply status filter
    if (activeTab !== "all") {
      const statusMap = {
        new: "Dibayar",
        processing: "Diproses",
        shipped: "Dikirim",
        completed: "Selesai",
        canceled: "Dibatalkan",
      };
      filtered = orders.filter(
        (order) =>
          order.status_pembelian ===
          statusMap[activeTab as keyof typeof statusMap]
      );
    }

    // Then apply search filter
    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.kode_pembelian.toLowerCase().includes(search) ||
          order.pembeli.name.toLowerCase().includes(search) ||
          order.items.some((item) =>
            item.barang.nama_barang.toLowerCase().includes(search)
          )
      );
    }

    setFilteredOrders(filtered);
  }, [orders, activeTab, searchTerm]);

  const handleOrderClick = (order: Order) => {
    router.push(`/toko/pesanan/${order.kode_pembelian}`);
  };

  if (loading) {
    return <OrderTableSkeleton />;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="bg-white p-6 rounded-xl border border-orange-300">
        {/* Search Section */}
        <div className="flex gap-3 items-center mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F79E0E]" />
            <Input
              placeholder="Cari berdasarkan No. Pesanan, Pembeli, atau Produk..."
              className="pl-10 pr-4 py-2 h-11 bg-gray-50/50 border-orange-300 focus:border-[#F79E0E] focus:ring-[#F79E0E]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={onRefresh}
            className="h-11 gap-2 border-[#F79E0E] text-[#F79E0E] hover:bg-orange-50"
          >
            <RefreshCw className="h-4 w-4" />
            Segarkan
          </Button>
        </div>

        {/* Tabs Section with adjusted spacing */}
        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="bg-gray-50/80 p-1.5 border border-gray-100 rounded-lg">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F79E0E] data-[state=active]:shadow-sm"
            >
              Semua Pesanan
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F79E0E] data-[state=active]:shadow-sm"
            >
              Baru
              {orderStats.new_orders > 0 && (
                <span className="ml-1 bg-[#F79E0E] text-white text-xs px-1.5 py-0.5 rounded-full">
                  {orderStats.new_orders}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="processing"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F79E0E] data-[state=active]:shadow-sm"
            >
              Diproses
            </TabsTrigger>
            <TabsTrigger
              value="shipped"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F79E0E] data-[state=active]:shadow-sm"
            >
              Dikirim
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F79E0E] data-[state=active]:shadow-sm"
            >
              Selesai
            </TabsTrigger>
            <TabsTrigger
              value="canceled"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F79E0E] data-[state=active]:shadow-sm"
            >
              Dibatalkan
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <AnimatePresence mode="wait">
              {filteredOrders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="bg-orange-50 p-4 rounded-full mb-4">
                    <PackageSearch className="w-12 h-12 text-[#F79E0E]" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tidak ada pesanan
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-sm">
                    {searchTerm
                      ? "Tidak dapat menemukan pesanan yang sesuai dengan pencarian"
                      : `Tidak ada pesanan ${
                          activeTab === "all"
                            ? ""
                            : "dengan status " + activeTab
                        }`}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border  border-orange-300 overflow-hidden"
                >
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead>No. Pesanan</TableHead>
                        <TableHead>Pembeli</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Jumlah Item</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow
                          key={order.id_pembelian}
                          onClick={() => handleOrderClick(order)}
                          className="cursor-pointer hover:bg-orange-50/30"
                        >
                          <TableCell className="font-medium text-[#F79E0E]">
                            {order.kode_pembelian}
                          </TableCell>
                          <TableCell>{order.pembeli.name}</TableCell>
                          <TableCell>{formatDate(order.created_at)}</TableCell>
                          <TableCell>
                            <StatusBadge status={order.status_pembelian} />
                          </TableCell>
                          <TableCell>{order.items.length} item</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatRupiah(order.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
