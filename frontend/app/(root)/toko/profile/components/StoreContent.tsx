import { Store, Phone, CalendarDays, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { StoreContentProps } from "../types";
import { formatDate } from "@/lib/formatter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const StoreContent = ({ profile, error }: StoreContentProps) => {
  if (error || !profile) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error || "Toko tidak ditemukan"}</AlertDescription>
      </Alert>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Store Header */}
      <div className="bg-gradient-to-r from-[#F79E0E] to-[#FFB648] p-6 rounded-xl text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.nama_toko}</h1>
            <p className="text-white/90 mt-1">{profile.deskripsi}</p>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Toko</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#F79E0E] mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Kontak</p>
                <p className="text-gray-900">{profile.kontak}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-[#F79E0E] mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Slug</p>
                <p className="text-gray-900">{profile.slug}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-[#F79E0E] mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Terdaftar Sejak</p>
                <p className="text-gray-900">
                  {formatDate(profile.created_at)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
