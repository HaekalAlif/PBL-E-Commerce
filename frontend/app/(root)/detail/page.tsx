import Image from "next/image";
import DetailProduk from "../components/detailbarangcomp/detailbarang";
import Deskripsi from "../components/detailbarangcomp/deskripsi";
import ProdukLain from "../components/detailbarangcomp/produklain";
export default function Home() {
  return (
    <>
        <DetailProduk/>
        <Deskripsi/>
        <ProdukLain/>
    </>
  );
}
