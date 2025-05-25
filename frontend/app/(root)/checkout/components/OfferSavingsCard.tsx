import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Gift, Sparkles } from "lucide-react";

interface OfferSavingsCardProps {
  totalSavings: number;
}

export function OfferSavingsCard({ totalSavings }: OfferSavingsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (totalSavings <= 0) {
    return null;
  }

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 overflow-hidden relative shadow-lg">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="absolute top-2 right-2 text-green-400">
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="absolute top-8 right-8 text-green-300">
          <Gift className="h-6 w-6" />
        </div>
        <div className="absolute top-14 right-2 text-green-200">
          <TrendingDown className="h-4 w-4" />
        </div>
      </div>

      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 border border-green-200 shadow-sm">
              <TrendingDown className="h-6 w-6 text-green-600" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-green-800 text-lg">
                  Penghematan dari Penawaran
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 text-xs font-medium"
                >
                  💰 Hemat
                </Badge>
              </div>
              <p className="text-green-600 text-sm">
                Anda mendapatkan harga khusus yang telah disepakati
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-green-600 font-medium mb-1">
              Total Penghematan
            </div>
            <div className="text-2xl font-bold text-green-700">
              {formatCurrency(totalSavings)}
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-4 p-3 bg-white/60 rounded-lg border border-green-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-600 flex items-center gap-1">
              <Gift className="h-4 w-4" />
              Keuntungan Bernegosiasi
            </span>
            <span className="text-green-700 font-medium">
              Harga lebih murah dari harga normal
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
