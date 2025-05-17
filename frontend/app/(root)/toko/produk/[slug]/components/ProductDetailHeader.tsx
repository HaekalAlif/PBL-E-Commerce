import { Package, ChevronRight, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";

interface ProductDetailHeaderProps {
  productName: string | undefined;
  productSlug: string | undefined;
  onDelete: () => void;
}

export const ProductDetailHeader = ({
  productName,
  productSlug,
  onDelete,
}: ProductDetailHeaderProps) => {
  const router = useRouter();

  return (
    <div className="space-y-2">
      {/* Breadcrumb with updated styling */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center py-2"
      >
        <ol className="flex items-center space-x-2">
          <li>
            <Link
              href="/toko/profile"
              className="text-gray-500 hover:text-[#F79E0E]"
            >
              Toko
            </Link>
          </li>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <li>
            <Link
              href="/toko/produk"
              className="text-gray-500 hover:text-[#F79E0E]"
            >
              Produk
            </Link>
          </li>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <li>
            <span className="text-gray-500">Detail Produk</span>
          </li>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <li className="text-[#F79E0E] font-medium">{productName}</li>
        </ol>
      </motion.nav>

      {/* Header Content */}
      <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-white shadow-lg shadow-orange-100">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{productName}</h1>
              <p className="text-sm text-gray-500">
                Detail informasi produk toko
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/toko/produk/edit/${productSlug}`)}
              className="border-amber-500 text-amber-500 hover:bg-amber-50"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Produk
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Hapus Produk
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus produk ini?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-[#F79E0E] hover:bg-[#E08D0D] text-white"
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};
