import { Product } from "@/types/product";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiShoppingCart, FiLoader } from "react-icons/fi";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Please login to add items to cart");
      router.push('/auth/login');
      return;
    }
    
    setIsAdding(true);
    try {
      await addItem(product.id, 1);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 lg:w-3/5 p-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.name}</h1>
      <p className="text-xl text-gray-700 mb-6">
        <span className="font-bold">₦{Number(product.price).toLocaleString()}</span>
      </p>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Description</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
      </div>

      <div className="mb-6 space-y-2">
        <p className="text-gray-600">
          <span className="font-semibold">Category:</span> {product.category.name}
        </p>
        {product.subCategory && (
          <p className="text-gray-600">
            <span className="font-semibold">Sub-Category:</span> {product.subCategory.name}
          </p>
        )}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-600">Status:</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
            product.quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {product.quantity > 0 ? `In Stock (${product.quantity})` : "Out of Stock"}
          </span>
        </div>
      </div>

      <button 
        onClick={handleAddToCart}
        disabled={isAdding || product.quantity <= 0}
        className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-black hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 shadow-xl shadow-blue-100"
      >
        {isAdding ? <FiLoader className="animate-spin" /> : <FiShoppingCart />}
        Add to Cart
      </button>
    </div>
  );
}
