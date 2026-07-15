"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, User, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { user, token, login, register, resetPassword } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Forgot Password States
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, forward to profile
  useEffect(() => {
    if (token && user) {
      router.push('/profile');
    }
  }, [token, user, router]);

  const validateEmailFormat = (emailAddress: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailAddress);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!email || !password || (isSignUp && !name)) {
      setError("Please fill in all required inputs.");
      setLoading(false);
      return;
    }

    if (!validateEmailFormat(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      router.push('/profile');
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message || "Authentication failed.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!email || !newPassword) {
      setError("Email and new password are required.");
      setLoading(false);
      return;
    }

    if (!validateEmailFormat(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(email, '', newPassword);
      setSuccessMessage("Password updated successfully! You can now log in.");
      setIsForgotMode(false);
      setPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.error || "Reset password failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSimulate = (provider: string) => {
    setName(provider === 'Google' ? 'Google Traveler' : 'GitHub Dev');
    setEmail(`${provider.toLowerCase()}@letstravelworld.com`);
    setPassword('OAuthSimulated123');
    setIsSignUp(true);
    alert(`Simulating ${provider} Authentication callback... Press Submit to finalize registration!`);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-6 font-sans text-zinc-100 flex items-center justify-center relative">
      
      {/* Decorative ambient glowing background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-royal-blue/15 rounded-full filter blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-emerald-green/10 rounded-full filter blur-[70px] pointer-events-none" />

      {/* Auth Box Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm glass-panel p-8 rounded-3xl relative z-10 flex flex-col justify-between"
      >
        <AnimatePresence mode="wait">
          {isForgotMode ? (
            /* FORGOT / RESET PASSWORD VIEW (NO OTP) */
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <h2 className="text-center text-sm font-bold text-white uppercase tracking-wider">Reset Password</h2>
              <p className="text-[10px] text-zinc-400 text-center font-light leading-relaxed">
                Reset your explorer password directly in MongoDB.
              </p>

              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-medium">Registered Email</label>
                  <input
                    type="email"
                    required
                    placeholder="explorer@orbit.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-royal-blue/55"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-medium">New Security Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-royal-blue/55"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-royal-blue to-emerald-green text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all cursor-pointer">
                  Update Password
                </button>
              </form>

              {successMessage && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-450 mt-2 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-1.5 text-[10px] text-red-400 mt-2 font-mono">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={() => {
                  setIsForgotMode(false);
                  setError('');
                }}
                className="w-full text-center text-[10px] text-zinc-500 hover:text-white transition-colors uppercase font-mono tracking-wider pt-2"
              >
                Back to Authentication
              </button>
            </motion.div>
          ) : (
            /* STANDARD REGISTER / LOGIN VIEW */
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Header Icon */}
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-royal-blue to-emerald-green flex items-center justify-center text-white shadow-xl shadow-royal-blue/20">
                  <Shield className="w-5 h-5" />
                </div>
              </div>

              <h2 className="text-center text-lg font-bold text-white uppercase tracking-wider">
                {isSignUp ? "Create Explorer Node" : "Authenticate Terminal"}
              </h2>
              <p className="text-center text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-6">
                Let's Travel World // Secure Auth
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-medium">Full Name</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-black/60 border border-white/10 rounded-xl focus-within:border-royal-blue/50 transition-all">
                      <User className="w-4 h-4 text-zinc-650" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="E.g. Neil Armstrong"
                        className="bg-transparent text-xs text-white placeholder-zinc-650 focus:outline-none w-full"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-medium">Email Identity</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-black/60 border border-white/10 rounded-xl focus-within:border-royal-blue/50 transition-all">
                    <Mail className="w-4 h-4 text-zinc-655" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E.g. explorer@orbit.com"
                      className="bg-transparent text-xs text-white placeholder-zinc-655 focus:outline-none w-full"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-medium">Security Password</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-black/60 border border-white/10 rounded-xl focus-within:border-royal-blue/50 transition-all">
                    <Lock className="w-4 h-4 text-zinc-655" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-transparent text-xs text-white placeholder-zinc-655 focus:outline-none w-full"
                    />
                  </div>
                </div>

                {successMessage && (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 mt-2 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-1.5 text-[10px] text-red-400 mt-2 font-mono">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Forgot Password Link */}
                {!isSignUp && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(true);
                        setError('');
                        setSuccessMessage('');
                      }}
                      className="text-[9px] text-zinc-555 hover:text-white uppercase font-mono tracking-wider transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-royal-blue to-emerald-green text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>Verifying credentials...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isSignUp ? "Generate Account" : "Access Terminal"}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <span className="text-[8px] font-mono text-zinc-600 uppercase bg-black/40 px-2 relative z-10">Or Connect federated API</span>
                <div className="absolute w-full h-[1px] bg-white/5 top-1/2 left-0 z-0" />
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleOAuthSimulate('Google')}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
                >
                  Google
                </button>
                <button
                  onClick={() => handleOAuthSimulate('GitHub')}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
                >
                  GitHub
                </button>
              </div>

              {/* Toggle Switch */}
              <div className="mt-8 text-center border-t border-white/5 pt-4">
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="text-[10px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {isSignUp ? "ALREADY INSTANTIATED? SIGN IN" : "NEW EXPLORER? CREATE ACCOUNT"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
