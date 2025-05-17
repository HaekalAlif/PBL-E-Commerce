import { Skeleton } from "@/components/ui/skeleton";

export function OrderTableSkeleton() {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-4">
      {/* Search and Refresh */}
      <div className="flex gap-3 items-center">
        <Skeleton className="h-11 flex-1 bg-orange-100" />
        <Skeleton className="h-11 w-[100px] bg-orange-100" />
      </div>

      {/* Tabs */}
      <Skeleton className="h-11 w-full bg-orange-100/70 rounded-lg" />

      {/* Table */}
      <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50/80 p-4">
          <div className="grid grid-cols-6 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-5 w-full bg-orange-100" />
              ))}
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="p-4 hover:bg-orange-50/30 transition-colors"
              >
                <div className="grid grid-cols-6 gap-4 items-center">
                  <Skeleton className="h-5 w-full bg-orange-100/80" />
                  <Skeleton className="h-5 w-full bg-orange-100/80" />
                  <Skeleton className="h-5 w-full bg-orange-100/80" />
                  <Skeleton className="h-7 w-24 rounded-full bg-orange-100" />
                  <Skeleton className="h-5 w-16 bg-orange-100/80" />
                  <Skeleton className="h-5 w-24 ml-auto bg-orange-100/80" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
