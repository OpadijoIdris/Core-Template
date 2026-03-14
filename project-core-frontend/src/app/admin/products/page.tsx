"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiRefreshCw, 
  FiChevronLeft, 
  FiChevronRight,
  FiPackage,
  FiX,
  FiInfo
} from "react-icons/fi";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import AdminProductCard from "./AdminProductCard";

const AdminProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { 
    products, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    pagination, 
    changePage, 
    removeProduct,
    refresh
  } = useAdminProducts({ limit: 12 });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ status: e.target.value || undefined });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    updateFilters({ search: undefined, status: undefined });
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Inventory Core</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time Synchronization</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Product <span className="text-blue-600 italic">Portfolio</span></h1>
          <p className="text-gray-500 font-bold mt-1">Deploy, monitor and manage your global product catalog.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => refresh()}
            className="p-4 bg-white border border-gray-200 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            title="Reload Inventory"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          </button>
          <Link 
            href="/admin/products/create"
            className="flex items-center gap-3 px-8 py-4 bg-[#0f172a] text-white rounded-2xl text-sm font-black hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 active:scale-95"
          >
            <FiPlus size={20} /> Deploy New Item
          </Link>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-6">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative group">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search inventory by name, slug or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-bold"
          />
        </form>

        <div className="flex items-center gap-4">
          <div className="relative group min-w-50">
            <FiFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
            <select
              onChange={handleStatusFilter}
              value={filters.status || ""}
              className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-transparent rounded-2xl appearance-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none cursor-pointer text-sm font-black uppercase tracking-widest text-gray-600 transition-all"
            >
              <option value="">Full Status View</option>
              <option value="ACTIVE">Live / Active</option>
              <option value="ARCHIVED">Archived Items</option>
              <option value="OUT_OF_STOCK">Stock Depleted</option>
            </select>
          </div>
          
          {(filters.search || filters.status) && (
            <button 
              onClick={handleClearFilters}
              className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors active:scale-95"
              title="Reset Filters"
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* Main Content State Handling */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-inner"></div>
          <div className="text-center">
            <p className="text-lg font-black text-gray-900 tracking-tight uppercase">Scanning Inventory...</p>
            <p className="text-sm text-gray-400 font-bold">Synchronizing with API Core Engine</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-12 rounded-[2.5rem] border border-red-100 flex flex-col items-center justify-center text-center shadow-inner">
          <FiInfo className="w-16 h-16 mb-6 opacity-20" />
          <h3 className="text-xl font-black mb-2">Diagnostic Error Detected</h3>
          <p className="max-w-md font-medium text-red-600/70">{error}</p>
          <button onClick={() => refresh()} className="mt-8 px-8 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200">
            Re-establish Connection
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-gray-50 p-32 rounded-[3rem] border-2 border-dashed border-gray-200 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8">
            <FiPackage className="w-10 h-10 text-gray-200" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Empty Inventory Sector</h3>
          <p className="text-gray-400 font-bold mb-10 max-w-sm">No products matched your current filtering criteria. Expand your search or reset filters.</p>
          <button 
            onClick={handleClearFilters}
            className="px-10 py-4 bg-white border border-gray-200 rounded-2xl font-black text-gray-600 hover:bg-gray-50 transition-all shadow-sm shadow-black/2"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            {products.map((product) => (
              <AdminProductCard 
                key={product.id} 
                product={product} 
                onDelete={removeProduct}
              />
            ))}
          </div>

          {/* Premium Pagination */}
          <div className="bg-white p-6 rounded-4xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm shadow-black/1">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <FiInfo />
                </div>
                <div>
                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Sector Metrics</p>
                    <p className="text-sm font-bold text-gray-900">
                        Displaying <span className="text-blue-600">{products.length}</span> of <span className="text-blue-600">{pagination.total}</span> Portfolio Items
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                disabled={pagination.page <= 1}
                onClick={() => changePage(pagination.page - 1)}
                className="p-4 bg-gray-50 border border-transparent rounded-2xl text-gray-400 hover:bg-white hover:border-gray-200 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <FiChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-2 px-6 font-black text-sm text-gray-900">
                <span className="text-blue-600">{pagination.page}</span>
                <span className="text-gray-300">/</span>
                <span className="text-gray-400">{pagination.totalPages}</span>
              </div>

              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => changePage(pagination.page + 1)}
                className="p-4 bg-gray-50 border border-transparent rounded-2xl text-gray-400 hover:bg-white hover:border-gray-200 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProductsPage;
