import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Package, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Barang } from "../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BarangInfoProps {
  barang: Barang;
  formatCurrency: (amount: number) => string;
  onDelete: () => void;
}

export const BarangInfo = ({ barang, formatCurrency }: BarangInfoProps) => {
  const router = useRouter();

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Tersedia":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100/80 text-amber-800 border-amber-200"
          >
            Tersedia
          </Badge>
        );
      case "Terjual":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100/60 text-amber-800 border-amber-200"
          >
            Terjual
          </Badge>
        );
      case "Habis":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100/40 text-amber-800 border-amber-200"
          >
            Habis
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-800">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Price Section */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-6 border border-amber-200/60">
        <h2 className="text-3xl font-bold text-amber-700 mb-3">
          {formatCurrency(barang.harga)}
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          {renderStatusBadge(barang.status_barang)}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span>
              Stok:{" "}
              <span className="font-medium text-gray-900">{barang.stok}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white rounded-xl p-6 border border-amber-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-amber-700/70">Kategori</p>
            <p className="font-medium text-amber-900">
              {barang.kategori.nama_kategori}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-amber-700/70">Grade</p>
            <p className="font-medium text-amber-900">{barang.grade}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-amber-700/70">Berat</p>
            <p className="font-medium text-amber-900">
              {barang.berat_barang} gram
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-amber-700/70">Dimensi</p>
            <p className="font-medium text-amber-900">{barang.dimensi}</p>
          </div>
          <div className="space-y-1 col-span-2">
            <p className="text-sm text-amber-700/70">Kondisi Detail</p>
            <p className="font-medium text-amber-900">
              {barang.kondisi_detail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
