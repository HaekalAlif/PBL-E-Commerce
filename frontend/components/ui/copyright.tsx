'use client'
import Image from 'next/image'
import { FaFacebookF, FaTwitter, FaPinterestP } from 'react-icons/fa'

export default function Copyright() {
  return (
    <>
    <footer>
      <div className="bg-[#674206] text-white mx-24 mt-8 -mb-8 h-14 px-12 flex justify-between items-center">
        <div className="flex gap-4">
          <FaFacebookF />
          <FaTwitter />
          <FaPinterestP />
        </div>
        <p>© 2025, Semua Hak Dilindungi.</p>
        <div className="flex gap-2">
          <Image src="/applepay.png" alt="Apple Pay" width={40} height={20} />
          <Image src="/visa.png" alt="Visa" width={40} height={20} />
          <Image
            src="/mastercard.png"
            alt="MasterCard"
            width={40}
            height={20}
          />
          <Image
            src="/securepayment.png"
            alt="Secure Payment"
            width={40}
            height={20}
          />
        </div>
      </div>
    </footer>
    </>
  )
}
