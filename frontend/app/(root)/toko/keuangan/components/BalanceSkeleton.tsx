import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function BalanceSkeleton() {
  return (
    <div className="space-y-6">
      {/* Balance Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-orange-100">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-lg bg-orange-100" />
                <Skeleton className="h-5 w-24 bg-orange-100" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2 bg-orange-100" />
              <Skeleton className="h-4 w-20 bg-orange-100" />
            </CardContent>
          </Card>
        ))}

        {/* Withdraw Button Skeleton */}
        <Card className="border-orange-100 md:col-span-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-5 w-24 mb-1 bg-orange-100" />
                <Skeleton className="h-4 w-48 bg-orange-100" />
              </div>
              <Skeleton className="h-10 w-32 bg-orange-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Skeleton */}
      <Card className="border-orange-100">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg bg-orange-100" />
            <Skeleton className="h-6 w-32 bg-orange-100" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-orange-50/30 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-11 w-11 rounded-lg bg-orange-100" />
                <div>
                  <Skeleton className="h-5 w-32 mb-2 bg-orange-100" />
                  <Skeleton className="h-4 w-48 bg-orange-100" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-6 w-24 mb-1 bg-orange-100" />
                <Skeleton className="h-4 w-16 bg-orange-100" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
