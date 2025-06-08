import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-orange-300 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-orange-100" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full bg-orange-100/80" />
            <Skeleton className="h-6 w-20 bg-orange-100/80" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 bg-orange-100/80" />
          <Skeleton className="h-9 w-16 bg-orange-100/80" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-24 bg-orange-100" />
        <Skeleton className="h-4 w-full bg-orange-100/80" />
        <Skeleton className="h-4 w-3/4 bg-orange-100/80" />
      </div>

      {/* Contact */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-16 bg-orange-100" />
        <Skeleton className="h-4 w-32 bg-orange-100/80" />
      </div>

      {/* Address */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32 bg-orange-100" />
          <Skeleton className="h-8 w-28 bg-orange-100/80" />
        </div>
        <div className="p-4 border rounded-lg space-y-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32 bg-orange-100/80" />
              <Skeleton className="h-4 w-28 bg-orange-100/80" />
            </div>
            <Skeleton className="h-6 w-12 rounded-full bg-orange-100/80" />
          </div>
          <Skeleton className="h-4 w-full bg-orange-100/80" />
          <Skeleton className="h-4 w-2/3 bg-orange-100/80" />
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-orange-50/50 p-4 rounded-lg space-y-2">
        <Skeleton className="h-5 w-28 bg-orange-100" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Skeleton className="h-4 w-full bg-orange-100/80" />
          <Skeleton className="h-4 w-full bg-orange-100/80" />
          <Skeleton className="h-4 w-full bg-orange-100/80" />
        </div>
      </div>
    </div>
  );
}
