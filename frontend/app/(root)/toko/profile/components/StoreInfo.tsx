import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreProfile } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Mail, Phone, Store } from "lucide-react";

interface StoreInfoProps {
  profile: StoreProfile;
}

export const StoreInfo = ({ profile }: StoreInfoProps) => {
  return (
    <Card className="border-orange-100">
      <CardHeader>
        <CardTitle>Informasi Toko</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-4 border-orange-100">
            {profile.logo ? (
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${profile.logo}`}
                alt={profile.nama_toko}
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-[#F79E0E] to-[#FFB648] text-2xl text-white">
                <Store className="w-8 h-8" />
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {profile.nama_toko}
            </h3>
            <p className="text-gray-500 mt-1">{profile.deskripsi}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#F79E0E] mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Alamat</p>
              <p className="text-gray-900">{profile.alamat || "Belum diatur"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-[#F79E0E] mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Nomor Telepon</p>
              <p className="text-gray-900">
                {profile.no_telepon || "Belum diatur"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#F79E0E] mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900">{profile.email || "Belum diatur"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
