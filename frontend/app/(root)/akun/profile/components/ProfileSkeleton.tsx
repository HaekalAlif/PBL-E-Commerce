import { Skeleton } from "@/components/ui/skeleton";

export const ProfileSkeleton = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="flex items-center gap-3">
      <Skeleton className="w-11 h-11 rounded-xl bg-orange-100" />
      <div className="space-y-2">
        <Skeleton className="h-7 w-40 bg-orange-100" />
        <Skeleton className="h-4 w-56 bg-orange-50" />
      </div>
    </div>

    <div className="grid md:grid-cols-12 gap-6 xl:gap-8 min-h-[calc(100%-2rem)]">
      {/* Avatar Section */}
      <div className="md:col-span-4 lg:col-span-3 flex items-center md:items-start">
        <div className="bg-white rounded-xl p-6 w-full flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="w-32 h-32 rounded-full bg-orange-100" />
            <Skeleton className="w-40 h-6 bg-orange-50" />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="md:col-span-8 lg:col-span-9">
        <div className="bg-white rounded-xl p-6 space-y-14">
          {/* Personal Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded bg-orange-100" />
              <Skeleton className="h-7 w-32 bg-orange-100" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2 bg-gray-50/50 rounded-lg p-4">
                  <Skeleton className="h-4 w-20 bg-orange-50" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded bg-orange-50" />
                    <Skeleton className="h-5 flex-grow bg-orange-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded bg-orange-100" />
              <Skeleton className="h-7 w-24 bg-orange-100" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2 bg-gray-50/50 rounded-lg p-4">
                  <Skeleton className="h-4 w-20 bg-orange-50" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded bg-orange-50" />
                    <Skeleton className="h-5 flex-grow bg-orange-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Info */}
          <div className="flex items-center gap-2 bg-orange-50/50 p-3 rounded-lg">
            <Skeleton className="w-4 h-4 bg-orange-100" />
            <Skeleton className="h-4 w-64 bg-orange-100" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
