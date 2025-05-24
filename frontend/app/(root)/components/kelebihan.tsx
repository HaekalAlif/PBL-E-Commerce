"use client";

import React from "react";
import { FaTag, FaComments, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  {
    icon: <FaTag />,
    title: "Transparansi Harga",
    description: "Harga yang jelas dan transparan untuk semua pembeli.",
  },
  {
    icon: <FaComments />,
    title: "Dukungan Live Chat & Penawaran",
    description: "Ajukan pertanyaan langsung dan dapatkan penawaran terbaik.",
  },
  {
    icon: <FaCheckCircle />,
    title: "100% Keamanan",
    description: "Sistem transaksi aman dan terpercaya.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Garansi Keamanan Transaksi",
    description: "Garansi uang kembali jika transaksi tidak sesuai.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10,
    },
  },
};

const Kelebihan = () => {
  return (
    <section className="bg-amber-50 py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
        <motion.h2
          className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-12"
          variants={itemVariants}
        >
          Mengapa Memilih Kami?
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-0 rounded-xl overflow-hidden max-sm:px-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-white p-6 flex flex-col items-center text-center border border-gray-200/80
                lg:border-r lg:last:border-r-0 
                hover:bg-gradient-to-br hover:from-[#F79E0E] hover:to-[#FFB648] 
                hover:text-white transition-all duration-300 
                rounded-xl lg:rounded-none shadow-sm hover:shadow-md
                relative overflow-hidden"
            >
              <motion.div
                variants={iconVariants}
                className="mb-4 text-[#F79E0E] group-hover:text-white transition-colors duration-300"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl">
                  {feature.icon}
                </div>
              </motion.div>

              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-300">
                {feature.description}
              </p>

              <div className="absolute -right-12 -bottom-12 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                {feature.icon}
                <div className="text-[120px]">{feature.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Kelebihan;
