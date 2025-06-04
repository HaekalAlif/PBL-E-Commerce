"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

// Import hooks & components
import { useOrderDetail } from "./hooks/useOrderDetail";
import { OrderDetailSkeleton } from "./components/OrderDetailSkeleton";
import { OrderActions } from "./components/OrderActions";
import { OrderItems } from "./components/OrderItems";
import { ShippingInfo } from "./components/ShippingInfo";
import { CustomerInfo } from "./components/CustomerInfo";
import { OrderSummary } from "./components/OrderSummary";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { ShippingDialog } from "./components/ShippingDialog";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "../components/StatusBadge";
import { OrderDetailHeader } from "./components/OrderDetailHeader";
import { KomplainDetails } from "./components/KomplainDetails"; // Import the new component
import { ReviewDetails } from "./components/ReviewDetails";
import { OrderDetail } from "./types";

// Define the OrderDetail type with komplain property
interface OrderDetailType extends OrderDetail {
  komplain?: any; // Adjust 'any' to your actual Komplain type
}

interface PageProps {
  params: {
    kode: string;
  };
}

export default function OrderDetailPage({ params }: PageProps) {
  const { kode } = params;
  const {
    order,
    loading,
    error,
    isProcessing,
    fetchOrderDetail,
    confirmOrder,
    shipOrder,
  } = useOrderDetail(kode);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isShippingDialogOpen, setIsShippingDialogOpen] = useState(false);

  const handleConfirm = async () => {
    const success = await confirmOrder();
    if (success) {
      setIsConfirmDialogOpen(false);
    }
  };

  const handleShip = async (formData: any) => {
    const success = await shipOrder(formData);
    if (success) {
      setIsShippingDialogOpen(false);
    }
    return success;
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [kode]);

  if (loading) {
    return <OrderDetailSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="container mx-auto p-6 min-h-screen bg-gray-50/50">
        <Card className="border-orange-100">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Terjadi Kesalahan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {error || "Gagal memuat detail pesanan"}
            </p>
            <Button
              onClick={fetchOrderDetail}
              className="bg-[#F79E0E] hover:bg-[#F79E0E]/90"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50/50">
      <div className="space-y-6">
        {/* Header */}
        <OrderDetailHeader
          orderCode={order.kode_pembelian}
          orderDate={order.created_at}
          status={order.status_pembelian}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <OrderActions
                order={order}
                onConfirm={() => setIsConfirmDialogOpen(true)}
                onShip={() => setIsShippingDialogOpen(true)}
              />
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <OrderItems items={order.items} total={order.total} />
            </motion.div>

            {/* Shipping Info */}
            {order.pengiriman && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <ShippingInfo pengiriman={order.pengiriman} />
              </motion.div>
            )}

            {/* Review Details */}
            {order.review && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <ReviewDetails review={order.review} />
              </motion.div>
            )}

            {/* Complaint Details */}
            {order.komplain && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <KomplainDetails
                  komplain={order.komplain}
                  kodePembelian={order.kode_pembelian}
                />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <CustomerInfo
                name={order.pembeli.name}
                email={order.pembeli.email}
                alamat={order.alamat}
              />
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <OrderSummary
                kode_pembelian={order.kode_pembelian}
                created_at={order.created_at}
                status_pembelian={order.status_pembelian}
                total={order.total}
                catatan_pembeli={order.catatan_pembeli}
              />
            </motion.div>
          </div>
        </div>

        {/* Dialogs */}
        <ConfirmDialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
          onConfirm={handleConfirm}
          isProcessing={isProcessing}
        />

        <ShippingDialog
          open={isShippingDialogOpen}
          onOpenChange={setIsShippingDialogOpen}
          onShip={handleShip}
          isSubmitting={isProcessing}
        />
      </div>
    </div>
  );
}
