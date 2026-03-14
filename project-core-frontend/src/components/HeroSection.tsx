"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center text-center bg-[url('/hero.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/40" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-white px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Timeless Jewelry for Every Moment
        </h1>
        <p className="mb-6 text-lg md:text-xl font-medium tracking-wide">
          Crafted with elegance. Defined by TemplateStore.
        </p>
        <Link
          href="/products"
          className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition"
        >
          Shop Now
        </Link>
      </motion.div>
    </section>
  );
}
