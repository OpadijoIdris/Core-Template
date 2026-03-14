"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  FiArrowRight, 
  FiTruck, 
  FiShield, 
  FiClock, 
  FiShoppingBag,
  FiStar
} from "react-icons/fi";
import HeroSection from "@/components/HeroSection";
import Guidance from "@/components/Guidance";
import { getAllCategories } from "@/services/categoryApi";
import { getProducts } from "@/services/productApi";
import { Product, Category } from "@/types/product";
import ProductCard from "@/app/products/ProductCard";

// Static Premium Visuals for the Shop Portal
const SHOP_PORTAL_IMAGES = [
  '/cat-watches.jpg',
  '/cat-necklaces.jpg',
  '/cat-bracelet.jpg',
  '/cat-shades.jpg',
  '/cat-rings.jpg',
];

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          getAllCategories(),
          getProducts()
        ]);
        if (catRes.success) setCategories(catRes.data);
        if (prodRes.success) setFeaturedProducts(prodRes.data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load homepage data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="bg-white">
      {/* 1. Hero Section (Dynamic Intro) */}
      <HeroSection />

      {/* 2. Trust Bar (The TemplateStore Promise) */}
      <section className="py-12 border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <FiTruck size={24} />
              </div>
              <div>
                <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Global Shipping</h4>
                <p className="text-gray-500 text-sm mt-1">Expedited delivery worldwide.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <FiShield size={24} />
              </div>
              <div>
                <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Secure Checkout</h4>
                <p className="text-gray-500 text-sm mt-1">Protected by industry leaders.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <FiStar size={24} />
              </div>
              <div>
                <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Authentic Only</h4>
                <p className="text-gray-500 text-sm mt-1">Certified genuine timepieces.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Visual Collections Portal (Direct Shop Access) */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Direct Access</span>
              <div className="flex items-center gap-2 mt-2">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Explore Our <span className="italic text-blue-600">Departments</span></h2>
                <Guidance message="Quickly filter and explore our hand-crafted collections by category." pulse />
              </div>
            </div>
            <Link href="/products" className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-all">
              Enter Shop <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {SHOP_PORTAL_IMAGES.map((imgSrc, idx) => (
              <Link 
                key={idx} 
                href="/products"
                className="group relative h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-lg shadow-black/5"
              >
                <Image 
                  src={imgSrc} 
                  alt={`Department ${idx + 1}`} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Subtle vignette for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Minimalistic arrow indicator on hover */}
                <div className="absolute bottom-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                    <FiArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Shoppable Featured Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Curated For You</span>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">The <span className="italic text-blue-600">Story</span> Best-Sellers</h2>
              <Guidance message="These pieces are our most popular and highly rated items, curated by our masters." position="bottom" />
            </div>
            <p className="text-gray-500 max-w-xl mx-auto font-medium">Our most sought-after pieces, hand-selected by our master curators for their exceptional design.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onViewDetails={() => window.location.href = `/products`} 
                />
              ))}
            </div>
          )}

          <div className="mt-20 text-center">
            <Link 
              href="/products"
              className="inline-flex items-center gap-3 px-12 py-6 bg-[#0f172a] text-white rounded-3xl font-black uppercase text-sm tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/10 active:scale-95"
            >
              Enter The Full Shop <FiShoppingBag size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. The TemplateStore Experience (Brand Statement) */}
      <section className="py-32 bg-[#0f172a] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Our Philosophy</span>
              <h2 className="text-5xl font-black tracking-tight leading-tight">Every Piece Tells A <span className="text-blue-500 italic">Unique Story.</span></h2>
              <p className="text-gray-400 text-lg leading-relaxed font-medium">
                At TemplateStore, we believe jewelry and timepieces are more than just accessories—they are milestones. From our master craftsmen to your doorstep, we ensure every detail is finalized for excellence.
              </p>
              <div className="flex gap-10 pt-4">
                <div>
                  <p className="text-3xl font-black text-white">100%</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Authenticity</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-white">24/7</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Live Support</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-white">PRO</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Craftsmanship</p>
                </div>
              </div>
            </div>
            <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl group">
                <Image 
                    src="/jewel1.jpg" 
                    alt="Craftsmanship" 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
