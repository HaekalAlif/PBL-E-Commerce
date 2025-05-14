import { StoreHeader } from "./StoreHeader";
import { StoreInfo } from "./StoreInfo";
import { StoreProducts } from "./StoreProducts";
import { StoreStats } from "./StoreStats";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { StoreProfile } from "../types";

interface StoreProfileContentProps {
  profile: StoreProfile | null;
  error: string | null;
}

export const StoreProfileContent = ({
  profile,
  error,
}: StoreProfileContentProps) => {
  if (error || !profile) {
    return (
      <Alert variant="destructive" className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error || "Store profile not found"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <StoreHeader profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StoreInfo profile={profile} />
        </div>
        <div className="lg:col-span-2">
          <StoreStats profile={profile} />
          <StoreProducts products={profile.products || []} />
        </div>
      </div>
    </motion.div>
  );
};
