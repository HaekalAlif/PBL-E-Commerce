import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formatter";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ReturForm } from "./ReturForm";
import { Komplain, OrderDetail } from "../types";
import { useOrderDetail } from "../hooks/useOrderDetail";

interface KomplainDetailsProps {
  komplain: Komplain;
  kodePembelian: string;
}

export function KomplainDetails({
  komplain,
  kodePembelian,
}: KomplainDetailsProps) {
  const [isReturFormOpen, setIsReturFormOpen] = useState(false);

  const { order } = useOrderDetail(kodePembelian);

  // Safely access detail_pembelian and id_detail
  const detailPembelianId = order?.detail_pembelian?.[0]?.id_detail;

  console.log("Debug KomplainDetails:", {
    komplain,
    kodePembelian,
    orderData: order,
    detailPembelian: order?.detail_pembelian?.[0],
    detailPembelianId,
    komplainStatus: komplain.status_komplain,
    hasRetur: !!komplain.retur,
    returData: komplain.retur, // Log retur data
  });

  // Tambahkan kondisi untuk memastikan data tersedia
  const showReturButton =
    komplain.status_komplain === "Diproses" &&
    !komplain.retur &&
    !!detailPembelianId;

  return (
    <Card className="border-orange-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-lg bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-[#F79E0E]" />
          </div>
          <span className="font-medium">Detail Komplain</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Status</span>
            <span className="font-medium text-[#F79E0E]">
              {komplain.status_komplain}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tanggal Komplain</span>
            <span className="font-medium">
              {formatDate(komplain.created_at)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Alasan</span>
            <span className="font-medium">{komplain.alasan_komplain}</span>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-gray-600">Detail Komplain</span>
            <p className="text-sm bg-gray-50/80 p-3 rounded-lg border border-gray-100">
              {komplain.isi_komplain}
            </p>
          </div>
          {komplain.bukti_komplain && (
            <div className="space-y-2">
              <span className="text-sm text-gray-600">Bukti Foto</span>
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-100">
                <Image
                  src={komplain.bukti_komplain}
                  alt="Bukti Komplain"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Display Retur Data */}
        {komplain.retur && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700">Detail Retur</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status Retur</span>
              <span className="font-medium">{komplain.retur.status_retur}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Alasan Retur</span>
              <span className="font-medium">{komplain.retur.alasan_retur}</span>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-gray-600">Deskripsi Retur</span>
              <p className="text-sm bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                {komplain.retur.deskripsi_retur}
              </p>
            </div>
            {komplain.retur.foto_bukti && (
              <div className="space-y-2">
                <span className="text-sm text-gray-600">Bukti Foto Retur</span>
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-100">
                  <Image
                    src={komplain.retur.foto_bukti}
                    alt="Bukti Retur"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {showReturButton && (
          <div className="pt-4 border-t">
            <Button
              onClick={() => setIsReturFormOpen(true)}
              className="w-full bg-[#F79E0E] hover:bg-[#F79E0E]/90"
            >
              Ajukan Retur Barang
            </Button>
          </div>
        )}

        {detailPembelianId && (
          <ReturForm
            isOpen={isReturFormOpen}
            onClose={() => setIsReturFormOpen(false)}
            komplainId={komplain.id_komplain}
            pembelianId={komplain.id_pembelian}
            detailPembelianId={detailPembelianId}
            onSuccess={() => {
              setIsReturFormOpen(false);
              // Optional: Add a callback to refresh the komplain data
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
