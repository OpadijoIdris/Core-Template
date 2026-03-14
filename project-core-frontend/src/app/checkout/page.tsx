"use client";

import { useCartStore } from "@/store/cart";
import { useAuth } from "@/context/AuthContext";
import { initializeCheckout } from "@/services/checkoutApi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { 
  FiCreditCard, 
  FiShield, 
  FiTruck, 
  FiArrowLeft, 
  FiCheckCircle, 
  FiLock,
  FiLoader
} from "react-icons/fi";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, fetchCart, loading: cartLoading } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState<"PAYSTACK" | "PAY_ON_DELIVERY">("PAYSTACK");

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const cartTotal = cart?.items?.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0) || 0;
  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await initializeCheckout(paymentProvider);
      
      if (response.success) {
        if (paymentProvider === "PAYSTACK" && response.payment.authorizationUrl) {
          toast.info("Redirecting to secure payment gateway...");
          window.location.href = response.payment.authorizationUrl;
        } else if (paymentProvider === "PAY_ON_DELIVERY") {
          toast.success("Order placed successfully! Pay on delivery.");
          router.push(`/payment/success?reference=${response.payment.reference}&type=POD`);
        }
      } else {
        toast.error("Failed to initialize payment. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred during checkout");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full">
          <FiLock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Login Required</h1>
          <p className="text-gray-500 mb-6">You need to be logged in to complete your purchase.</p>
          <Link href="/auth/login" className="block w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (cartLoading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/products" className="text-blue-600 font-bold hover:underline">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/cart" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium mb-4">
            <FiArrowLeft /> Back to Cart
          </Link>
          <h1 className="text-3xl font-black text-gray-900">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Payment & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method */}
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <FiCreditCard className="text-blue-600" /> Payment Method
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentProvider("PAYSTACK")}
                  className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 ${
                    paymentProvider === "PAYSTACK" 
                      ? "border-blue-600 bg-blue-50/50" 
                      : "border-gray-100 hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-gray-900">Paystack</span>
                    {paymentProvider === "PAYSTACK" && <FiCheckCircle className="text-blue-600" />}
                  </div>
                  <p className="text-xs text-gray-500">Pay with cards, bank transfer, or USSD.</p>
                  <div className="flex gap-2 grayscale opacity-50">
                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                    <div className="w-8 h-5 bg-gray-300 rounded"></div>
                  </div>
                </button>

                <button 
                  onClick={() => setPaymentProvider("PAY_ON_DELIVERY")}
                  className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 ${
                    paymentProvider === "PAY_ON_DELIVERY" 
                      ? "border-blue-600 bg-blue-50/50" 
                      : "border-gray-100 hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-gray-900">Pay on Delivery</span>
                    {paymentProvider === "PAY_ON_DELIVERY" && <FiCheckCircle className="text-blue-600" />}
                  </div>
                  <p className="text-xs text-gray-500">Cash or card payment upon receipt.</p>
                  <div className="flex gap-2 text-blue-600 opacity-50">
                    <FiTruck size={20} />
                  </div>
                </button>
              </div>
            </section>

            {/* Security Notice */}
            <div className="bg-blue-600 rounded-3xl p-8 text-white flex items-center gap-6 shadow-xl shadow-blue-100">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiShield className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Safe & Secure</h3>
                <p className="text-blue-100 text-sm leading-relaxed mt-1">
                  Your data is protected by industry-standard encryption. We never store your credit card details.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sticky top-24 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
              
              <h3 className="text-xl font-black text-gray-900 mb-6 relative">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <Image 
                        src={item.product.mainImage} 
                        alt={item.product.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      ₦{(Number(item.product.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-50">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping Fee</span>
                  <span className="text-green-600 font-bold uppercase text-[10px]">Free</span>
                </div>
                
                <div className="pt-4 mt-2 flex justify-between items-end">
                  <span className="text-gray-900 font-black">Total to Pay</span>
                  <div className="text-right">
                    <p className="text-3xl font-black text-blue-600 leading-none">
                      ₦{cartTotal.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">NGN Currency</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <FiLoader className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    {paymentProvider === "PAY_ON_DELIVERY" ? "Make Order" : "Pay Now"} <FiCheckCircle />
                  </>
                )}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-4 grayscale opacity-30">
                {/* Visual payment logos placeholder */}
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
