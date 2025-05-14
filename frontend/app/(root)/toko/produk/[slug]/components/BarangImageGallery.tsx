import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { GambarBarang } from "../types";

interface BarangImageGalleryProps {
  images: GambarBarang[];
  selectedImage: string | null;
  productName: string;
  onSelectImage: (url: string) => void;
}

export const BarangImageGallery = ({
  images,
  selectedImage,
  productName,
  onSelectImage,
}: BarangImageGalleryProps) => {
  return (
    <div className="relative">
      <div className="sticky top-24 space-y-4">
        {/* Main Image Container */}
        <div className="aspect-square relative w-full max-w-[420px] mx-auto rounded-lg overflow-hidden bg-amber-50/50 border border-amber-100">
          <motion.img
            key={selectedImage}
            src={selectedImage || "/placeholder-product.png"}
            alt={productName}
            className="w-full h-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-product.png";
            }}
          />

          {/* Navigation Arrows */}
          {images && images.length > 1 && (
            <>
              <button
                onClick={() => {
                  const currentIndex = images.findIndex(
                    (img) => img.url_gambar === selectedImage
                  );
                  const prevIndex =
                    currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                  onSelectImage(images[prevIndex].url_gambar);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => {
                  const currentIndex = images.findIndex(
                    (img) => img.url_gambar === selectedImage
                  );
                  const nextIndex =
                    currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                  onSelectImage(images[nextIndex].url_gambar);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails with updated colors */}
        <div className="grid grid-cols-6 gap-2 mt-4 max-w-[420px] mx-auto">
          {images.map((image) => (
            <motion.button
              key={image.id_gambar}
              className={`relative rounded-md overflow-hidden aspect-square
                ${
                  selectedImage === image.url_gambar
                    ? "ring-2 ring-amber-500 ring-offset-2"
                    : "ring-1 ring-amber-100 hover:ring-amber-300"
                }`}
              onClick={() => onSelectImage(image.url_gambar)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={image.url_gambar}
                alt={`${productName} ${image.id_gambar}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder-product.png";
                }}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
