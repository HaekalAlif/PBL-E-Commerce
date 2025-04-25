import Image from "next/image";
import Hero from "./components/herolanding";
import Kategori from "./components/kategori";
import ProdukUnggulan from "./components/produkunggulan";
import Kelebihan from "./components/kelebihan";
import Rekomendasi from "./components/rekomendasiproduk";


export default function Home() {
  return (
    <>
      <Hero/>
      <Kategori/>
      <ProdukUnggulan/>
      <Kelebihan/>
      <Rekomendasi/>
    </>
  );
}
