"use client";
import { Product } from "@/types/product";
import { FiTrash2, FiEdit3, FiEye, FiPackage, FiLayers, FiAlertCircle, FiInfo } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

interface AdminProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

const AdminProductCard = ({ product, onDelete }: AdminProductCardProps) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-50 text-green-700 border-green-100";
      case "ARCHIVED":
        return "bg-gray-50 text-gray-600 border-gray-100";
      case "OUT_OF_STOCK":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-blue-50 text-blue-700 border-blue-100";
    }
  };

  const isLowStock = product.quantity > 0 && product.quantity <= 5;

  return (
    <div className="group bg-white rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col h-full overflow-hidden">
      {/* Visual Header */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-50">
        <Image
          src={product.mainImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
            <Link 
              href={`/products/${product.id}`}
              className="w-full py-2 bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white/30 transition-all text-center"
            >
              Preview Live
            </Link>
        </div>
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={clsx(
            "px-3 py-1 text-[10px] font-black tracking-widest rounded-full border shadow-sm backdrop-blur-md uppercase",
            getStatusStyles(product.status)
          )}>
            {product.status.replace(/_/g, ' ')}
          </span>
          {isLowStock && (
            <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black tracking-widest rounded-full shadow-lg flex items-center gap-1 animate-pulse uppercase">
              <FiAlertCircle /> Low Stock
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
            <div className="flex justify-between items-start gap-4 mb-1">
                <h3 className="text-lg font-black text-gray-900 line-clamp-1 leading-tight">{product.name}</h3>
                <p className="text-lg font-black text-blue-600">₦{Number(product.price).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><FiLayers className="text-blue-500" /> {product.category?.name || 'General'}</span>
                {product.quantity <= 0 ? (
                    <span className="text-red-500 font-black">Out of Stock</span>
                ) : (
                    <span className="flex items-center gap-1"><FiPackage className="text-green-500" /> {product.quantity} Units</span>
                )}
            </div>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
          <div className="flex gap-2">
            <Link 
              href={`/admin/products/${product.id}/edit`}
              className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
              title="Edit Configuration"
            >
              <FiEdit3 size={18} />
            </Link>
            <button
              onClick={() => onDelete(product.id)}
              className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
              title="Decommission Product"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
          
          <Link 
            href={`/products/${product.id}`}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors"
          >
            Details <FiEye />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;
