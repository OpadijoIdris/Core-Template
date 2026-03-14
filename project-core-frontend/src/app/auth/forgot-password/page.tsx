"use client";

import { useState } from 'react';
import { forgotPassword } from '../../../services/authApi';
import Link from 'next/link';
import Image from 'next/image';
import { FiMail, FiArrowRight, FiLoader, FiAlertCircle, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await forgotPassword({ email });
      if (response.success) {
        setSuccess(true);
        toast.success("Security code dispatched to your inbox.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Protocol failure. Verification email could not be sent.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/TemplateStore.jpeg" 
          alt="TemplateStore Background" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-[2px]" />
      </div>

      {/* Forgot Password Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Brand Identity */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-[#0f172a] rounded-2xl flex items-center justify-center shadow-xl mb-6 overflow-hidden">
                <Image src="/TemplateStorelogo.png" alt="Logo" width={60} height={60} className="object-contain" />
              </div>
              <h1 className="text-2xl font-black text-[#0f172a] tracking-tight uppercase text-center">Recover Access</h1>
              <p className="text-gray-500 text-sm font-bold mt-2 uppercase tracking-widest text-center">TemplateStore Security Protocol</p>
            </div>

            {success ? (
              <div className="text-center space-y-6 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-green-100">
                  <FiCheckCircle size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 uppercase">Check Your Inbox</h3>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                    If an account exists for <strong className="text-gray-900">{email}</strong>, you will receive instructions to reset your password shortly.
                  </p>
                </div>
                <Link 
                  href="/auth/reset-password"
                  className="w-full py-4 bg-[#0f172a] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  Enter Reset Code <FiArrowRight />
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                    <FiAlertCircle className="shrink-0" />
                    {error}
                  </div>
                )}

                <p className="text-gray-500 text-sm mb-8 leading-relaxed text-center font-medium">
                  Enter your registered email address below and we will send you a verification code to restore your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address here..."
                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400 shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-5 bg-[#0f172a] text-white rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoading ? <FiLoader className="animate-spin" /> : <FiArrowRight />}
                    {isLoading ? "Dispatching..." : "Send Reset code"}
                  </button>
                </form>
              </>
            )}

            <div className="mt-10 text-center">
              <Link 
                href="/auth/login"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors"
              >
                <FiArrowLeft /> Back to Login
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <p className="mt-8 text-center text-white/40 text-[8px] font-black uppercase tracking-[0.3em]">
          Secure Communication Line Locked
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
