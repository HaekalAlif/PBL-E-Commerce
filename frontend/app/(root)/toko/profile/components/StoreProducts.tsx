import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { motion } from "framer-motion";
import { Product, StoreProductsProps } from "../types";

export const StoreProducts = ({ products }: StoreProductsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Produk Toko</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product: Product) => (
            <motion.div
              key={product.id_barang}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 rounded-lg p-3"
            >
              <div className="aspect-square rounded-md overflow-hidden mb-2">
                <img
                  src={
                    product.gambar_barang?.[0]?.url_gambar ||
                    "/placeholder-product.png"
                  }
                  alt={product.nama_barang}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium text-sm line-clamp-2">
                {product.nama_barang}
              </h3>
              <p className="text-[#F79E0E] font-semibold mt-1">
                {formatRupiah(product.harga)}
              </p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
