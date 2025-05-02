import { Loader2 } from "lucide-react";

export function CartLoading() {
  return (
    <div className="container mx-auto py-12 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Loading your cart...</span>
    </div>
  );
}
