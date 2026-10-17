/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Mail,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  KeyRound,
  Info,
} from 'lucide-react';
import { api } from '../services/apiClient';
import { User } from '../types/backend';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass) && pass.length >= 10) score += 1;

    if (score === 1) return { score: 1, label: 'সহজ / দুর্বল', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'মাঝারি শক্তিশালী', color: 'bg-amber-400' };
    return { score: 3, label: 'উচ্চ নিরাপত্তা (শক্তিশালী)', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    // Client-side validations
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('একটি সঠিক ইমেইল এড্রেস প্রদান করুন।');
      return;
    }

    if (trimmedPass.length < 8) {
      setErrorMessage('নিরাপত্তার স্বার্থে পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setErrorMessage('আপনার নাম লিখুন।');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('পাসওয়ার্ড দুটি মেলেনি। পুনরায় চেক করুন।');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const result = await api.register({
          name: name.trim(),
          email: trimmedEmail,
          password: trimmedPass,
        });
        setSuccessMessage('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম 💖');
        setTimeout(() => {
          onSuccess(result.user);
          onClose();
        }, 800);
      } else {
        const result = await api.login({
          email: trimmedEmail,
          password: trimmedPass,
        });
        setSuccessMessage('সফলভাবে লগইন হয়েছে! স্বাগতম 💖');
        setTimeout(() => {
          onSuccess(result.user);
          onClose();
        }, 800);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'লগইন প্রক্রিয়ায় সমস্যা হয়েছে।';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setIsSignUp(false);
    setEmail('tanveer@example.com');
    setPassword('Friendship2025!');
    setErrorMessage(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl bg-[#0e1438] border border-pink-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#121945]/90 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div className="min-w-0">
              <h2 id="auth-modal-title" className="font-bold text-sm sm:text-base font-bengali text-white truncate">
                {isSignUp ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'WishReveal Ai-তে প্রবেশ করুন'}
              </h2>
              <p className="text-[11px] text-pink-200/70 font-bengali truncate">
                সিকিউর ব্যাকএন্ড ও অথরাইজেশন প্রোটোকল
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-pink-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-white/10 bg-[#090d26] shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold font-bengali transition-colors cursor-pointer text-center ${
              !isSignUp ? 'text-pink-400 border-b-2 border-pink-500 bg-white/[0.02]' : 'text-slate-400 hover:text-white'
            }`}
          >
            লগইন (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold font-bengali transition-colors cursor-pointer text-center ${
              isSignUp ? 'text-pink-400 border-b-2 border-pink-500 bg-white/[0.02]' : 'text-slate-400 hover:text-white'
            }`}
          >
            রেজিস্ট্রেশন (Sign Up)
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">

          {/* Security Notice Box */}
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/25 flex items-start gap-2.5 text-xs text-purple-200 leading-relaxed font-bengali">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px] sm:text-xs">
              <span className="font-bold text-purple-300 block">নিরাপত্তা নিশ্চয়তা (Password Safety):</span>
              <p className="text-purple-100/90 leading-normal">
                পাসওয়ার্ড কোনো প্লেইন টেক্সট হিসেবে রাখা হয় না। সার্ভার-সাইডে Scrypt ও ইউনিক সল্ট দিয়ে হ্যাশ করে নিরাপদে সংরক্ষণ করা হয়।
              </p>
            </div>
          </div>

          {/* Quick Demo Credentials Button */}
          {!isSignUp && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-bengali">
              <span className="text-slate-400 text-[11px]">ডেমো অ্যাকাউন্ট পরখ করতে চান?</span>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="px-2.5 py-1 rounded-lg bg-pink-500/15 text-pink-300 hover:bg-pink-500/25 border border-pink-500/30 text-[11px] font-bold cursor-pointer transition-colors"
              >
                নমুনা লগইন ইনপুট করুন
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-bengali flex items-center gap-2 animate-in fade-in duration-150"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div
              role="status"
              className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-bengali flex items-center gap-2 animate-in fade-in duration-150"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-bengali">
                  আপনার নাম <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="যেমন: তানভীর আহমেদ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#090d26] border border-white/15 focus:border-pink-500 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 min-h-[44px] font-bengali"
                  />
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-bengali">
                ইমেইল এড্রেস <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#090d26] border border-white/15 focus:border-pink-500 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 min-h-[44px]"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 font-bengali">
                  পাসওয়ার্ড <span className="text-rose-400">*</span>
                </label>
                {isSignUp && password && (
                  <span className="text-[10px] text-slate-400 font-bengali">
                    নিরাপত্তা মাত্রা: <strong className="text-white">{strength.label}</strong>
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#090d26] border border-white/15 focus:border-pink-500 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 min-h-[44px]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength bar */}
              {isSignUp && password && (
                <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: `${(strength.score / 3) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-bengali">
                  পাসওয়ার্ড নিশ্চিত করুন <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="পাসওয়ার্ডটি আবার লিখুন"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#090d26] border border-white/15 focus:border-pink-500 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 min-h-[44px]"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs font-bengali text-slate-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/20 bg-black/40 text-pink-500 focus:ring-0"
                  />
                  <span>সেশন মনে রাখুন</span>
                </label>
                <span className="text-[11px] text-pink-300/80">নিরাপদ টোকেন এনক্রিপশন</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] mt-2 font-bengali focus-visible:ring-2 focus-visible:ring-pink-400"
            >
              {isSubmitting ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-spin" />
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <span>{isSignUp ? 'নিরাপদ অ্যাকাউন্ট খুলুন' : 'লগইন করুন'}</span>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
