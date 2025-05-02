import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatRupiah } from "@/lib/utils";
import { StoreCheckout } from "../types";

interface ShippingMethodCardProps {
  store: StoreCheckout;
  storeIndex: number;
  onShippingChange: (storeIndex: number, value: string) => void;
}

export const ShippingMethodCard = ({
  store,
  storeIndex,
  onShippingChange,
}: ShippingMethodCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Method for {store.nama_toko}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={store.selectedShipping || ""}
          onValueChange={(value) => onShippingChange(storeIndex, value)}
          className="space-y-3"
        >
          {store.shippingOptions.map((option) => (
            <div
              key={option.service}
              className="flex items-start space-x-2 border rounded-lg p-3 hover:border-black transition-colors"
            >
              <RadioGroupItem
                value={option.service}
                id={`shipping-${storeIndex}-${option.service}`}
                className="mt-1"
              />
              <Label
                htmlFor={`shipping-${storeIndex}-${option.service}`}
                className="flex-1 cursor-pointer"
              >
                <div className="font-medium">
                  JNE {option.service} - {option.description}
                </div>
                <div className="text-sm text-gray-500">
                  Estimated delivery: {option.etd} days
                </div>
                <div className="text-sm font-semibold mt-1">
                  {formatRupiah(option.cost)}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
