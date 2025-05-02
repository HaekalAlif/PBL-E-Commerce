import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { ShippingInfoProps } from "../types";

export const ShippingInfo = ({ invoice }: ShippingInfoProps) => {
  const alamat = invoice?.pembelian?.alamat;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="border-amber-100/50 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-amber-100/30">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#F79E0E] to-[#FFB648] rounded-full">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              Shipping Information
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {alamat ? (
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-amber-50/50 to-amber-100/30 
                         border border-amber-100/50 transition-all duration-300 hover:shadow-sm"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {alamat.nama_penerima}
                  </p>
                  <p className="text-sm text-gray-600">{alamat.no_telepon}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {alamat.alamat_lengkap},{" "}
                    {alamat.district?.name || alamat.kecamatan},
                    {alamat.regency?.name || alamat.kota},{" "}
                    {alamat.province?.name || alamat.provinsi},{alamat.kode_pos}
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-amber-50/50 to-amber-100/30
                         border border-amber-100/50 transition-all duration-300 hover:shadow-sm"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50">
                  <Truck className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Shipping Method
                  </p>
                  <p className="text-sm text-gray-600">
                    {invoice.opsi_pengiriman}
                  </p>
                </div>
              </motion.div>

              {invoice.pembelian.catatan_pembeli && (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-4 rounded-lg bg-gradient-to-br from-amber-50/50 to-amber-100/30
                           border border-amber-100/50 transition-all duration-300 hover:shadow-sm"
                >
                  <p className="text-sm font-medium text-gray-800">Notes:</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {invoice.pembelian.catatan_pembeli}
                  </p>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="font-medium">
                Shipping address details not available
              </p>
              <p className="text-sm">
                Shipping method:{" "}
                {invoice?.opsi_pengiriman || "Standard Shipping"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
