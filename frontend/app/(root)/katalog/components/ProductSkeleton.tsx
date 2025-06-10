import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function ProductSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-gray-200 bg-white h-full flex flex-col">
        {/* Image skeleton */}
        <div className="relative h-48 w-full">
          <Skeleton className="h-full w-full bg-gray-100" />
          {/* Badge skeleton */}
          <div className="absolute top-2 left-2">
            <Skeleton className="h-5 w-12 bg-gray-200" />
          </div>
        </div>

        <CardContent className="p-3 flex-1">
          {/* Title skeleton */}
          <Skeleton className="h-4 w-4/5 mb-2 bg-gray-200" />
          <Skeleton className="h-4 w-3/5 mb-3 bg-gray-200" />

          {/* Price skeleton */}
          <Skeleton className="h-5 w-2/3 mb-3 bg-[#F79E0E]/20" />

          {/* Store info skeleton */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 bg-gray-200" />
              <Skeleton className="h-3 w-2/3 bg-gray-200" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-4 w-16 bg-gray-100" />
              <Skeleton className="h-4 w-12 bg-green-100" />
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-3 pt-0 gap-2">
          <Skeleton className="h-8 flex-1 bg-[#F79E0E]/20" />
          <Skeleton className="h-8 w-8 bg-gray-100" />
        </CardFooter>
      </Card>
    </motion.div>
  );
}
