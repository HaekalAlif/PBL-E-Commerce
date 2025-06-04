import { Card } from "@/components/ui/card";
import { PencairanStats as PencairanStatsType } from "../types";
import { formatRupiah } from "@/lib/utils";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";

interface PencairanStatsProps {
  stats: PencairanStatsType;
}

export default function PencairanStats({ stats }: PencairanStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      {/* Total Pencairan Amount */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-600">
              Total Pencairan
            </h3>
            <p className="text-xl font-bold text-blue-600">
              {formatRupiah(stats.total_amount)}
            </p>
          </div>
        </div>
      </Card>

      {/* Approved Amount */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-600">
              Telah Diselesaikan
            </h3>
            <p className="text-xl font-bold text-green-600">
              {formatRupiah(stats.approved_amount)}
            </p>
          </div>
        </div>
      </Card>

      {/* Pending Amount */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-100">
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-600">
              Menunggu Proses
            </h3>
            <p className="text-xl font-bold text-orange-600">
              {formatRupiah(stats.pending_amount)}
            </p>
          </div>
        </div>
      </Card>

      {/* Status Overview */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-purple-100">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-600">
              Status Overview
            </h3>
          </div>
        </div>
        <div className="space-y-1">
          {Object.entries(stats.pencairan_statuses).map(([status, count]) => (
            <div
              key={status}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-gray-600">{status}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
