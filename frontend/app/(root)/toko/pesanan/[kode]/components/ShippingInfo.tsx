import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Truck, CalendarDays, FileText, ImageIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShippingInfoProps {
  pengiriman: {
    nomor_resi: string;
    tanggal_pengiriman: string;
    catatan_pengiriman?: string;
    bukti_pengiriman?: string;
  };
}

export function ShippingInfo({ pengiriman }: ShippingInfoProps) {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const imageUrl = pengiriman.bukti_pengiriman
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${pengiriman.bukti_pengiriman}`
    : null;

  return (
    <Card className="border-orange-100">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-50">
            <Truck className="h-4 w-4 text-[#F79E0E]" />
          </div>
          <span className="font-medium">Informasi Pengiriman</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-orange-50/40 p-3 rounded-lg border border-orange-100/50">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <FileText className="h-3.5 w-3.5 text-[#F79E0E]" />
                  Nomor Resi
                </div>
                <p className="text-sm font-medium text-gray-900 tracking-wide">
                  {pengiriman.nomor_resi}
                </p>
              </div>

              <div className="bg-orange-50/40 p-3 rounded-lg border border-orange-100/50">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <CalendarDays className="h-3.5 w-3.5 text-[#F79E0E]" />
                  Tanggal
                </div>
                <p className="text-sm text-gray-900">
                  {formatDate(pengiriman.tanggal_pengiriman, true)}
                </p>
              </div>
            </div>

            {pengiriman.catatan_pengiriman && (
              <div className="mt-3 bg-white border border-orange-100 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Catatan:</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {pengiriman.catatan_pengiriman}
                </p>
              </div>
            )}
          </div>

          {imageUrl && (
            <div className="w-26">
              <div
                className="aspect-[3/4] relative rounded-lg overflow-hidden border border-orange-100 
                         cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => setIsImageOpen(true)}
              >
                <img
                  src={imageUrl}
                  alt="Bukti Pengiriman"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs px-2 py-1"
                  >
                    <ImageIcon className="h-3 w-3 mr-1" />
                    Lihat
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Image Preview Dialog */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="max-w-3xl">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Bukti Pengiriman"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
