import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { Address, StoreCheckout } from "../types";
import router from "next/router";

interface ShippingAddressCardProps {
  store: StoreCheckout;
  addresses: Address[];
  storeIndex: number;
  onAddressChange: (storeIndex: number, addressId: number) => void;
  onCalculateShipping: () => void;
}

export const ShippingAddressCard = ({
  store,
  addresses,
  storeIndex,
  onAddressChange,
  onCalculateShipping,
}: ShippingAddressCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address for {store.nama_toko}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {addresses.length > 0 ? (
          <RadioGroup
            value={store.selectedAddressId?.toString() || ""}
            onValueChange={(value) =>
              onAddressChange(storeIndex, parseInt(value))
            }
            className="space-y-4"
          >
            {addresses.map((address) => (
              <div
                key={address.id_alamat}
                className="flex items-start space-x-2 border rounded-lg p-3 hover:border-black transition-colors"
              >
                <RadioGroupItem
                  value={address.id_alamat.toString()}
                  id={`address-${storeIndex}-${address.id_alamat}`}
                  className="mt-1"
                />
                <Label
                  htmlFor={`address-${storeIndex}-${address.id_alamat}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium flex justify-between">
                    <span>{address.nama_penerima}</span>
                    {address.is_primary && (
                      <span className="text-xs border border-black px-2 py-0.5 rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{address.no_telp}</div>
                  <div className="text-sm mt-1">
                    {address.alamat_lengkap}, {address.district?.name},{" "}
                    {address.regency?.name}, {address.province?.name},{" "}
                    {address.kode_pos}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-2">
              You don't have any saved addresses
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/user/alamat")}
            >
              Add New Address
            </Button>
          </div>
        )}

        {store.selectedAddressId && !store.shippingOptions.length && (
          <Button
            variant="outline"
            onClick={onCalculateShipping}
            disabled={store.isLoadingShipping}
            className="w-full"
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
