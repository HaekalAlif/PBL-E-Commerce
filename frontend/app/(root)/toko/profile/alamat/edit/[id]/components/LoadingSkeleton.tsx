import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-orange-300 p-6 space-y-6">
      {/* Personal Info Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded bg-orange-100" />
          <Skeleton className="h-6 w-40 bg-orange-100" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-orange-100/80" />
            <Skeleton className="h-10 w-full bg-orange-100/80" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 bg-orange-100/80" />
            <Skeleton className="h-10 w-full bg-orange-100/80" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-32 bg-orange-100/80" />
          <Skeleton className="h-20 w-full bg-orange-100/80" />
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded bg-orange-100" />
          <Skeleton className="h-6 w-36 bg-orange-100" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24 bg-orange-100/80" />
                <Skeleton className="h-10 w-full bg-orange-100/80" />
              </div>
            ))}
        </div>
      </div>

      {/* Checkbox Section */}
      <div className="p-4 bg-orange-50/50 rounded-lg border border-orange-200">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-4 w-4 rounded bg-orange-100" />
          <Skeleton className="h-4 w-48 bg-orange-100/80" />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-orange-100">
        <Skeleton className="h-10 w-20 bg-orange-100/80" />
        <Skeleton className="h-10 w-32 bg-orange-100" />
      </div>
    </div>
  );
}
