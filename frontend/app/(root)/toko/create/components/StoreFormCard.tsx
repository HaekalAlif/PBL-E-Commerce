import { motion } from "framer-motion";
import { FormStates, StoreFormData } from "../types";
import { StoreInfoSection } from "./StoreInfoSection";
import { FormActions } from "./FormActions";
import { AlertSection } from "./AlertSection";

interface StoreFormCardProps {
  formData: StoreFormData;
  formStates: FormStates;
  onUpdateFormData: (field: keyof StoreFormData, value: string) => void;
  onSubmit: () => Promise<boolean>;
  onCancel: () => void;
}

export function StoreFormCard({
  formData,
  formStates,
  onUpdateFormData,
  onSubmit,
  onCancel,
}: StoreFormCardProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl border border-orange-300 p-6 shadow-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AlertSection
          error={formStates.error}
          success={formStates.success}
        />

        <StoreInfoSection
          formData={formData}
          onUpdateFormData={onUpdateFormData}
        />

        <FormActions
          loading={formStates.isSubmitting}
          onCancel={onCancel}
        />
      </form>
    </motion.div>
  );
}
