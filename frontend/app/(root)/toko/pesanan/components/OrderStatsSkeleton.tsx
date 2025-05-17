import { Skeleton } from "@/components/ui/skeleton";

export function OrderStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg bg-orange-100" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-20 bg-orange-100/80" />
                <Skeleton className="h-6 w-12 bg-orange-100" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
