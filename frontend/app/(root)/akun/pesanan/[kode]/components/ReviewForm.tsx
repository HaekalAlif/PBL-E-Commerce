import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Star, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import axiosInstance, { getCsrfToken } from "@/lib/axios";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseId: number;
  onSuccess?: () => void;
}

export function ReviewForm({
  isOpen,
  onClose,
  purchaseId,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Mohon berikan rating");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("rating", rating.toString());
    formData.append("komentar", comment);
    if (image) {
      formData.append("image_review", image);
    }

    try {
      const token = await getCsrfToken();
      await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${purchaseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            "X-XSRF-TOKEN": token ?? "",
          },
          withCredentials: true,
        }
      );

      toast.success("Review berhasil dikirim");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengirim review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-white overflow-hidden">
        <div className="relative h-14 bg-gradient-to-r from-orange-50 to-amber-50 flex items-center justify-center">
          <DialogTitle className="text-lg font-medium font-bold text-[#F79E0E]">
            Beri Review
          </DialogTitle>
          <div className="absolute inset-0 bg-[#F79E0E]/5"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Rating Section */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Bagikan pengalaman berbelanja Anda untuk membantu pembeli lain
              membuat keputusan yang lebih baik
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer transition-all duration-200 transform hover:scale-110 ${
                    star <= (hoveredRating || rating)
                      ? "fill-[#F79E0E] text-[#F79E0E] drop-shadow-sm"
                      : "text-gray-200"
                  }`}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-600">
              {rating
                ? `${rating} ${rating === 1 ? "Bintang" : "Bintang"}`
                : "Pilih rating"}
            </span>
          </div>

          {/* Comment Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Komentar Anda
            </label>
            <Textarea
              placeholder="Bagikan detail pengalaman berbelanja Anda..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] resize-none bg-gray-50/50 border-gray-200 focus:border-[#F79E0E] focus:ring-[#F79E0E]/20 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Updated Image Upload Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Foto Produk (Opsional)
            </label>
            <div className="flex flex-col gap-4">
              {imagePreview ? (
                <div className="relative w-full h-36 rounded-lg overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("review-image")?.click()
                  }
                  className="w-full h-36 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#F79E0E] hover:bg-orange-50/50 transition-all flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-[#F79E0E]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Upload Foto
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Klik untuk memilih foto atau drag & drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG (max. 2MB)
                    </p>
                  </div>
                </button>
              )}
              <Input
                id="review-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-200 text-gray-600 hover:bg-gray-50/50"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#F79E0E] hover:bg-[#F79E0E]/90 text-white min-w-[100px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Mengirim</span>
                </div>
              ) : (
                "Kirim Review"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
