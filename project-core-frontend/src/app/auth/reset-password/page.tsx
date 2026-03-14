"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '../../../services/authApi';
import Link from 'next/link';
import Image from 'next/image';
import { FiLock, FiShield, FiArrowRight, FiLoader, FiAlertCircle, FiCheckCircle, FiArrowLeft, FiKey } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token');

  const [tokenOrCode, setTokenOrCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) {
      setTokenOrCode(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match. Integrity check failed.");
    }

    if (newPassword.length < 8) {
      return setError("Security risk: Password must be at least 8 characters.");
    }

    setIsLoading(true);
    try {
      const response = await resetPassword({ tokenOrCode, newPassword });
      if (response.success) {
        toast.success("Password restored successfully.");
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Protocol code may be expired.');
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

      {/* Reset Password Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Brand Identity */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-[#0f172a] rounded-2xl flex items-center justify-center shadow-xl mb-6 overflow-hidden">
                <Image src="/TemplateStorelogo.png" alt="Logo" width={60} height={60} className="object-contain" />
              </div>
              <h1 className="text-2xl font-black text-[#0f172a] tracking-tight uppercase text-center">New Credentials</h1>
              <p className="text-gray-500 text-sm font-bold mt-2 uppercase tracking-widest text-center">Restore Account Access</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-shake">
                <FiAlertCircle className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Reset Protocol (Code/Token)</label>
                <div className="relative group">
                  <FiKey className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    value={tokenOrCode}
                    onChange={(e) => setTokenOrCode(e.target.value)}
                    placeholder="Enter 6-digit code or paste token..."
                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">New Secret Password</label>
                <div className="relative group">
                  <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters..."
                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Confirm Secret</label>
                <div className="relative group">
                  <FiShield className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password..."
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
                {isLoading ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                {isLoading ? "Validating..." : "Apply New Credentials"}
              </button>
            </form>

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
          TemplateStore Core Access Restoration System
        </p>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <FiLoader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
