import Image from "next/image";
import DetailProduk from "./components/detailbarang";
import Deskripsi from "./components/deskripsi";
import ProdukLain from "./components/produklain";
export default function Home() {
  return (
    <>
        <DetailProduk/>
        <Deskripsi/>
        <ProdukLain/>
    </>
  );
}
