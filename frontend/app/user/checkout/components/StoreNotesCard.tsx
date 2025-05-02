import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StoreCheckout } from "../types";

interface StoreNotesCardProps {
  store: StoreCheckout;
  storeIndex: number;
  onNotesChange: (storeIndex: number, notes: string) => void;
}

export const StoreNotesCard = ({
  store,
  storeIndex,
  onNotesChange,
}: StoreNotesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes for {store.nama_toko} (Optional)</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder={`Add notes for your order from ${store.nama_toko}`}
          value={store.notes}
          onChange={(e) => onNotesChange(storeIndex, e.target.value)}
          className="resize-none"
          rows={3}
        />
      </CardContent>
    </Card>
  );
};
