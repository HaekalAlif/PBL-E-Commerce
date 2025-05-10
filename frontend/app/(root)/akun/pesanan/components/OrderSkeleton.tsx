import { Skeleton } from "@/components/ui/skeleton";

export const OrderSkeleton = () => (
  <div className="space-y-8">
    {/* Header */}
    <div className="flex items-center gap-3">
      <Skeleton className="w-11 h-11 rounded-xl bg-orange-100" />
      <div className="space-y-2">
        <Skeleton className="h-7 w-40 bg-orange-100" />
        <Skeleton className="h-4 w-56 bg-orange-50" />
      </div>
    </div>

    {/* Search and Tabs */}
    <div className="space-y-4">
      <Skeleton className="h-10 w-full bg-orange-50" />
      <Skeleton className="h-12 w-[600px] bg-orange-100/50" />
    </div>

    {/* Orders */}
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-6 space-y-4">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 bg-orange-100" />
              <Skeleton className="h-4 w-24 bg-orange-50" />
            </div>
            <Skeleton className="h-6 w-24 bg-orange-100 rounded-full" />
          </div>
          <div className="space-y-4">
            {[1, 2].map((j) => (
              <div key={j} className="flex gap-4">
                <Skeleton className="w-16 h-16 rounded-lg bg-orange-50" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-orange-50" />
                  <Skeleton className="h-4 w-1/4 bg-orange-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
