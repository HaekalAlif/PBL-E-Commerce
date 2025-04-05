"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { formatRupiah } from "@/lib/utils";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Package,
  TruckIcon,
  ShoppingBag,
  CheckCircle2,
  Clock,
  X,
  Search,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id_barang: number;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  barang: {
    id_barang: number;
    nama_barang: string;
    slug: string;
    gambar_barang?: Array<{ url_gambar: string }>;
  };
}

interface Order {
  id_pembelian: number;
  kode_pembelian: string;
  status_pembelian: string;
  created_at: string;
  updated_at: string;
  catatan_pembeli?: string;
  total: number;
  alamat: {
    nama_penerima: string;
    no_telp: string;
    alamat_lengkap: string;
    kode_pos: string;
    district: { name: string };
    regency: { name: string };
    province: { name: string };
  };
  pembeli: {
    id_user: number;
    name: string;
    email: string;
  };
  items: OrderItem[];
  pengiriman?: {
    nomor_resi: string;
    tanggal_pengiriman: string;
    bukti_pengiriman: string;
    catatan_pengiriman?: string;
  };
}

interface OrderStats {
  new_orders: number;
  processing_orders: number;
  shipped_orders: number;
  completed_orders: number;
}

export default function OrdersPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderStats, setOrderStats] = useState<OrderStats>({
    new_orders: 0,
    processing_orders: 0,
    shipped_orders: 0,
    completed_orders: 0,
  });

  // Function to fetch orders
  const fetchOrders = async (status = "all") => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/orders`,
        { params: { status } }
      );

      if (response.data.status === "success") {
        setOrders(response.data.data);
        setFilteredOrders(response.data.data);
      } else {
        setError("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("An error occurred while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch order statistics
  const fetchOrderStats = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/orders/stats`
      );

      if (response.data.status === "success") {
        setOrderStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching order stats:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, []);

  // Filter orders when tab changes
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredOrders(orders);
    } else {
      let statusFilter;
      switch (activeTab) {
        case "new":
          statusFilter = "Dibayar";
          break;
        case "processing":
          statusFilter = "Diproses";
          break;
        case "shipped":
          statusFilter = "Dikirim";
          break;
        case "completed":
          statusFilter = "Selesai";
          break;
        case "canceled":
          statusFilter = "Dibatalkan";
          break;
        default:
          statusFilter = null;
      }

      if (statusFilter) {
        setFilteredOrders(
          orders.filter((order) => order.status_pembelian === statusFilter)
        );
      } else {
        setFilteredOrders(orders);
      }
    }
  }, [activeTab, orders]);

  // Update filtered orders when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      // If search term is empty, just apply the status filter
      if (activeTab === "all") {
        setFilteredOrders(orders);
      } else {
        // Re-apply the active tab filter
        handleTabChange(activeTab);
      }
    } else {
      // Filter by search term within the current active tab filter
      const currentTabOrders =
        activeTab === "all"
          ? orders
          : orders.filter((order) => {
              if (activeTab === "new")
                return order.status_pembelian === "Dibayar";
              if (activeTab === "processing")
                return order.status_pembelian === "Diproses";
              if (activeTab === "shipped")
                return order.status_pembelian === "Dikirim";
              if (activeTab === "completed")
                return order.status_pembelian === "Selesai";
              if (activeTab === "canceled")
                return order.status_pembelian === "Dibatalkan";
              return true;
            });

      const searchResults = currentTabOrders.filter(
        (order) =>
          order.kode_pembelian
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.pembeli.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.barang.nama_barang
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
      );
      setFilteredOrders(searchResults);
    }
  }, [searchTerm]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Re-apply search filter if there's a search term
    if (searchTerm.trim() !== "") {
      setSearchTerm("");
    }
  };

  const handleOrderClick = (order: Order) => {
    router.push(`/user/toko/orders/${order.kode_pembelian}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            <Clock className="w-3 h-3 mr-1" /> Draft
          </Badge>
        );
      case "Menunggu Pembayaran":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="w-3 h-3 mr-1" /> Waiting for Payment
          </Badge>
        );
      case "Dibayar":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Clock className="w-3 h-3 mr-1" /> New Order
          </Badge>
        );
      case "Diproses":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            <Package className="w-3 h-3 mr-1" /> Processing
          </Badge>
        );
      case "Dikirim":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
            <TruckIcon className="w-3 h-3 mr-1" /> Shipped
          </Badge>
        );
      case "Selesai":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
          </Badge>
        );
      case "Dibatalkan":
        return (
          <Badge variant="secondary" className="bg-gray-200">
            <X className="w-3 h-3 mr-1" /> Canceled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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

  const handleRefresh = () => {
    fetchOrders();
    fetchOrderStats();
    toast.success("Orders refreshed");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-gray-500">Manage and process customer orders</p>
        </div>

        <Button
          variant="outline"
          className="mt-2 sm:mt-0"
          onClick={handleRefresh}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Order Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center text-blue-600">
              <Clock className="mr-2 h-4 w-4" /> New Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orderStats.new_orders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center text-purple-600">
              <Package className="mr-2 h-4 w-4" /> Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orderStats.processing_orders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center text-orange-600">
              <TruckIcon className="mr-2 h-4 w-4" /> Shipped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orderStats.shipped_orders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center text-green-600">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orderStats.completed_orders}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-4">
          <CardTitle>Order List</CardTitle>
          <CardDescription>View and manage all customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="mb-6 grid grid-cols-2 sm:grid-cols-6 gap-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="new">
                New
                {orderStats.new_orders > 0 && (
                  <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                    {orderStats.new_orders}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="canceled">Canceled</TabsTrigger>
            </TabsList>

            {/* TabsContent is shared for all tabs, we'll filter the data instead */}
            <TabsContent value={activeTab} className="mt-0">
              <div className="rounded-md border overflow-hidden">
                {loading ? (
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading orders...</span>
                  </div>
                ) : error ? (
                  <div className="text-center p-8 text-red-500">{error}</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center p-8 text-gray-500">
                    No orders found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow
                          key={order.id_pembelian}
                          onClick={() => handleOrderClick(order)}
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <TableCell className="font-medium">
                            {order.kode_pembelian}
                          </TableCell>
                          <TableCell>{order.pembeli.name}</TableCell>
                          <TableCell>{formatDate(order.created_at)}</TableCell>
                          <TableCell>
                            {getStatusBadge(order.status_pembelian)}
                          </TableCell>
                          <TableCell>{order.items.length} item(s)</TableCell>
                          <TableCell className="text-right">
                            {formatRupiah(order.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
