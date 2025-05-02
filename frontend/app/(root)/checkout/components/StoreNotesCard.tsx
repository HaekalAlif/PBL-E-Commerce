import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";
import { StoreCheckout } from "../types";

interface StoreNotesCardProps {
  store: StoreCheckout;
  storeIndex: number;
  onNotesChange: (storeIndex: number, notes: string) => void;
}

export const StoreNotesCard = ({ store, ...props }: StoreNotesCardProps) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-none shadow-lg">
      <CardHeader className="bg-white border-b border-amber-100/30">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-[#F79E0E] to-[#FFB648] rounded-full">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#F79E0E] font-semibold">Order Notes</span>
            <span className="text-sm font-normal text-gray-500">
              Add special instructions
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <Textarea
          placeholder="Example: Please package items separately"
          value={store.notes}
          onChange={(e) =>
            props.onNotesChange(props.storeIndex, e.target.value)
          }
          className="min-h-[100px] bg-gray-50/50 border-gray-200 focus:border-[#F79E0E] transition-colors resize-none"
        />
      </CardContent>
    </Card>
  );
};
