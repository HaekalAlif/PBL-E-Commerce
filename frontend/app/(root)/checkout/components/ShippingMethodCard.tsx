import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatRupiah } from "@/lib/utils";
import { StoreCheckout } from "../types";
import { Truck } from "lucide-react";

interface ShippingMethodCardProps {
  store: StoreCheckout;
  storeIndex: number;
  onShippingChange: (storeIndex: number, value: string) => void;
}

export const ShippingMethodCard = ({
  store,
  ...props
}: ShippingMethodCardProps) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-none shadow-lg">
      <CardHeader className="bg-white border-b border-amber-100/30">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-[#F79E0E] to-[#FFB648] rounded-full">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#F79E0E] font-semibold">
              Shipping Method
            </span>
            <span className="text-sm font-normal text-gray-500">
              Choose your preferred delivery option
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <RadioGroup
          value={store.selectedShipping || ""}
          onValueChange={(value) =>
            props.onShippingChange(props.storeIndex, value)
          }
          className="space-y-4"
        >
          {store.shippingOptions.map((option) => (
            <div key={option.service} className="relative">
              <RadioGroupItem
                value={option.service}
                id={`shipping-${props.storeIndex}-${option.service}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`shipping-${props.storeIndex}-${option.service}`}
                className="flex items-start p-4 rounded-xl cursor-pointer
                  border border-gray-200 hover:border-[#F79E0E] hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50
                  peer-data-[state=checked]:border-[#F79E0E] peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-amber-50/80 peer-data-[state=checked]:to-orange-50/80
                  transition-all duration-200"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-700 flex items-center gap-2">
                        JNE {option.service}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#F79E0E]/10 text-[#F79E0E]">
                          {option.etd} days
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {option.description}
                      </div>
                    </div>
                    <div className="text-[#F79E0E] font-bold">
                      {formatRupiah(option.cost)}
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
