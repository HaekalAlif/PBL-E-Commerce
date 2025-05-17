import { Skeleton } from "@/components/ui/skeleton";

export const ProductSkeleton = () => (
  <div className="container mx-auto px-4 space-y-6">
    {/* Header Skeleton */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-11 h-11 rounded-xl bg-amber-100" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-40 bg-amber-100" />
          <Skeleton className="h-4 w-56 bg-amber-50" />
        </div>
      </div>
      <Skeleton className="h-10 w-32 bg-amber-100" />
    </div>

    {/* Search and Tabs Skeleton */}
    <div className="bg-white p-4 rounded-xl border border-amber-100 space-y-4">
      <div className="flex gap-3 items-center">
        <Skeleton className="h-10 flex-1 bg-amber-50" />
        <Skeleton className="h-10 w-24 bg-amber-50" />
      </div>
      <Skeleton className="h-12 w-full bg-amber-50" />

      {/* Table Skeleton */}
      <div className="mt-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="py-4 border-b border-amber-100 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-lg bg-amber-50" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48 bg-amber-50" />
                <Skeleton className="h-3 w-24 bg-amber-50/50" />
              </div>
            </div>
            <Skeleton className="h-8 w-20 rounded-full bg-amber-50" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
