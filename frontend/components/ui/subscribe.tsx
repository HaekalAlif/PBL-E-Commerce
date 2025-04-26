'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { motion } from "framer-motion"

export default function SubscribeSection() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription logic here
    console.log('Subscribe:', email)
    setEmail('')
  }

  return (
    <motion.section 
      className="py-16 px-4 md:py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#F79E0E] mb-4">
          Berlangganan Newsletter Kami
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Dapatkan update terbaru tentang produk dan penawaran spesial langsung di inbox Anda
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 h-12 border-orange-200 focus:border-orange-300 focus:ring-orange-200"
            required
          />
          <Button 
            type="submit"
            className="h-12 px-8 bg-[#F79E0E] hover:bg-[#E68D0D] transition-all duration-300 transform hover:scale-105"
          >
            Berlangganan
          </Button>
        </form>
      </div>
    </motion.section>
  )
}
