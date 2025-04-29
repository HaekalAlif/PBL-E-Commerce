import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, EyeOff, Eye } from "lucide-react";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF7EB] flex flex-col items-center py-10 px-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl p-8 shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Daftar</h1>

        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
            <img
              src="https://i.pinimg.com/736x/b2/4b/b0/b24bb0f96b4b9c595867f2b05a941177.jpg"
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <Button variant="outline" className="text-yellow-600 border-yellow-400">
            Unggah Foto
          </Button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <fieldset>
            <legend className="text-lg font-semibold text-yellow-600 mb-4">Data Pribadi</legend>
            <div className="space-y-4">
              <Label>Nama Lengkap</Label>
              <Input placeholder="Masukan nama lengkap anda" />

              <Label className="mt-4">Jenis Kelamin</Label>
              <select className="input w-full border rounded p-2">
                <option>Laki Laki</option>
                <option>Perempuan</option>
              </select>

              <Label className="mt-4">Tempat Lahir</Label>
              <Input placeholder="Masukan Tempat Lahir Anda" />

              <Label className="mt-4">Tanggal Lahir</Label>
              <div className="relative">
                <Input type="date" className="pr-10" />
                <CalendarIcon className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <Label className="mt-4">No. Handphone</Label>
              <Input placeholder="Masukan No Handphone Anda" />

              <Label className="mt-4">Alamat Sesuai KTP</Label>
              <Input placeholder="Masukan Alamat Anda" />

              <Label className="mt-4">Provinsi</Label>
              <Input placeholder="Masukan Provinsi Anda" />

              <Label className="mt-4">Kota/Kabupaten</Label>
              <Input placeholder="Masukan Kota/Kabupaten Anda" />

              <Label className="mt-4">Kecamatan</Label>
              <Input placeholder="Masukan Kecamaten Anda" />

              <Label className="mt-4">Kelurahan/Desa</Label>
              <Input placeholder="Masukan Kelurahan/Desa Anda" />
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-lg font-semibold text-yellow-600 mb-4">Data Akun</legend>
            <div className="space-y-4">
              <Label>Nama Pengguna</Label>
              <Input placeholder="Masukan Nama Pengguna" />

              <Label className="mt-4">Alamat Email</Label>
              <Input placeholder="Masukan Alamat Email Anda" />

              <Label className="mt-4">Password</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="Masukan Password Anda" />
                <button
                  type="button"
                  className="absolute right-2 top-2.5"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>

              <Label className="mt-4">Konfirmasi Password</Label>
              <div className="relative">
                <Input type={showConfirmPassword ? "text" : "password"} placeholder="Masukan Konfirmasi Password Anda" />
                <button
                  type="button"
                  className="absolute right-2 top-2.5"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </fieldset>
        </form>

        <div className="flex justify-end mt-8">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">Kirim</Button>
        </div>
      </div>
    </div>
  );
}

