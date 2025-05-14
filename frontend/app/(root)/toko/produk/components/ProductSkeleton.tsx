import { Skeleton } from "@/components/ui/skeleton";

export const ProductSkeleton = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-11 h-11 rounded-xl bg-orange-100" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-40 bg-orange-100" />
          <Skeleton className="h-4 w-56 bg-orange-50" />
        </div>
      </div>
      <Skeleton className="w-32 h-10 rounded-lg bg-orange-100" />
    </div>

    {/* Search and Filter Skeleton */}
    <div className="flex gap-4">
      <Skeleton className="h-10 flex-1 bg-orange-50" />
      <Skeleton className="h-10 w-32 bg-orange-50" />
    </div>

    {/* Product List Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-[200px] rounded-xl bg-orange-50" />
      ))}
    </div>
  </div>
);
