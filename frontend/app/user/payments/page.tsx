"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertCircle, CheckCircle, Clock, Ban, ExternalLink } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface PaymentItem {
  id_tagihan: number;
  kode_tagihan: string;
  total_tagihan: number;
  status_pembayaran: string;
  deadline_pembayaran: string;
  tanggal_pembayaran: string | null;
  metode_pembayaran: string;
  midtrans_payment_type?: string;
  pembelian: {
    kode_pembelian: string;
    status_pembelian: string;
    detailPembelian?: Array<{
      barang: {
        nama_barang: string;
      };
      jumlah: number;
    }>;
  };
}

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    fetchPayments();
  }, []);
  
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/payments`);
      
      if (response.data.status === "success") {
        setPayments(response.data.data);
      } else {
        setError("Failed to load payment data");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getPaymentsByStatus = (status: string) => {
    if (status === "all") return payments;
    return payments.filter(payment => payment.status_pembayaran === status);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Dibayar":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Paid</Badge>;
      case "Menunggu":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pending</Badge>;
      case "Expired":
        return <Badge variant="secondary" className="bg-gray-200">Expired</Badge>;
      case "Gagal":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Dibayar":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "Menunggu":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "Expired":
        return <Ban className="h-5 w-5 text-gray-500" />;
      case "Gagal":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };
  
  const getTimeLeft = (deadlineString: string) => {
    const now = new Date();
    const deadline = new Date(deadlineString);
    
    // Return empty string if deadline has passed
    if (deadline <= now) return "";
    
    const diffMs = deadline.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m left`;
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading your payments...</span>
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
              <CardTitle>Error Loading Payments</CardTitle>
            </div>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={fetchPayments}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (payments.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Payments</h1>
        <Card className="w-full py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <CheckCircle className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-medium mb-2">No payments yet</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't made any purchases</p>
            <Button onClick={() => router.push('/user/katalog')}>
              Browse Products
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Your Payments</h1>
      <p className="text-gray-500 mb-6">View and manage all your payments</p>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Menunggu">Pending</TabsTrigger>
          <TabsTrigger value="Dibayar">Paid</TabsTrigger>
          <TabsTrigger value="Expired">Expired</TabsTrigger>
          <TabsTrigger value="Gagal">Failed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {getPaymentsByStatus(activeTab).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center text-center py-12">
                <p className="text-gray-500 mb-4">No {activeTab === "all" ? "" : activeTab.toLowerCase()} payments found</p>
                <Button variant="outline" onClick={() => setActiveTab("all")}>View All Payments</Button>
              </CardContent>
            </Card>
          ) : (
            getPaymentsByStatus(activeTab).map((payment) => (
              <Card key={payment.id_tagihan} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Invoice #{payment.kode_tagihan}
                        {getStatusIcon(payment.status_pembayaran)}
                      </CardTitle>
                      <CardDescription>
                        Order #{payment.pembelian.kode_pembelian}
                      </CardDescription>
                    </div>
                    <div>
                      {getStatusBadge(payment.status_pembayaran)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      {/* Show order summary */}
                      <p className="text-sm text-gray-500">Products:</p>
                      <div className="text-sm">
                        {payment.pembelian.detailPembelian && payment.pembelian.detailPembelian.length > 0 ? (
                          payment.pembelian.detailPembelian.map((item, i) => (
                            <div key={i} className="mt-1">
                              {item.barang.nama_barang} x{item.jumlah}
                            </div>
                          ))
                        ) : (
                          <p>Order items</p>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          {payment.status_pembayaran === "Dibayar" ? (
                            <>
                              Paid on: {payment.tanggal_pembayaran && formatDate(payment.tanggal_pembayaran)}
                            </>
                          ) : payment.status_pembayaran === "Menunggu" ? (
                            <>
                              Due by: {formatDate(payment.deadline_pembayaran)}
                              <span className="ml-2 text-yellow-600 text-xs font-medium">
                                {getTimeLeft(payment.deadline_pembayaran)}
                              </span>
                            </>
                          ) : payment.status_pembayaran === "Expired" ? (
                            <>
                              Expired on: {formatDate(payment.deadline_pembayaran)}
                            </>
                          ) : (
                            <>Payment Failed</>
                          )}
                        </p>
                        
                        <p className="text-sm text-gray-500 mt-1">
                          {payment.metode_pembayaran === "midtrans" ? (
                            <>
                              Method: Midtrans 
                              {payment.midtrans_payment_type && ` (${payment.midtrans_payment_type})`}
                            </>
                          ) : (
                            <>Method: {payment.metode_pembayaran}</>
                          )}
                        </p>
                      </div>
                      
                      <div className="text-xl font-semibold text-right">
                        {formatRupiah(payment.total_tagihan)}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-gray-50 border-t px-6 py-3">
                  <div className="w-full flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                    >
                      <Link href={`/user/orders/${payment.pembelian.kode_pembelian}`}>
                        View Order
                      </Link>
                    </Button>
                    
                    {payment.status_pembayaran === "Menunggu" && (
                      <Button 
                        size="sm" 
                        asChild
                      >
                        <Link href={`/user/payments/${payment.kode_tagihan}`}>
                          Pay Now <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
