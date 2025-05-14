import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";

export const EditAddressSkeleton = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="flex items-center gap-3">
      <Skeleton className="w-11 h-11 rounded-xl bg-orange-100" />
      <div className="space-y-2">
        <Skeleton className="h-7 w-40 bg-orange-100" />
        <Skeleton className="h-4 w-56 bg-orange-50" />
      </div>
    </div>

    {/* Form Skeleton */}
    <Card className="border-orange-100 shadow-sm">
      <CardContent className="space-y-6 p-6">
        {/* Form Fields */}
        <motion.div className="space-y-6">
          {/* Nama Penerima */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 bg-orange-100" />
            <Skeleton className="h-10 w-full bg-orange-50" />
          </div>

          {/* No Telepon */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-28 bg-orange-100" />
            <Skeleton className="h-10 w-full bg-orange-50" />
          </div>

          {/* Alamat */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-36 bg-orange-100" />
            <Skeleton className="h-24 w-full bg-orange-50" />
          </div>

          {/* Provinsi */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 bg-orange-100" />
            <Skeleton className="h-10 w-full bg-orange-50" />
          </div>

          {/* Kota */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 bg-orange-100" />
            <Skeleton className="h-10 w-full bg-orange-50" />
          </div>

          {/* Kecamatan */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-28 bg-orange-100" />
            <Skeleton className="h-10 w-full bg-orange-50" />
          </div>

          {/* Kode Pos */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 bg-orange-100" />
            <Skeleton className="h-10 w-full bg-orange-50" />
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <Skeleton className="h-5 w-5 bg-orange-100" />
            <Skeleton className="h-5 w-48 bg-orange-50" />
          </div>
        </motion.div>
      </CardContent>

      <CardFooter className="flex justify-between gap-4 px-6 py-4 border-t border-orange-100">
        <Skeleton className="h-10 w-24 bg-orange-50" />
        <Skeleton className="h-10 w-32 bg-orange-100" />
      </CardFooter>
    </Card>
  </div>
);
