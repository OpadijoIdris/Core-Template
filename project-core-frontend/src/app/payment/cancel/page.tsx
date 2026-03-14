"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FiXCircle, FiShoppingCart, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { Suspense } from "react";

function PaymentCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <FiXCircle className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The payment process was interrupted or cancelled. No funds were debited from your account.
        </p>

        {reference && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-100">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Payment Reference</p>
            <p className="text-sm font-mono text-gray-700 break-all">{reference}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            href="/checkout" 
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            <FiShoppingCart /> Return to Checkout
          </Link>
          <Link 
            href="/products" 
            className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
          >
            Continue Shopping <FiArrowRight />
          </Link>
        </div>
        
        <p className="text-[10px] text-gray-400 mt-8 uppercase font-bold tracking-widest">
          If you encountered any technical issues, please contact support.
        </p>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentCancelContent />
    </Suspense>
  );
}
