"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../../services/authApi';
import Link from 'next/link';
import Image from 'next/image';
import { FiMail, FiLock, FiArrowRight, FiLoader, FiAlertCircle, FiUserPlus } from 'react-icons/fi';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register({ email, password });
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Initialization failed. System node could not be created.');
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

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Brand Identity */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-[#0f172a] rounded-2xl flex items-center justify-center shadow-xl mb-6 overflow-hidden">
                <Image src="/TemplateStorelogo.png" alt="Logo" width={60} height={60} className="object-contain" />
              </div>
              <h1 className="text-3xl font-black text-[#0f172a] tracking-tight uppercase text-center">Join the Legacy</h1>
              <p className="text-gray-500 text-sm font-bold mt-2 uppercase tracking-widest text-center">Register with TemplateStore</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-shake">
                <FiAlertCircle className="shrink-0" />
                {error}
              </div>
            )}

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

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Account Password</label>
                <div className="relative group">
                  <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password here..."
                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-2">
                <p className="text-[9px] text-blue-700 font-bold leading-relaxed uppercase tracking-wider">
                  By registering, you agree to the TemplateStore Core protocols and luxury service standards.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-5 bg-[#0f172a] text-white rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? <FiLoader className="animate-spin" /> : <FiUserPlus />}
                {isLoading ? "Initializing..." : "Register Account"}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Already a member?</p>
              <Link 
                href="/auth/login"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:shadow-lg transition-all border border-gray-100"
              >
                Return to Login
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <p className="mt-8 text-center text-white/40 text-[8px] font-black uppercase tracking-[0.3em]">
          TemplateStore Privacy & Trust Guaranteed
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
