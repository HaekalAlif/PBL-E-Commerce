import { Card } from "@/components/ui/card";
import { KomplainStats as KomplainStatsType } from "../types";

interface KomplainStatsProps {
  stats: KomplainStatsType;
}

export default function KomplainStats({ stats }: KomplainStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      {/* Status Overview */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm text-gray-600">Status Komplain</h3>
        <div className="mt-4 space-y-2">
          {Object.entries(stats.complaint_statuses).map(([status, count]) => (
            <div key={status} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{status}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Complaint Types */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm text-gray-600">Jenis Komplain</h3>
        <div className="mt-4 space-y-2">
          {Object.entries(stats.complaint_types).map(([type, count]) => (
            <div key={type} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{type}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly Trend */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm text-gray-600">Trend Mingguan</h3>
        <div className="mt-4 space-y-2">
          {stats.last_week_complaints.map((item) => (
            <div key={item.date} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {new Date(item.date).toLocaleDateString("id-ID", {
                  weekday: "short",
                  day: "numeric",
                })}
              </span>
              <span className="font-semibold">{item.count}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
