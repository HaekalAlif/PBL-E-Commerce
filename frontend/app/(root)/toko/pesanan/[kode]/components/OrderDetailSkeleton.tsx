import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb Skeleton */}
      <nav className="text-sm">
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-4 w-16 bg-orange-100/50" />
              <Skeleton className="h-4 w-4 rounded-full bg-orange-100/50" />
            </div>
          ))}
        </div>
      </nav>

      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-orange-100">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-orange-100" />
          <Skeleton className="h-4 w-36 bg-orange-100" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full bg-orange-100 mt-2 md:mt-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Actions Card */}
          <Card className="border-orange-100">
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-orange-100" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full bg-orange-100" />
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border-orange-100">
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-orange-100" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-20 h-20 rounded-lg bg-orange-100" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-orange-100" />
                    <Skeleton className="h-4 w-1/4 bg-orange-100" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card className="border-orange-100">
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-orange-100" />
                  <Skeleton className="h-4 w-32 bg-orange-100" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-orange-100" />
                  <Skeleton className="h-4 w-32 bg-orange-100" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="border-orange-100">
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-orange-100" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-orange-100" />
                <Skeleton className="h-4 w-3/4 bg-orange-100" />
              </div>
              <Skeleton className="h-px w-full bg-orange-100" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-orange-100" />
                <Skeleton className="h-4 w-full bg-orange-100" />
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="border-orange-100">
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-orange-100" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20 bg-orange-100" />
                    <Skeleton className="h-4 w-24 bg-orange-100" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
