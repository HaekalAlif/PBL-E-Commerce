import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Package,
  MessageSquare,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface OfferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  onSendOffer: (
    price: number,
    quantity: number,
    message: string
  ) => Promise<void>;
  productPrice?: number;
  productName?: string;
}

export default function OfferDialog({
  isOpen,
  onClose,
  quantity,
  onSendOffer,
  productPrice,
  productName,
}: OfferDialogProps) {
  const [offerPrice, setOfferPrice] = useState<string>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!offerPrice.trim()) {
      newErrors.price = "Harga penawaran harus diisi";
    } else {
      const price = parseInt(offerPrice.replace(/[^0-9]/g, ""));
      if (price < 1000) {
        newErrors.price = "Harga minimum Rp 1.000";
      }
      if (productPrice && price > productPrice) {
        newErrors.price = "Penawaran tidak boleh melebihi harga asli";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const price = parseInt(offerPrice.replace(/[^0-9]/g, ""));
      await onSendOffer(price, quantity, message);
      toast.success("Penawaran berhasil dikirim!");

      // Reset form
      setOfferPrice("");
      setMessage("");
      setErrors({});
      onClose();
    } catch (error: any) {
      console.error("Error sending offer:", error);
      toast.error(error.response?.data?.message || "Gagal mengirim penawaran");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^0-9]/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setOfferPrice(formatted);
    if (errors.price) {
      setErrors((prev) => ({ ...prev, price: "" }));
    }
  };

  const calculateSavings = () => {
    if (!productPrice || !offerPrice) return null;
    const price = parseInt(offerPrice.replace(/[^0-9]/g, ""));
    const savings = productPrice - price;
    const percentage = Math.round((savings / productPrice) * 100);
    return { amount: savings, percentage };
  };

  const savings = calculateSavings();

  // Reset form when dialog closes
  const handleClose = () => {
    setOfferPrice("");
    setMessage("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-800">
            <div className="p-1.5 rounded-lg bg-amber-100">
              <DollarSign className="h-4 w-4 text-amber-600" />
            </div>
            Buat Penawaran
          </DialogTitle>
          {productName && (
            <DialogDescription>
              Buat penawaran untuk <strong>{productName}</strong>
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Info */}
          {productPrice && (
            <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <div className="text-sm font-medium text-gray-700">
                📦 {productName}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Harga asli: Rp {productPrice.toLocaleString("id-ID")}
              </div>
            </div>
          )}

          {/* Quantity Display */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
            <Package className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-gray-700">
              Jumlah: {quantity} item
            </span>
          </div>

          {/* Price Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Harga Penawaran <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                Rp
              </span>
              <input
                type="text"
                value={offerPrice}
                onChange={handlePriceChange}
                placeholder="0"
                required
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 bg-white text-sm transition-all ${
                  errors.price
                    ? "border-red-300 focus:border-red-400"
                    : "border-gray-300 focus:border-amber-400"
                }`}
              />
            </div>
            {errors.price && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" />
                {errors.price}
              </div>
            )}

            {/* Savings Display */}
            {savings && savings.amount > 0 && (
              <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                💰 Hemat: Rp {savings.amount.toLocaleString("id-ID")} (
                {savings.percentage}%)
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Pesan Tambahan
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan untuk penjual..."
                rows={3}
                maxLength={200}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white resize-none text-sm"
              />
            </div>
            <div className="text-xs text-gray-400 text-right">
              {message.length}/200
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs text-blue-700">
              <strong>💡 Tips Penawaran:</strong>
              <ul className="mt-1 space-y-1 list-disc list-inside text-xs">
                <li>Berikan alasan yang masuk akal</li>
                <li>Sesuaikan dengan kondisi barang</li>
                <li>Bersikap sopan dan respektif</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading || !offerPrice.trim()}
              className="flex-1 bg-gradient-to-r from-[#F79E0E] to-[#FFB648] hover:from-[#F79E0E]/90 hover:to-[#FFB648]/90 text-white font-medium disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mengirim...
                </div>
              ) : (
                "Kirim Penawaran"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
