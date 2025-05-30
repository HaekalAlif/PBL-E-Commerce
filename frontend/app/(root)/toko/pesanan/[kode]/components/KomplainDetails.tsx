import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formatter";
import Image from "next/image";
import { Komplain } from "../types";

interface KomplainDetailsProps {
  komplain: Komplain;
  kodePembelian: string;
}

export function KomplainDetails({ komplain }: KomplainDetailsProps) {
  return (
    <Card className="border-orange-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="font-medium">Detail Komplain</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium">{komplain.status_komplain}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tanggal Pengajuan:</span>
            <span className="font-medium">
              {formatDate(komplain.created_at)}
            </span>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-gray-600">Alasan Komplain:</span>
            <p className="text-sm bg-gray-50/80 p-3 rounded-lg border border-gray-100">
              {komplain.alasan_komplain}
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-gray-600">Isi Komplain:</span>
            <p className="text-sm bg-gray-50/80 p-3 rounded-lg border border-gray-100">
              {komplain.isi_komplain}
            </p>
          </div>
          {komplain.bukti_komplain && (
            <div className="space-y-2">
              <span className="text-sm text-gray-600">Bukti Foto</span>
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-100 max-w-80">
                <Image
                  src={komplain.bukti_komplain}
                  alt="Bukti Komplain"
                  fill
                  className="object-contain"
                  style={{ objectFit: "cover" }}
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
              <span className="text-gray-600">Status Retur:</span>
              <span className="font-medium">{komplain.retur.status_retur}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Alasan Retur:</span>
              <span className="font-medium">{komplain.retur.alasan_retur}</span>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-gray-600">Deskripsi Retur:</span>
              <p className="text-sm bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                {komplain.retur.deskripsi_retur}
              </p>
            </div>
            {komplain.retur.foto_bukti && (
              <div className="space-y-2">
                <span className="text-sm text-gray-600">Bukti Foto Retur</span>
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-100 max-w-80">
                  <Image
                    src={komplain.retur.foto_bukti}
                    alt="Bukti Retur"
                    fill
                    className="object-contain"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
