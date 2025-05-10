import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ShippingInfoProps {
  address: {
    nama_penerima: string;
    no_telp: string;
    alamat_lengkap: string;
    district: { name: string };
    regency: { name: string };
    province: { name: string };
    kode_pos: string;
  };
  shippingMethod?: string;
  notes?: string;
}

export const ShippingInfo = ({
  address,
  shippingMethod,
  notes,
}: ShippingInfoProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Informasi Pengiriman</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Alamat Pengiriman</h3>
            <p className="font-medium">{address.nama_penerima}</p>
            <p className="text-sm">{address.no_telp}</p>
            <p className="text-sm mt-1">
              {address.alamat_lengkap}, {address.district.name},{" "}
              {address.regency.name}, {address.province.name},{" "}
              {address.kode_pos}
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Metode Pengiriman</h3>
            <p>{shippingMethod || "Pengiriman Standar"}</p>

            {notes && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Catatan Pesanan</h3>
                <p className="text-sm text-gray-700">{notes}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
