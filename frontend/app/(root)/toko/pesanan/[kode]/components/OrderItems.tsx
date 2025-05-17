import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderItem } from "../types";
import { formatRupiah } from "@/lib/utils";
import { motion } from "framer-motion";
import { Package } from "lucide-react";

interface OrderItemsProps {
  items: OrderItem[];
  total: number;
}

export function OrderItems({ items, total }: OrderItemsProps) {
  return (
    <Card className="border-orange-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-[#F79E0E]" />
          Detail Pesanan
        </CardTitle>
        <CardDescription>Produk yang dipesan oleh pelanggan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-orange-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50/50 hover:bg-orange-50">
                <TableHead>Produk</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow
                  key={item.id_barang}
                  className="hover:bg-orange-50/30"
                >
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 mr-3">
                        {item.barang?.gambar_barang &&
                        item.barang.gambar_barang.length > 0 ? (
                          <img
                            src={item.barang.gambar_barang[0].url_gambar}
                            alt={item.barang.nama_barang}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder-product.png";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <span className="line-clamp-2 text-gray-700">
                        {item.barang.nama_barang}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatRupiah(item.harga_satuan)}
                  </TableCell>
                  <TableCell className="text-right">{item.jumlah}</TableCell>
                  <TableCell className="text-right font-medium text-[#F79E0E]">
                    {formatRupiah(item.subtotal)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="hover:bg-orange-50/30">
                <TableCell colSpan={3} className="text-right font-medium">
                  Total Pesanan
                </TableCell>
                <TableCell className="text-right font-bold text-[#F79E0E]">
                  {formatRupiah(total)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
