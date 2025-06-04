import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import { StoreCheckout } from "../types";
import { Truck, Clock, Star } from "lucide-react";
import Image from "next/image";

interface ShippingMethodCardProps {
  store: StoreCheckout;
  storeIndex: number;
  onShippingChange: (storeIndex: number, value: string) => void;
}

export const ShippingMethodCard = ({
  store,
  ...props
}: ShippingMethodCardProps) => {
  const getCourierImage = (courierName?: string) => {
    if (!courierName) return "/default-courier.png";

    const name = courierName.toLowerCase();
    if (name.includes("jne") || name.includes("jalur nugraha"))
      return "/JNE.png";
    if (name.includes("j&t")) return "/J&T.jpg";
    if (name.includes("sicepat")) return "/sicepat.png";

    return "/default-courier.png";
  };

  const getServiceBadgeColor = (service?: string) => {
    if (!service) return "bg-gray-100 text-gray-700 border-gray-200";
    const serviceLower = service.toLowerCase();
    if (
      serviceLower.includes("express") ||
      serviceLower.includes("yes") ||
      serviceLower.includes("reg")
    ) {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }
    if (serviceLower.includes("ez") || serviceLower.includes("oke")) {
      return "bg-green-100 text-green-700 border-green-200";
    }
    if (serviceLower.includes("jtr") || serviceLower.includes("trucking")) {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  // Find the cheapest option for highlighting
  const cheapestCost =
    store.shippingOptions.length > 0
      ? Math.min(...store.shippingOptions.map((opt) => opt.cost))
      : 0;

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
        {store.shippingOptions.length > 0 ? (
          <RadioGroup
            value={store.selectedShipping || ""}
            onValueChange={(value) =>
              props.onShippingChange(props.storeIndex, value)
            }
            className="space-y-3"
          >
            {store.shippingOptions.map((option) => {
              const isCheapest = option.cost === cheapestCost;

              return (
                <div key={option.service} className="relative">
                  <RadioGroupItem
                    value={option.service}
                    id={`shipping-${props.storeIndex}-${option.service}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`shipping-${props.storeIndex}-${option.service}`}
                    className={`flex items-center p-4 rounded-xl cursor-pointer border transition-all duration-200 relative
                      ${
                        isCheapest
                          ? "border-[#F79E0E] bg-gradient-to-r from-amber-50/30 to-orange-50/30"
                          : "border-gray-200 hover:border-[#F79E0E] hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50"
                      }
                      peer-data-[state=checked]:border-[#F79E0E] peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-amber-50/90 peer-data-[state=checked]:to-orange-50/90
                      peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-[#F79E0E]/20`}
                  >
                    {isCheapest && store.shippingOptions.length > 1 && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-[#F79E0E] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          Cheapest
                        </Badge>
                      </div>
                    )}

                    <div className="flex items-center gap-4 flex-1">
                      {/* Courier Image */}
                      <div className="relative w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                        <Image
                          src={getCourierImage(option.courier_name)}
                          alt={option.courier_name || "Courier"}
                          width={40}
                          height={40}
                          className="object-contain"
                          onError={(e) => {
                            // Fallback to truck icon if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.parentElement?.classList.add(
                              "flex",
                              "items-center",
                              "justify-center"
                            );
                            target.parentElement!.innerHTML = `<div class="text-gray-400"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-.293-.707L15 4.586A1 1 0 0014.414 4H14v3z"></path></svg></div>`;
                          }}
                        />
                      </div>

                      {/* Shipping Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-800">
                            {option.description ||
                              option.courier_name ||
                              "Unknown Service"}
                          </span>
                          {option.service_code && (
                            <Badge
                              variant="outline"
                              className={`text-xs px-2 py-0.5 ${getServiceBadgeColor(
                                option.service_code
                              )}`}
                            >
                              {option.service_code}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{option.etd}</span>
                          </div>
                          <div className="text-[#F79E0E] font-bold text-lg">
                            {formatRupiah(option.cost)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Truck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No shipping options available</p>
            <p className="text-xs mt-1">
              Please select an address and calculate shipping
            </p>
          </div>
        )}

        {store.shippingOptions.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50/50 rounded-lg border border-amber-200/30">
            <p className="text-xs text-gray-600">
              💡 <strong>Tip:</strong> Shipping costs are calculated based on
              distance, weight, and courier service. Faster delivery options
              typically cost more.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
