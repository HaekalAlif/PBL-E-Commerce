import Image from "next/image";
import Hero from "@/components/landing/herolanding";
import Feature from "@/components/landing/feature";
import Kelebihan from "@/components/landing/kelebihan";
import Rekomendasi from "@/components/landing/rekomendasiproduk";


export default function Home() {
  return (
    <>

      <Hero/>
      <Feature/>
      <Kelebihan/>
      <Rekomendasi/>
    </>
  );
}
