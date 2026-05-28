 "use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCheckCircle, FiPackage, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import clsx from "clsx";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const type = searchParams.get("type");
  const { fetchCart } = useCartStore();

  useEffect(() => {
    // Refresh cart to ensure it's cleared after successful payment
    fetchCart();
  }, [fetchCart]);

  const isPOD = type === "POD";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
        <div className={clsx(
            "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner",
            isPOD ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
        )}>
          {isPOD ? <FiPackage className="w-10 h-10" /> : <FiCheckCircle className="w-10 h-10" />}
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2">
            {isPOD ? "Order Received!" : "Payment Successful!"}
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          {isPOD 
            ? "Your order has been logged into our system. Please prepare the exact amount for our delivery agent upon arrival." 
            : "Thank you for your purchase. Your order has been placed and is now being processed."}
        </p>

        {reference && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-100">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Payment Reference</p>
            <p className="text-sm font-mono text-gray-700 break-all">{reference}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            href="/dashboard/orders" 
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            <FiPackage /> View My Orders
          </Link>
          <Link 
            href="/products" 
            className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
          >
            Continue Shopping <FiArrowRight />
          </Link>
        </div>
        
        <p className="text-[10px] text-gray-400 mt-8 uppercase font-bold tracking-widest">
          Your order details are available in your dashboard.
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
