"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  initial: {
    opacity: 0,
    y: 60,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  initial: {
    opacity: 0,
    y: 40,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const formVariants = {
  initial: {
    opacity: 0,
    x: -30,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      delay: 0.4,
    },
  },
};

const BoxDecorativeElement = () => (
  <>
    {/* Left Box Decoration */}
    <motion.div
      className="absolute left-[8%] top-1/2 -translate-y-1/2 hidden lg:block"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative w-[180px] h-[180px]">
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          className="absolute w-full h-full text-orange-400/40"
          animate={{ rotate: [0, -10, 0], y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <path
            d="M21 8l-2-2V3H5v3L3 8v13h18V8zM7 3h10v3H7V3zM5 21V9l2-2v2h10V7l2 2v12H5z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M15 12H9M12 15V9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.svg>
      </div>
    </motion.div>

    {/* Right Box Decoration */}
    <motion.div
      className="absolute right-[8%] top-1/2 -translate-y-1/2 hidden lg:block"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative w-[180px] h-[180px]">
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          className="absolute w-full h-full text-orange-400/40 rotate-12"
          animate={{ rotate: [12, 22, 12], y: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <path
            d="M20 7.5L12 2L4 7.5M20 7.5V16.5L12 22M20 7.5L12 13M4 7.5V16.5L12 22M4 7.5L12 13M12 22V13"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M12 8l4 2-4 2-4-2 4-2z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </motion.svg>
      </div>
    </motion.div>
  </>
);

export default function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setEmail("");

      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="py-16 px-4 md:py-16 relative overflow-hidden h-[300px]"
    >
      <BoxDecorativeElement />

      <div className="container mx-auto max-w-4xl text-center relative">
        <motion.h2
          variants={itemVariants}
          className="text-2xl md:text-3xl font-bold text-[#F79E0E] mb-4"
        >
          Bergabung dengan Newsletter Kami
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-gray-600 mb-8 max-w-2xl mx-auto"
        >
          Dapatkan update terbaru tentang produk dan penawaran spesial langsung
          di inbox Anda
        </motion.p>

        <div className="relative">
          {" "}
          {/* Container for form and message */}
          <motion.form
            variants={formVariants}
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 border-orange-200 focus:border-orange-300 focus:ring-orange-200 transform transition-transform duration-300 hover:scale-102"
              required
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                className="h-12 px-8 bg-[#F79E0E] hover:bg-[#E68D0D] transition-all duration-300"
              >
                Berlangganan
              </Button>
            </motion.div>
          </motion.form>
          {/* Absolute positioning for preview message */}
          <AnimatePresence>
            {email && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-4 text-amber-600"
              >
                ✨ Siap mengirimkan berita terbagai ke {email}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
