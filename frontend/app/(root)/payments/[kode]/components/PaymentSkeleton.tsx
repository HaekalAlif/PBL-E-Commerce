import { Skeleton } from "@/components/ui/skeleton";

export function PaymentSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 to-white">
      <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Title Skeleton */}
        <div className="mb-8 flex justify-center">
          <Skeleton className="h-10 w-64 rounded-full bg-gradient-to-r from-amber-200/70 to-amber-300/70" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card Skeleton */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-amber-100/50">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-32 bg-amber-100/70" />
                  <Skeleton className="h-6 w-24 bg-amber-200/50" />
                </div>

                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48 bg-amber-100/50" />
                        <Skeleton className="h-4 w-24 bg-amber-100/30" />
                      </div>
                      <Skeleton className="h-4 w-24 bg-amber-200/50" />
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-amber-100/30">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24 bg-amber-100/50" />
                    <Skeleton className="h-4 w-32 bg-amber-200/50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Info Card Skeleton */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-amber-100/50">
              <div className="space-y-4">
                <Skeleton className="h-6 w-40 bg-amber-100/70" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-amber-100/50" />
                  <Skeleton className="h-4 w-full bg-amber-100/30" />
                  <Skeleton className="h-4 w-2/3 bg-amber-100/30" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-full">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-amber-100/50 sticky top-6">
              <div className="space-y-6">
                <Skeleton className="h-6 w-40 bg-amber-100/70" />
                <Skeleton className="h-12 w-full bg-gradient-to-r from-amber-300/60 to-amber-400/60 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
