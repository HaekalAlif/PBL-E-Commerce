import { motion } from "framer-motion";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { ProductSkeleton } from "./ProductSkeleton";
import { EmptyProducts } from "./EmptyProducts";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  processingBuyNow: number | null;
  onBuyNow: (product: Product) => void;
}

export function ProductGrid({
  products,
  loading,
  processingBuyNow,
  onBuyNow,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyProducts />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id_barang}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ProductCard
            product={product}
            processingBuyNow={processingBuyNow}
            onBuyNow={onBuyNow}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
