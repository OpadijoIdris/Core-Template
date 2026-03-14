"use client";

import { useState, useEffect } from "react";
import { FiMenu, FiX, FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '@/store/cart';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart, fetchCart, updateItem, removeItem, loading } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const cartTotal = cart?.items?.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0) || 0;

  return (
    <>
      <nav className="w-full border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/logo.png" 
              alt="TemplateStore Logo" 
              width={40} 
              height={40} 
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-xl font-black tracking-tighter text-[#0f172a]">TEMPLATESTORE</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/products">Shop</Link>
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm">
                      {user.firstName ? user.firstName[0] : user.email[0]}
                    </div>
                  )}
                  <span>Welcome, {user.email}</span>
                </div>
                <Link href={user.role === 'USER' ? '/dashboard' : '/admin'}>Dashboard</Link>
                <button onClick={logout} className="text-red-500">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth/login">Login</Link>
                <Link href="/auth/register">Register</Link>
              </>
            )}
            
            <button 
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={() => setCartOpen(true)}
              className="relative p-2"
            >
              <FiShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setOpen(!open)}
            >
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={clsx(
            "md:hidden transition-all duration-300 overflow-hidden",
            open ? "max-h-60 py-4 px-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-4 text-sm font-medium">
            <Link href="/products" onClick={() => setOpen(false)}>Shop</Link>
            {user ? (
              <>
                <Link href={user.role === 'USER' ? '/dashboard' : '/admin'} onClick={() => setOpen(false)}>Dashboard</Link>
                <button onClick={() => { logout(); setOpen(false); }} className="text-red-500 text-left">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setOpen(false)}>Login</Link>
                <Link href="/auth/register" onClick={() => setOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Cart Drawer Overlay */}
      <div 
        className={clsx(
          "fixed inset-0 bg-black/50 z-100 transition-opacity duration-300",
          cartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={() => setCartOpen(false)}
      />

      {/* Cart Drawer */}
      <div 
        className={clsx(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white z-101 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          cartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiShoppingCart className="text-blue-600" /> My Cart
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
              {cartItemsCount} items
            </span>
          </h2>
          <button 
            onClick={() => setCartOpen(false)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <FiX size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <FiShoppingCart className="w-10 h-10 text-gray-300" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">Your cart is empty</p>
                <p className="text-sm text-gray-500 mt-1">Looks like you haven&apos;t added anything yet.</p>
              </div>
              <Link 
                href="/products" 
                onClick={() => setCartOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  <Image 
                    src={item.product.mainImage} 
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.product.name}</h3>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-blue-600 font-bold mt-1">
                    ₦{Number(item.product.price).toLocaleString()}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                        disabled={loading}
                        className="p-1 hover:bg-gray-100 text-gray-500 disabled:opacity-50"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="px-2 text-xs font-bold text-gray-900 min-w-6 text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        disabled={loading}
                        className="p-1 hover:bg-gray-100 text-gray-500 disabled:opacity-50"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <div className="p-6 border-t bg-gray-50 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-xl font-black text-gray-900">
                ₦{cartTotal.toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] text-gray-400">Taxes and shipping calculated at checkout</p>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="w-full py-3 text-center border border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm"
              >
                View Cart
              </Link>
              <Link 
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="w-full py-3 text-center bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-lg shadow-blue-200"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
