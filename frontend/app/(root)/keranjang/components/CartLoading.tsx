import { Skeleton } from "@/components/ui/skeleton";

export function CartLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-white">
      <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 right-10 w-72 h-72 bg-amber-200 rounded-full opacity-10 blur-3xl" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-orange-200 rounded-full opacity-10 blur-3xl" />
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Cart Items */}
            <div className="flex-1 space-y-6">
              <Skeleton className="h-8 w-48 bg-gradient-to-r from-amber-100 to-amber-200" />

              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm border border-amber-100/50 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-amber-100/30">
                      <Skeleton className="h-5 w-5 rounded bg-amber-100" />
                      <Skeleton className="h-6 w-32 bg-gradient-to-r from-amber-100 to-amber-200" />
                    </div>

                    <div className="pt-4 space-y-4">
                      {[...Array(2)].map((_, j) => (
                        <div key={j} className="flex gap-4">
                          <Skeleton className="h-5 w-5 rounded bg-amber-100" />
                          <Skeleton className="h-24 w-24 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-3/4 bg-gradient-to-r from-amber-100 to-amber-200" />
                            <Skeleton className="h-4 w-1/4 bg-amber-100/70" />
                            <Skeleton className="h-5 w-1/3 bg-gradient-to-r from-amber-200 to-amber-300" />
                            <div className="flex justify-between items-center mt-4">
                              <Skeleton className="h-10 w-32 rounded-full bg-amber-100" />
                              <Skeleton className="h-10 w-10 rounded-full bg-amber-100" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Order Summary */}
            <div className="w-full lg:w-[380px]">
              <div className="bg-white rounded-xl shadow-sm border border-amber-100/50 p-6">
                <Skeleton className="h-7 w-40 mb-6 bg-gradient-to-r from-amber-100 to-amber-200" />
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-24 bg-amber-100" />
                    <Skeleton className="h-5 w-28 bg-amber-100" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-20 bg-gradient-to-r from-amber-200 to-amber-300" />
                    <Skeleton className="h-6 w-32 bg-gradient-to-r from-amber-200 to-amber-300" />
                  </div>
                  <div className="pt-4 space-y-3">
                    <Skeleton className="h-12 w-full bg-gradient-to-r from-amber-300 to-amber-400" />
                    <Skeleton className="h-12 w-full bg-amber-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
