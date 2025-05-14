import { Skeleton } from "@/components/ui/skeleton";

export const StoreSkeleton = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl bg-orange-200" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 bg-orange-200" />
          <Skeleton className="h-4 w-72 bg-orange-200/50" />
        </div>
      </div>
    </div>

    {/* Store Info Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl p-6 border border-orange-100 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-20 rounded-full bg-orange-100" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 bg-orange-100" />
              <Skeleton className="h-4 w-24 bg-orange-50" />
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-5 h-5 bg-orange-100" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-20 bg-orange-50" />
                  <Skeleton className="h-4 w-full bg-orange-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl p-6 border border-orange-100">
          <Skeleton className="h-4 w-48 bg-orange-100 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 bg-orange-50" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
