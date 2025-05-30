import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, Package, MessageSquare, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface OfferFormProps {
  quantity: number;
  onSendOffer: (
    price: number,
    quantity: number,
    message: string
  ) => Promise<void>;
  onCancel: () => void;
  productPrice?: number;
  productName?: string;
}

export default function OfferForm({
  quantity,
  onSendOffer,
  onCancel,
  productPrice,
  productName,
}: OfferFormProps) {
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

  return (
    <div className="border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm max-h-96 overflow-y-auto">
      {/* Header - Fixed */}
      <div className="p-3 border-b border-amber-200 bg-amber-50/80 sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100">
              <DollarSign className="h-4 w-4 text-amber-600" />
            </div>
            <span className="font-medium text-amber-800 text-sm">
              Buat Penawaran
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-6 w-6 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="p-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Product Info - Compact */}
          {productName && (
            <div className="p-2 bg-white rounded-lg border border-amber-200">
              <div className="text-sm font-medium text-gray-700 truncate">
                📦 {productName}
              </div>
              {productPrice && (
                <div className="text-xs text-gray-500">
                  Harga: Rp{" "}
                  {productPrice.toLocaleString("id-ID")}
                </div>
              )}
            </div>
          )}

          {/* Quantity Display - Compact */}
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-amber-200">
            <Package className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-gray-700">
              Jumlah: {quantity} item
            </span>
          </div>

          {/* Price Input */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-amber-800">
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
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 bg-white text-sm transition-all ${
                  errors.price
                    ? "border-red-300 focus:border-red-400"
                    : "border-amber-200 focus:border-amber-400"
                }`}
              />
            </div>
            {errors.price && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" />
                {errors.price}
              </div>
            )}

            {/* Savings Display - Compact */}
            {savings && savings.amount > 0 && (
              <div className="text-xs text-green-600 bg-green-50 p-1.5 rounded border border-green-200">
                💰 Hemat: Rp{" "}
                {savings.amount.toLocaleString("id-ID")} ({savings.percentage}%)
              </div>
            )}
          </div>

          {/* Message Input - Compact */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-amber-800">
              Pesan Tambahan
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan untuk penjual..."
                rows={2}
                maxLength={200}
                className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white resize-none text-sm"
              />
            </div>
            <div className="text-xs text-gray-400 text-right">
              {message.length}/200
            </div>
          </div>

          {/* Action Buttons - Sticky at bottom */}
          <div className="flex gap-2 pt-2 bg-gradient-to-br from-amber-50 to-orange-50 -mx-3 px-3 pb-3 mt-3 border-t border-amber-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 h-9 text-sm"
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading || !offerPrice.trim()}
              className="flex-1 bg-gradient-to-r from-[#F79E0E] to-[#FFB648] hover:from-[#F79E0E]/90 hover:to-[#FFB648]/90 text-white font-medium h-9 text-sm disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  Mengirim...
                </div>
              ) : (
                "Kirim Penawaran"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
