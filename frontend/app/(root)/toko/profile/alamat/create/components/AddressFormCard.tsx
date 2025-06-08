import { motion } from "framer-motion";
import { FormData, RegionData, LoadingStates } from "../types";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { LocationSection } from "./LocationSection";
import { FormActions } from "./FormActions";
import { AlertSection } from "./AlertSection";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

interface AddressFormCardProps {
  formData: FormData;
  regionData: RegionData;
  loading: LoadingStates;
  error: string | null;
  success: string | null;
  onUpdateFormData: (field: keyof FormData, value: string | boolean) => void;
  onSubmit: () => Promise<boolean>;
  onCancel: () => void;
}

export function AddressFormCard({
  formData,
  regionData,
  loading,
  error,
  success,
  onUpdateFormData,
  onSubmit,
  onCancel,
}: AddressFormCardProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-orange-300 p-6 shadow-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AlertSection error={error} success={success} />

        <PersonalInfoSection
          formData={formData}
          onUpdateFormData={onUpdateFormData}
        />

        <LocationSection
          formData={formData}
          regionData={regionData}
          loading={loading}
          onUpdateFormData={onUpdateFormData}
        />

        {/* Primary Address Checkbox Section */}
        <div className="flex items-center space-x-3 p-4 bg-orange-50/50 rounded-lg border border-orange-200">
          <Checkbox
            id="is_primary"
            checked={formData.is_primary}
            onCheckedChange={(checked) =>
              onUpdateFormData("is_primary", checked as boolean)
            }
            className="border-[#F79E0E] data-[state=checked]:bg-[#F79E0E]"
          />
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-[#F79E0E]" />
            <Label
              htmlFor="is_primary"
              className="text-gray-700 font-medium cursor-pointer"
            >
              Jadikan sebagai alamat utama toko
            </Label>
          </div>
        </div>

        <FormActions loading={loading.form} onCancel={onCancel} />
      </form>
    </motion.div>
  );
}
