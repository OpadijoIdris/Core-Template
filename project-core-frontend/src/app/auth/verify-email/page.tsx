"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail, resendVerificationEmail } from '../../../services/authApi';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiMail, 
  FiCheckCircle, 
  FiArrowRight, 
  FiLoader, 
  FiAlertCircle, 
  FiShield,
  FiRefreshCw
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

function VerifyEmailComponent() {
  const [token, setToken] = useState('');
  const [emailForResend, setEmailForResend] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'verify' | 'resend'>('verify');
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setView('verify');
    } else {
      setView('resend');
    }
  }, [searchParams]);

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await verifyEmail(token);
      setSuccess('Email verified successfully! Access granted.');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please check your code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsAlreadyVerified(false);
    setIsLoading(true);
    try {
      await resendVerificationEmail({ email: emailForResend });
      setSuccess('A new verification protocol has been dispatched to your inbox.');
      setTimeout(() => setView('verify'), 3000);
    } catch (err: any) {
      const message = err.response?.data?.message || '';
      if (message.toLowerCase().includes('already verified')) {
        setIsAlreadyVerified(true);
        setError('Your account is already verified.');
      } else {
        setError(message || 'Failed to dispatch verification email.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-bg.jpeg" 
          alt="TemplateStore Background" 
          fill 
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-[3px]" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden"
        >
          <div className="p-8 md:p-12">
            {/* Brand Identity */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-[#0f172a] rounded-[1.5rem] flex items-center justify-center shadow-2xl mb-6 group relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <Image src="/TemplateStorelogo.png" alt="Logo" width={55} height={55} className="object-contain relative z-10" />
              </div>
              <h1 className="text-3xl font-black text-[#0f172a] tracking-tight uppercase text-center">
                Security <span className="text-blue-600 italic">Check</span>
              </h1>
              <p className="text-gray-400 text-[10px] font-black mt-3 uppercase tracking-[0.3em]">Identity Verification</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-black uppercase tracking-wider"
                >
                  <FiAlertCircle className="shrink-0 text-lg" />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-xs font-black uppercase tracking-wider"
                >
                  <FiCheckCircle className="shrink-0 text-lg" />
                  {success}
                </motion.div>
              )}

              {isAlreadyVerified && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-5 bg-blue-50 border border-blue-100 rounded-[2rem] space-y-3"
                >
                  <div className="flex items-center gap-3 text-blue-700 text-xs font-black uppercase tracking-wider">
                    <FiShield className="shrink-0 text-lg" />
                    Account Already Verified
                  </div>
                  <p className="text-[10px] text-blue-600/70 font-bold leading-relaxed uppercase tracking-widest">
                    Your identity has already been confirmed. If you cannot remember your credentials, please reset your password.
                  </p>
                  <div className="flex flex-col gap-2 pt-2">
                    <Link href="/auth/login" className="text-center py-3 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                      Go to Login
                    </Link>
                    <Link href="/auth/forgot-password" className="text-center py-3 bg-white border border-blue-100 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      Forgot Password?
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {view === 'verify' ? (
                <motion.div
                  key="verify-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleVerificationSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">Verification Token</label>
                      <div className="relative group">
                        <FiShield className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          type="text"
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          placeholder="Enter your security token..."
                          className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400"
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
                      {isLoading ? "Authenticating..." : "Verify Identity"}
                    </button>
                  </form>

                  <div className="mt-10 text-center">
                    <button 
                      onClick={() => setView('resend')}
                      className="text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <FiRefreshCw /> Didn't receive the token?
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="resend-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleResendSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">Email Address</label>
                      <div className="relative group">
                        <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          type="email"
                          value={emailForResend}
                          onChange={(e) => setEmailForResend(e.target.value)}
                          placeholder="Enter registered email..."
                          className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-xl hover:bg-[#0f172a] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                    >
                      {isLoading ? <FiLoader className="animate-spin" /> : <FiRefreshCw />}
                      {isLoading ? "Dispatching..." : "Resend Protocol"}
                    </button>
                  </form>

                  <div className="mt-10 text-center">
                    <button 
                      onClick={() => setView('verify')}
                      className="text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <FiArrowRight /> Return to verification
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Link href="/auth/login" className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">
            Back to Secure Portal
          </Link>
          <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.3em]">
            TemplateStore Encryption Standard v1.0
          </p>
        </div>
      </div>
    </div>
  );
}

const VerifyEmailPage = () => (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
        <VerifyEmailComponent />
    </Suspense>
);

export default VerifyEmailPage;
