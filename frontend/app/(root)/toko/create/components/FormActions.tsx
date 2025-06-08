import { Button } from "@/components/ui/button";
import { Loader2, Save, X } from "lucide-react";

interface FormActionsProps {
  loading: boolean;
  onCancel: () => void;
}

export function FormActions({ loading, onCancel }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-orange-100">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={loading}
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        <X className="h-4 w-4 mr-2" />
        Batal
      </Button>
      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-[#F79E0E] to-[#FFB648] hover:from-[#E8890B] hover:to-[#F0A537] text-white font-medium shadow-lg shadow-orange-200"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Menyimpan...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Buat Toko
          </>
        )}
      </Button>
    </div>
  );
}
