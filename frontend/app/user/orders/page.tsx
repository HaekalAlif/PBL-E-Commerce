"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  ShoppingBag,
  CheckCircle,
  Clock,
  Ban,
  Package,
  AlertCircle,
  Truck,
  CalendarClock,
  CircleCheck,
  Search,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface OrderItem {
  id_pembelian: number;
  kode_pembelian: string;
  status_pembelian: string;
  created_at: string;
  updated_at: string;
  alamat: {
    nama_penerima: string;
    alamat_lengkap: string;
    regency: { name: string };
  };
  detailPembelian: Array<{
    id_detail_pembelian: number;
    jumlah: number;
    harga_satuan: number;
    subtotal: number;
    barang: {
      nama_barang: string;
      gambarBarang?: Array<{ url_gambar: string }>;
    };
  }>;
  tagihan?: {
    id_tagihan: number;
    kode_tagihan: string;
    total_tagihan: number;
    status_pembayaran: string;
    metode_pembayaran: string;
  };
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Filter orders based on active tab and search query
    let filtered = [...orders];

    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (order) => order.status_pembelian === activeTab
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.kode_pembelian.toLowerCase().includes(query) ||
          order.alamat?.nama_penerima?.toLowerCase().includes(query) ||
          order.detailPembelian?.some((item) =>
            item.barang?.nama_barang?.toLowerCase().includes(query)
          )
      );
    }

    setFilteredOrders(filtered);
  }, [orders, activeTab, searchQuery]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases`
      );

      console.log("API Response:", response.data); // Debug log to see the actual response

      if (response.data.status === "success") {
        // Check if data exists and is an array
        if (Array.isArray(response.data.data)) {
          // Filter out drafts
          const nonDraftOrders = response.data.data.filter(
            (order: OrderItem) => order.status_pembelian !== "Draft"
          );

          // Sort by newest first
          nonDraftOrders.sort(
            (a: OrderItem, b: OrderItem) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );

          setOrders(nonDraftOrders);
          setFilteredOrders(nonDraftOrders);
        } else {
          // Handle the case where data is not an array
          console.error(
            "API response data is not an array:",
            response.data.data
          );
          setOrders([]);
          setFilteredOrders([]);
          setError("Invalid data format received from server");
        }
      } else {
        setError("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Draft
          </Badge>
        );
      case "Menunggu Pembayaran":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            Awaiting Payment
          </Badge>
        );
      case "Dibayar":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Paid
          </Badge>
        );
      case "Diproses":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            Processing
          </Badge>
        );
      case "Dikirim":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
            Shipped
          </Badge>
        );
      case "Selesai":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Completed
          </Badge>
        );
      case "Dibatalkan":
        return (
          <Badge variant="secondary" className="bg-gray-200">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft":
        return <Package className="h-5 w-5 text-gray-500" />;
      case "Menunggu Pembayaran":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "Dibayar":
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case "Diproses":
        return <Package className="h-5 w-5 text-purple-600" />;
      case "Dikirim":
        return <Truck className="h-5 w-5 text-orange-600" />;
      case "Selesai":
        return <CircleCheck className="h-5 w-5 text-green-600" />;
      case "Dibatalkan":
        return <Ban className="h-5 w-5 text-gray-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const calculateOrderTotal = (order: OrderItem) => {
    if (order.tagihan?.total_tagihan) {
      return order.tagihan.total_tagihan;
    }

    return (
      order.detailPembelian?.reduce((sum, item) => sum + item.subtotal, 0) || 0
    );
  };

  const handleOrderClick = (kode: string) => {
    router.push(`/user/orders/${kode}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading your orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <CardTitle>Error Loading Orders</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={fetchOrders}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        <Card className="w-full py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-medium mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">
              Start shopping to create your first order
            </p>
            <Button onClick={() => router.push("/user/katalog")}>
              Browse Products
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Your Orders</h1>
      <p className="text-gray-500 mb-6">Track and manage your orders</p>

      {/* Search and filters */}
      <div className="mb-6">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by order ID or product..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={fetchOrders}>
            <RefreshIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs for filtering */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="mb-2">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="Menunggu Pembayaran">To Pay</TabsTrigger>
          <TabsTrigger value="Dibayar">Paid</TabsTrigger>
          <TabsTrigger value="Diproses">Processing</TabsTrigger>
          <TabsTrigger value="Dikirim">Shipped</TabsTrigger>
          <TabsTrigger value="Selesai">Completed</TabsTrigger>
          <TabsTrigger value="Dibatalkan">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center text-center py-12">
                <p className="text-gray-500 mb-4">
                  No {activeTab === "all" ? "" : activeTab} orders found
                </p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card
                key={order.id_pembelian}
                className="overflow-hidden hover:shadow-md cursor-pointer transition-shadow"
                onClick={() => handleOrderClick(order.kode_pembelian)}
              >
                <CardHeader className="pb-2 flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {getStatusIcon(order.status_pembelian)}
                      Order #{order.kode_pembelian}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div>{getStatusBadge(order.status_pembelian)}</div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Products Summary */}
                    <div>
                      {order.detailPembelian &&
                        order.detailPembelian.slice(0, 2).map((item, index) => (
                          <div
                            key={item.id_detail_pembelian}
                            className="flex items-center gap-3 my-2"
                          >
                            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              {item.barang.gambarBarang &&
                              item.barang.gambarBarang.length > 0 ? (
                                <img
                                  src={item.barang.gambarBarang[0].url_gambar}
                                  alt={item.barang.nama_barang}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "/placeholder-product.png";
                                  }}
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">
                                  No image
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium line-clamp-1">
                                {item.barang.nama_barang}
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.jumlah} ×{" "}
                                {formatRupiah(item.harga_satuan)}
                              </p>
                            </div>
                          </div>
                        ))}

                      {/* If there are more items */}
                      {order.detailPembelian &&
                        order.detailPembelian.length > 2 && (
                          <p className="text-sm text-gray-500 mt-2">
                            + {order.detailPembelian.length - 2} more item(s)
                          </p>
                        )}
                    </div>

                    <Separator />

                    {/* Shipping and total */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Ship to:</p>
                        <p className="font-medium">
                          {order.alamat?.nama_penerima}
                        </p>
                        <p className="text-sm truncate max-w-[400px]">
                          {order.alamat?.alamat_lengkap},{" "}
                          {order.alamat?.regency?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Order Total:</p>
                        <p className="text-xl font-semibold">
                          {formatRupiah(calculateOrderTotal(order))}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-gray-50 border-t px-6 py-3">
                  <Button variant="outline" className="ml-auto">
                    View Order Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper icon component for the refresh button
const RefreshIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);
