import { Skeleton } from "@/components/ui/skeleton";

export function AddressSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-orange-300 p-6"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-6 w-32 bg-orange-100" />
                  <Skeleton className="h-6 w-16 rounded-full bg-orange-100/80" />
                </div>
                <Skeleton className="h-4 w-28 bg-orange-100/80" />
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Skeleton className="h-8 w-24 bg-orange-100/80" />
                <Skeleton className="h-8 w-16 bg-orange-100/80" />
                <Skeleton className="h-8 w-16 bg-orange-100/80" />
              </div>
            </div>
            
            <div className="h-px bg-orange-100 my-3" />
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-orange-100/80" />
              <Skeleton className="h-4 w-3/4 bg-orange-100/80" />
            </div>
          </div>
        ))}
    </div>
  );
}
