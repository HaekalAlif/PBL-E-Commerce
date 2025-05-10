import { Mail, Phone, User2, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InfoField } from "./InfoField";
import { motion } from "framer-motion";
import { UserData } from "../types";

interface ProfileContentProps {
  userData: UserData;
}

export const ProfileContent = ({ userData }: ProfileContentProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="grid md:grid-cols-12 gap-6 xl:gap-8 min-h-[calc(100%-2rem)]"
  >
    {/* Profile Picture Section */}
    <div className="md:col-span-4 lg:col-span-3 flex items-center md:items-start">
      <div className="bg-white rounded-xl p-6 w-full flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <Avatar className="w-32 h-32 ring-4 ring-orange-100">
            {userData.foto_profil ? (
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${userData.foto_profil}`}
                alt={userData.name || "Profile"}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-r from-[#F79E0E] to-[#FFB648] text-4xl font-bold text-white">
                {userData.name?.charAt(0) ||
                  userData.username?.charAt(0) ||
                  "?"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="mt-4 text-center">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              {userData.name || userData.username}
            </h3>
          </div>
        </div>
      </div>
    </div>

    {/* Profile Information */}
    <div className="md:col-span-8 lg:col-span-9">
      <div className="bg-white rounded-xl p-6 space-y-4">
        {/* Personal Data Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User2 className="w-5 h-5 text-[#F79E0E]" />
            Data Pribadi
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoField
              label="Username"
              value={userData.username}
              icon={User2}
            />
            <InfoField
              label="Nama Lengkap"
              value={userData.name}
              icon={User2}
            />
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#F79E0E]" />
            Kontak
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoField
              label="Email"
              value={userData.email}
              icon={Mail}
              verified={userData.is_verified}
            />
            <InfoField
              label="Nomor Telepon"
              value={userData.no_hp}
              icon={Phone}
            />
          </div>
        </div>

        {/* Security Info */}
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-orange-50/50 p-3 rounded-lg">
          <Shield className="w-4 h-4 text-[#F79E0E]" />
          <span>Data Anda terlindungi dengan enkripsi end-to-end</span>
        </div>
      </div>
    </div>
  </motion.div>
);
