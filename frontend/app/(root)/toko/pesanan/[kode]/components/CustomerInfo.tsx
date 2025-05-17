import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Phone, Mail } from "lucide-react";

interface CustomerInfoProps {
  name: string;
  email: string;
  alamat: {
    nama_penerima: string;
    no_telepon: string;
    alamat_lengkap: string;
    kode_pos: string;
    district: { name: string };
    regency: { name: string };
    province: { name: string };
  };
}

export function CustomerInfo({ name, email, alamat }: CustomerInfoProps) {
  return (
    <Card className="border-orange-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-gray-800">
          <User className="mr-2 h-5 w-5 text-[#F79E0E]" /> Informasi Pembeli
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="h-4 w-4 text-[#F79E0E]" />
            <span>{email}</span>
          </div>
        </div>

        <Separator className="bg-orange-100" />

        {/* Shipping Address */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-800">
            <MapPin className="h-4 w-4 text-[#F79E0E]" />
            <span className="font-medium">Alamat Pengiriman</span>
          </div>

          <div className="ml-6 space-y-2">
            <p className="font-medium text-gray-900">{alamat.nama_penerima}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-3 w-3 text-[#F79E0E]" />
              {alamat.no_telepon}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {alamat.alamat_lengkap},
              <br />
              {alamat.district.name}, {alamat.regency.name},
              <br />
              {alamat.province.name}, {alamat.kode_pos}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
