"use client";

import { Product } from '@/types/product';
import Image from 'next/image';
import { useState } from 'react';
import { FiEye, FiShoppingCart, FiLoader, FiPlus, FiMinus } from 'react-icons/fi';
import { useCartStore } from '@/store/cart';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import clsx from 'clsx';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.info("Please login to add items to cart");
      router.push('/auth/login');
      return;
    }
    
    setIsAdding(true);
    try {
      await addItem(product.id, quantity);
      setQuantity(1); // Reset after successful add
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQty = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < product.quantity) setQuantity(prev => prev + 1);
  };

  const decrementQty = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(product);
    } else {
        router.push(`/products/${product.id}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col h-full cursor-pointer relative"
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50">
        <Image
          src={product.mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority={false}
        />
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.quantity <= 0 && (
            <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
              Sold Out
            </span>
          )}
          {product.quantity > 0 && product.quantity <= 5 && (
            <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
              Low Stock
            </span>
          )}
        </div>
        
        {/* View Icon Overlay (Top Right) */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="p-3 bg-white/80 backdrop-blur-md rounded-2xl text-gray-900 shadow-xl border border-white/20">
                <FiEye size={18} />
            </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <div className="flex flex-col mb-4">
            <div className="flex justify-between items-start gap-2 mb-1">
                <h3 className="text-sm md:text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm md:text-lg font-black text-gray-900 whitespace-nowrap">
                    ₦{Number(product.price).toLocaleString()}
                </p>
            </div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                {product.category?.name || 'Collection'}
            </p>
        </div>

        <p className="text-xs md:text-sm text-gray-500 line-clamp-2 leading-relaxed mb-6">
            {product.description}
        </p>

        {/* Quantity and Add to Bag Section */}
        <div className="mt-auto space-y-3">
            {product.quantity > 0 && (
                <div className="flex items-center justify-between gap-4 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                    <button 
                        onClick={decrementQty}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-xl text-gray-400 hover:text-blue-600 transition-colors shadow-sm active:scale-90"
                    >
                        <FiMinus />
                    </button>
                    <span className="text-xs md:text-sm font-black text-gray-900">{quantity}</span>
                    <button 
                        onClick={incrementQty}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-xl text-gray-400 hover:text-blue-600 transition-colors shadow-sm active:scale-90"
                    >
                        <FiPlus />
                    </button>
                </div>
            )}

            <button 
                onClick={handleAddToCart}
                disabled={isAdding || product.quantity <= 0}
                className="w-full py-3 md:py-4 bg-[#0f172a] text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
                {isAdding ? <FiLoader className="animate-spin" /> : <FiShoppingCart />}
                {isAdding ? "Adding..." : "Add to Bag"}
            </button>
        </div>

        {/* Dynamic Footer Info */}
        <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className={clsx(
                    "w-1 h-1 md:w-1.5 md:h-1.5 rounded-full",
                    product.quantity > 0 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500"
                )}></div>
                <span className={clsx(
                    "text-[8px] md:text-[10px] font-black uppercase tracking-widest",
                    product.quantity > 0 ? "text-gray-900" : "text-red-500"
                )}>
                    {product.quantity > 0 ? `${product.quantity} Units` : "Depleted"}
                </span>
            </div>
            <span className="text-[8px] md:text-[10px] font-black text-gray-300 group-hover:text-blue-200 transition-colors uppercase tracking-widest">
                Details
            </span>
        </div>
      </div>
    </div>
  );
}
