import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export const AddressSkeleton = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-11 h-11 rounded-xl bg-orange-100" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-40 bg-orange-100" />
          <Skeleton className="h-4 w-56 bg-orange-50" />
        </div>
      </div>
      <Skeleton className="w-32 h-10 rounded-lg bg-orange-100" />
    </div>

    {/* Address List Skeleton */}
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-4 border border-gray-200 rounded-xl"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Skeleton className="w-5 h-5 mt-1 rounded-full bg-orange-100" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-32 bg-orange-100" />
                  <Skeleton className="h-4 w-16 bg-orange-50 rounded-full" />
                </div>
                <Skeleton className="h-4 w-24 bg-orange-50" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-64 bg-orange-50" />
                  <Skeleton className="h-4 w-48 bg-orange-50" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-10 h-10 rounded-lg bg-orange-50" />
              <Skeleton className="w-10 h-10 rounded-lg bg-orange-50" />
              <Skeleton className="w-10 h-10 rounded-lg bg-orange-50" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);
