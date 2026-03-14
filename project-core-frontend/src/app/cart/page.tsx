"use client";

import { useCartStore } from "@/store/cart";
import { FiMinus, FiPlus, FiTrash2, FiShoppingCart, FiArrowRight } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import Guidance from "@/components/Guidance";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function CartPage() {
  const { cart, fetchCart, updateItem, removeItem, clearCart, loading } = useCartStore();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const cartTotal = cart?.items?.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0) || 0;
  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Please log in</h1>
        <p className="text-gray-500 mb-8">You need to be logged in to view your cart.</p>
        <Link 
          href="/auth/login" 
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
          Your Shopping Cart
          <span className="text-lg font-bold bg-blue-100 text-blue-600 px-4 py-1 rounded-full border border-blue-200">
            {cartItemsCount} {cartItemsCount === 1 ? 'Item' : 'Items'}
          </span>
        </h1>
        <p className="text-gray-500 mt-2">Check your items and proceed to checkout.</p>
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <FiShoppingCart className="w-12 h-12 text-gray-200" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is currently empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven&apos;t added any products to your cart yet.</p>
          <Link 
            href="/products" 
            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-2"
          >
            Browse Products <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Product Details</th>
                      <th className="px-8 py-4 text-center">Quantity</th>
                      <th className="px-8 py-4 text-right">Subtotal</th>
                      <th className="px-8 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cart.items.map((item) => (
                      <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-6">
                            <div className="relative w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                              <Image 
                                src={item.product.mainImage} 
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.product.name}</h3>
                              <p className="text-sm font-bold text-blue-600 mt-1">
                                ₦{Number(item.product.price).toLocaleString()}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider flex items-center gap-1">
                                SKU: {item.product.slug ? item.product.slug.split('-').slice(0, 2).join('-') : `ITEM-${item.product.id.slice(0, 5)}`}
                                <Guidance message="A unique identifier for this product model." />
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center">
                            <div className="flex items-center bg-gray-100 rounded-xl p-1">
                              <button 
                                onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                                disabled={loading || item.quantity <= 1}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-gray-500 disabled:opacity-30 transition-all"
                              >
                                <FiMinus />
                              </button>
                              <span className="w-10 text-center font-black text-gray-900">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateItem(item.id, item.quantity + 1)}
                                disabled={loading}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-gray-500 disabled:opacity-30 transition-all"
                              >
                                <FiPlus />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-lg font-black text-gray-900">
                            ₦{(Number(item.product.price) * item.quantity).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex items-center justify-between px-4">
              <Link href="/products" className="text-blue-600 font-bold flex items-center gap-2 hover:underline text-sm">
                <FiPlus /> Add more products
              </Link>
              <button 
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear your entire cart?")) {
                    clearCart();
                  }
                }}
                disabled={loading}
                className="text-red-500 font-bold flex items-center gap-2 hover:underline text-sm disabled:opacity-50"
              >
                <FiTrash2 /> Clear Shopping Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sticky top-24">
              <h3 className="text-xl font-black text-gray-900 mb-8 pb-4 border-b border-gray-100">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-900 font-black text-lg">Estimated Total</span>
                    <Guidance message="The final amount including VAT and local taxes. Shipping is added at the next step." position="left" />
                  </div>
                  <span className="text-3xl font-black text-blue-600">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-right">Inclusive of VAT & Local Taxes</p>
              </div>

              <div className="space-y-3">
                <Link 
                  href="/checkout"
                  className="w-full py-5 bg-blue-600 text-white text-center rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3"
                >
                  Proceed to Checkout <FiArrowRight />
                </Link>
                <p className="text-center text-xs text-gray-400 mt-4">
                  Secure Checkout with Paystack & Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
