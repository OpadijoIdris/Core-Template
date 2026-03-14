"use client";

import React, { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import { getAllCategories, getSubcategoriesByCategory } from "@/services/categoryApi";
import { 
  FiSearch, 
  FiFilter, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiBox, 
  FiShoppingBag,
  FiChevronDown,
  FiArrowRight,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiShoppingCart,
  FiLoader,
  FiInfo
} from "react-icons/fi";
import Image from "next/image";
import { Product, Category, SubCategory } from "@/types/product";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import clsx from "clsx";

const ProductsPage = () => {
  const { 
    products, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    pagination, 
    changePage, 
    resetFilters 
  } = useProducts();

  const { addItem } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getAllCategories();
      if (response.success) setCategories(response.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (filters.categoryId) {
      const fetchSubs = async () => {
        const response = await getSubcategoriesByCategory(filters.categoryId!);
        if (response.success) setSubCategories(response.data);
      };
      fetchSubs();
    } else {
      setSubCategories([]);
    }
  }, [filters.categoryId]);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImage(selectedProduct.mainImage);
    } else {
      setActiveImage(null);
    }
  }, [selectedProduct]);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast.info("Please login to add items to cart");
      router.push('/auth/login');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await addItem(product.id, 1);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* Visual Hero Header */}
      <div className="bg-[#0f172a] pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-125 h-125 bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-75 h-75 bg-indigo-600/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-md rounded-full border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <FiBox /> Global Inventory Core
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
                Curated <span className="text-blue-500 italic">Excellence</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                Discover our signature collection of luxury essentials, meticulously crafted for the modern lifestyle.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-24">
        {/* Navigation/Filter Bar */}
        <div className="bg-white p-4 rounded-4xl shadow-xl shadow-black/3 border border-gray-100 flex flex-col md:flex-row items-center gap-4 mb-12">
            <div className="flex-1 relative group w-full">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search by collection, name or material..."
                    value={filters.search || ""}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-bold"
                />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={clsx(
                        "flex items-center gap-2 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                        isFilterOpen ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                >
                    <FiFilter /> {isFilterOpen ? "Close Filters" : "Filters"}
                </button>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
            {/* Expanded Sidebar Filters */}
            {isFilterOpen && (
                <aside className="w-full lg:w-72 space-y-10 animate-in slide-in-from-left-4 duration-300">
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] flex items-center justify-between">
                            Categories
                            {filters.categoryId && (
                                <button onClick={() => updateFilters({ categoryId: undefined, subCategoryId: undefined })} className="text-blue-600 normal-case tracking-normal hover:underline">Clear</button>
                            )}
                        </h3>
                        <div className="flex flex-wrap lg:flex-col gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => updateFilters({ categoryId: cat.id, subCategoryId: undefined })}
                                    className={clsx(
                                        "px-4 py-3 rounded-xl text-sm font-bold text-left transition-all",
                                        filters.categoryId === cat.id ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-white text-gray-500 border border-transparent hover:border-gray-200"
                                    )}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {subCategories.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Sub-Collections</h3>
                            <div className="flex flex-wrap lg:flex-col gap-2">
                                {subCategories.map((sub) => (
                                    <button
                                        key={sub.id}
                                        onClick={() => updateFilters({ subCategoryId: sub.id })}
                                        className={clsx(
                                            "px-4 py-3 rounded-xl text-sm font-bold text-left transition-all",
                                            filters.subCategoryId === sub.id ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-white text-gray-500 border border-transparent hover:border-gray-200"
                                        )}
                                    >
                                        {sub.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-8 border-t border-gray-100">
                        <button 
                            onClick={resetFilters}
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-black/10"
                        >
                            Reset All Filters
                        </button>
                    </div>
                </aside>
            )}

            {/* Main Product Grid */}
            <div className="flex-1">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="aspect-4/5 bg-white rounded-4xl animate-pulse border border-gray-100"></div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                        <FiShoppingBag className="w-16 h-16 mx-auto mb-6 text-gray-200" />
                        <h2 className="text-2xl font-black text-gray-900">No items in this collection</h2>
                        <p className="text-gray-400 mt-2 font-medium">Try adjusting your filters or search terms.</p>
                        <button onClick={resetFilters} className="mt-8 text-blue-600 font-black uppercase text-xs tracking-widest hover:underline">
                            Clear everything
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                            {products.map((product) => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onViewDetails={setSelectedProduct}
                                />
                            ))}
                        </div>

                        {/* Professional Pagination */}
                        <div className="flex items-center justify-between bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:block">
                                Page <span className="text-gray-900">{pagination.page}</span> of {pagination.totalPages}
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    disabled={pagination.page <= 1}
                                    onClick={() => changePage(pagination.page - 1)}
                                    className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 hover:bg-white hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
                                >
                                    <FiChevronLeft size={20} />
                                </button>
                                <button 
                                    disabled={pagination.page >= pagination.totalPages}
                                    onClick={() => changePage(pagination.page + 1)}
                                    className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 hover:bg-white hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
                                >
                                    <FiChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
      </div>

      {/* Immersive Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-100 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-6xl md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in slide-in-from-bottom md:zoom-in-95 duration-300 h-[95vh] md:h-auto md:max-h-[90vh]">
                
                {/* Mobile/Global Close Button */}
                <button 
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 md:top-8 md:right-8 z-110 p-3 md:p-4 bg-white/80 backdrop-blur-md rounded-full text-gray-900 shadow-xl hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 border border-white/20"
                >
                    <FiX size={20} className="md:w-6 md:h-6" />
                </button>

                {/* Left: Interactive Media Section */}
                <div className="w-full md:w-1/2 bg-gray-50 relative h-[40vh] md:h-auto shrink-0 group overflow-hidden">
                    <Image 
                        src={activeImage || selectedProduct.mainImage} 
                        alt={selectedProduct.name} 
                        fill 
                        className="object-cover transition-all duration-700" 
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none md:hidden"></div>
                    
                    {/* Floating Gallery Thumbnails */}
                    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 flex gap-2 md:gap-3 z-10 max-w-[90%] overflow-x-auto scrollbar-hide pb-2">
                        {[selectedProduct.mainImage, ...(selectedProduct.galleryImages || [])].map((img, i) => (
                            <div 
                                key={i} 
                                onClick={() => setActiveImage(img)}
                                className={clsx(
                                    "w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl border-2 overflow-hidden shadow-2xl backdrop-blur-md transition-all cursor-pointer transform active:scale-90 shrink-0",
                                    activeImage === img ? "border-blue-500 scale-105" : "border-white/50 opacity-80"
                                )}
                            >
                                <Image src={img} alt="thumb" fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Rich Context & Details */}
                <div className="w-full md:w-1/2 flex flex-col overflow-hidden bg-white">
                    <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 space-y-8 scrollbar-hide">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                                    {selectedProduct.category?.name}
                                </span>
                                {selectedProduct.quantity > 0 ? (
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                        In Stock ({selectedProduct.quantity} Available)
                                    </div>
                                ) : (
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Stock Depleted</span>
                                )}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                                {selectedProduct.name}
                            </h2>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl md:text-3xl font-black text-blue-600">₦{Number(selectedProduct.price).toLocaleString()}</span>
                                <span className="text-gray-400 text-[10px] font-black mb-1 uppercase tracking-[0.2em]">Global MSRP</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <FiInfo className="text-blue-500" /> Description
                                </h3>
                                <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">
                                    {selectedProduct.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-lg transition-all duration-300">
                                    <FiTruck className="text-blue-600 mb-2 transition-transform group-hover:translate-x-1" />
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Shipping</p>
                                    <p className="text-[10px] md:text-xs font-bold text-gray-900 mt-1 uppercase">Instant Dispatch</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-lg transition-all duration-300">
                                    <FiShield className="text-blue-600 mb-2 transition-transform group-hover:scale-110" />
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Security</p>
                                    <p className="text-[10px] md:text-xs font-bold text-gray-900 mt-1 uppercase">Secured Check</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Buffer for sticky footer on mobile */}
                        <div className="h-24 md:hidden"></div>
                    </div>

                    {/* Action Footer - Sticky on Mobile */}
                    <div className="p-6 md:p-12 lg:p-16 bg-white border-t border-gray-100 md:border-none sticky bottom-0 md:relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] md:shadow-none">
                        <button 
                            onClick={() => handleAddToCart(selectedProduct)}
                            disabled={isAddingToCart || selectedProduct.quantity <= 0}
                            className="w-full py-5 md:py-6 bg-blue-600 text-white rounded-2xl md:rounded-3xl font-black uppercase text-xs md:text-sm tracking-[0.2em] shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                        >
                            {isAddingToCart ? <FiLoader className="animate-spin" /> : <FiShoppingCart size={18} />}
                            {isAddingToCart ? "Synchronizing Bag..." : "Add to Shopping Bag"}
                        </button>
                        <p className="text-center text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest mt-4">
                            Guaranteed Secure Checkout via Paystack
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
