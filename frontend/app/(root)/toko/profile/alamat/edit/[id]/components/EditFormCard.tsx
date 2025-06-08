import { motion } from "framer-motion";
import { FormData, RegionData, LoadingStates } from "../types";
import { PersonalInfoSection } from "../../../create/components/PersonalInfoSection";
import { LocationSection } from "../../../create/components/LocationSection";
import { AlertSection } from "../../../create/components/AlertSection";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Star, Loader2, Save, X } from "lucide-react";

interface EditFormCardProps {
  formData: FormData;
  regionData: RegionData;
  loading: LoadingStates;
  error: string | null;
  success: string | null;
  onUpdateFormData: (field: keyof FormData, value: string | boolean) => void;
  onSubmit: () => Promise<boolean>;
  onCancel: () => void;
}

export function EditFormCard({
  formData,
  regionData,
  loading,
  error,
  success,
  onUpdateFormData,
  onSubmit,
  onCancel,
}: EditFormCardProps) {
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
            onCheckedChange={(checked) => onUpdateFormData("is_primary", checked as boolean)}
            className="border-[#F79E0E] data-[state=checked]:bg-[#F79E0E]"
          />
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-[#F79E0E]" />
            <Label htmlFor="is_primary" className="text-gray-700 font-medium cursor-pointer">
              Jadikan sebagai alamat utama toko
            </Label>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-orange-100">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading.form}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <X className="h-4 w-4 mr-2" />
            Batal
          </Button>
          <Button
            type="submit"
            disabled={loading.form}
            className="bg-gradient-to-r from-[#F79E0E] to-[#FFB648] hover:from-[#E8890B] hover:to-[#F0A537] text-white font-medium shadow-lg shadow-orange-200"
          >
            {loading.form ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memperbarui...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Perbarui Alamat
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
