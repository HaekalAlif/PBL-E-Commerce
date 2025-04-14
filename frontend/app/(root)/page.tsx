import React from "react";
import Image from "next/image";

const page = () => {
  return (
    <div className="">
      <Image src="/testing.jpg" alt="Deskripsi gambar" width={500} height={500} />
    </div>
  );
};

export default page;
