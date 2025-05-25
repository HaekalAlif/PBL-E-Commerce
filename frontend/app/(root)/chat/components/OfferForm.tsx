import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, MessageSquare, X } from "lucide-react";

interface OfferFormProps {
  quantity: number;
  onSendOffer: (
    price: number,
    quantity: number,
    message: string
  ) => Promise<void>;
  onCancel: () => void;
}

export default function OfferForm({
  quantity,
  onSendOffer,
  onCancel,
}: OfferFormProps) {
  const [offerPrice, setOfferPrice] = useState<string>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!offerPrice.trim()) return;

    setLoading(true);
    try {
      const price = parseInt(offerPrice.replace(/[^0-9]/g, ""));
      await onSendOffer(price, quantity, message);
    } catch (error) {
      console.error("Error sending offer:", error);
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
  };

  return (
    <div className="border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
      <div className="p-3 border-b border-amber-200">
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

      <div className="p-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Quantity Display - Compact */}
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-amber-200">
            <Package className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-gray-700">
              Jumlah: {quantity} item
            </span>
          </div>

          {/* Price Input - Compact */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-amber-800">
              Harga Penawaran
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
                className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white text-sm"
              />
            </div>
          </div>

          {/* Message Input - Compact */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-amber-800">
              Pesan (Opsional)
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tambahkan catatan..."
                rows={2}
                className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white resize-none text-sm"
              />
            </div>
          </div>

          {/* Action Buttons - Compact */}
          <div className="flex gap-2 pt-1">
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
              className="flex-1 bg-gradient-to-r from-[#F79E0E] to-[#FFB648] hover:from-[#F79E0E]/90 hover:to-[#FFB648]/90 text-white font-medium h-9 text-sm"
            >
              {loading ? "Mengirim..." : "Kirim"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
