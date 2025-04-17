  'use client'
  import Image from 'next/image'
  import { FaFacebookF, FaTwitter, FaPinterestP } from 'react-icons/fa'

  export default function Copyright() {
    return (
      <footer>
        <div className="bg-[#674206] text-white mx-4 mt-8 -mb-8 h-14 px-12 flex flex-col sm:flex-row justify-between items-center">
          {/* Ikon Media Sosial */}
          <div className="flex gap-4 mb-4 sm:mb-0">
            <FaFacebookF />
            <FaTwitter />
            <FaPinterestP />
          </div>
          
          {/* Teks Copyright */}
          <p className="text-center sm:text-left sm:hidden">© 2025, Semua Hak Dilindungi.</p>

          {/* Metode Pembayaran */}
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Image src="/applepay.png" alt="Apple Pay" width={40} height={20} />
            <Image src="/visa.png" alt="Visa" width={40} height={20} />
            <Image src="/mastercard.png" alt="MasterCard" width={40} height={20} />
            <Image src="/securepayment.png" alt="Secure Payment" width={40} height={20} />
          </div>
        </div>
      </footer>
    )
  }
