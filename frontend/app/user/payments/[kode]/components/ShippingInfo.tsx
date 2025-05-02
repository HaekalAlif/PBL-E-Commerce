import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShippingInfoProps } from "../types";

export const ShippingInfo = ({ invoice }: ShippingInfoProps) => {
  // Destructure alamat data untuk memudahkan akses
  const alamat = invoice?.pembelian?.alamat;

  // Debug log untuk memastikan data
  console.log("ShippingInfo received invoice:", invoice);
  console.log("ShippingInfo alamat data:", alamat);

  // Early return jika data tidak lengkap
  if (!invoice?.pembelian?.alamat) {
    console.warn("Missing address data:", {
      hasPembelian: !!invoice?.pembelian,
      hasAlamat: !!invoice?.pembelian?.alamat,
    });
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-medium">
              Shipping address details not available
            </p>
            <p className="text-sm">
              Shipping method: {invoice?.opsi_pengiriman || "Standard Shipping"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render alamat lengkap
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="font-medium">{alamat.nama_penerima}</p>
            <p className="text-sm">{alamat.no_telepon}</p>
          </div>
          <p className="text-sm">
            {alamat.alamat_lengkap}, {alamat.district?.name || alamat.kecamatan}
            , {alamat.regency?.name || alamat.kota},{" "}
            {alamat.province?.name || alamat.provinsi}, {alamat.kode_pos}
          </p>
          <div className="mt-2">
            <p className="text-sm text-gray-500">Shipping Method</p>
            <p>{invoice.opsi_pengiriman}</p>
          </div>
          {invoice.pembelian.catatan_pembeli && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Notes</p>
              <p>{invoice.pembelian.catatan_pembeli}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
