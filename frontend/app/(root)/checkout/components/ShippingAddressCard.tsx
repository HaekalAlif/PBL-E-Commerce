import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, MapPin } from "lucide-react";
import { Address, StoreCheckout } from "../types"; // Fixed import path
import { useRouter } from "next/navigation";

interface ShippingAddressCardProps {
  store: StoreCheckout;
  addresses: Address[];
  storeIndex: number;
  onAddressChange: (storeIndex: number, addressId: number) => void;
  onCalculateShipping: () => void;
}

export const ShippingAddressCard = ({
  store,
  ...props
}: ShippingAddressCardProps) => {
  const router = useRouter(); // Use the hook correctly

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-none shadow-lg overflow-hidden">
      <CardHeader className="bg-white border-b border-amber-100/30">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-[#F79E0E] to-[#FFB648] rounded-full">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#F79E0E] font-semibold">
              Delivery Address
            </span>
            <span className="text-sm font-normal text-gray-500">
              Select delivery address for this store
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {props.addresses.length > 0 ? (
          <RadioGroup
            value={store.selectedAddressId?.toString() || ""}
            onValueChange={(value) =>
              props.onAddressChange(props.storeIndex, parseInt(value))
            }
            className="space-y-3"
          >
            {props.addresses.map((address) => (
              <div key={address.id_alamat} className="relative">
                <RadioGroupItem
                  value={address.id_alamat.toString()}
                  id={`address-${props.storeIndex}-${address.id_alamat}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`address-${props.storeIndex}-${address.id_alamat}`}
                  className="flex flex-col p-4 rounded-xl cursor-pointer
                    border border-gray-200 hover:border-[#F79E0E] hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50
                    peer-data-[state=checked]:border-[#F79E0E] peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-amber-50/80 peer-data-[state=checked]:to-orange-50/80
                    transition-all duration-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{address.nama_penerima}</span>
                    {address.is_primary && (
                      <span className="text-xs border border-[#F79E0E] text-[#F79E0E] px-2 py-0.5 rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    {address.no_telepon}
                  </div>
                  <div className="text-sm">
                    {address.alamat_lengkap}, {address.district?.name},{" "}
                    {address.regency?.name}, {address.province?.name},{" "}
                    {address.kode_pos}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex p-3 rounded-full bg-amber-100/50 text-amber-600 mb-4">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-gray-800 font-medium mb-2">
              No Addresses Found
            </h3>
            <p className="text-gray-500 mb-4">
              Please add a shipping address to continue
            </p>
            <Button
              onClick={() => router.push("/user/alamat")}
              className="bg-[#F79E0E] hover:bg-[#E08D0D] text-white"
            >
              Add New Address
            </Button>
          </div>
        )}

        {store.selectedAddressId && !store.shippingOptions.length && (
          <Button
            onClick={props.onCalculateShipping}
            disabled={store.isLoadingShipping}
            className="w-full mt-4 bg-gradient-to-r from-[#F79E0E] to-[#FFB648] text-white hover:opacity-90"
          >
            {store.isLoadingShipping && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Calculate Shipping
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
