import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const OrderDetailSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-16 bg-orange-100/50" />
                <Skeleton className="h-4 w-4 rounded-full bg-orange-100/50" />
              </div>
            ))}
          </div>
        </nav>

        {/* Header Content */}
        <div className="flex justify-between items-start bg-white p-6 rounded-xl shadow-sm border border-orange-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F79E0E] to-[#FFB648]">
                <Skeleton className="h-6 w-6 bg-white/40" />
              </div>
              <Skeleton className="h-7 w-48 bg-orange-100" />
            </div>
            <Skeleton className="h-4 w-32 bg-orange-50" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full bg-orange-100" />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Timeline */}
          <Card className="border border-orange-100">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-32 bg-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="relative ml-6 mt-3 space-y-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative pb-1">
                    <div className="absolute left-[-30px] rounded-full w-[30px] h-[30px] bg-orange-100" />
                    <div className="ml-2">
                      <Skeleton className="h-5 w-24 bg-orange-100 mb-1" />
                      <Skeleton className="h-4 w-48 bg-orange-50" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border border-orange-100">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-40 bg-orange-100" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 pb-4 border-b last:pb-0 last:border-0"
                >
                  <Skeleton className="w-16 h-16 rounded-lg bg-orange-50" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4 bg-orange-100" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20 bg-orange-50" />
                      <Skeleton className="h-4 w-24 bg-orange-50" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card className="border border-orange-100">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-40 bg-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-32 bg-orange-100" />
                    <Skeleton className="h-4 w-48 bg-orange-50" />
                    <Skeleton className="h-4 w-full bg-orange-50" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Payment Summary */}
        <div className="space-y-6">
          <Card className="border border-orange-100">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-40 bg-orange-100" />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Details */}
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24 bg-orange-50" />
                    <Skeleton className="h-4 w-20 bg-orange-50" />
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16 bg-orange-100" />
                  <Skeleton className="h-5 w-24 bg-orange-100" />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Skeleton className="h-10 w-full bg-orange-100" />
                <Skeleton className="h-10 w-full bg-orange-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
