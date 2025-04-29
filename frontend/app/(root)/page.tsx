import Hero from "./components/landing/herolanding";
import Kategori from "./components/landing/kategori";
import ProdukUnggulan from "./components/landing/produkunggulan";
import Kelebihan from "./components/landing/kelebihan";
import Rekomendasi from "./components/landing/rekomendasiproduk";


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
