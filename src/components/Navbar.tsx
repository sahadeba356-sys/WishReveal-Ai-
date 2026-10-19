import React, { useState } from 'react';
import { Sparkles, Heart, Menu, X, Gift, Bot, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { User } from '../types/backend';

interface NavbarProps {
  onStartQuiz: () => void;
  onOpenWishBox: () => void;
  onOpenAiAnalysis: () => void;
  onOpenLogin: () => void;
  onOpenResponses: () => void;
  onOpenOpenAiConfig: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartQuiz,
  onOpenWishBox,
  onOpenAiAnalysis,
  onOpenLogin,
  onOpenResponses,
  onOpenOpenAiConfig,
  currentUser,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#080c1e]/85 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 fill-white/20 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 font-brand">
              WishReveal <span className="text-pink-400 text-xs sm:text-sm font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 ml-0.5">Ai</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bengali -mt-1 hidden sm:inline">
              বন্ধুর মনের ইচ্ছা ও ড্রিম কুইজ
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300 font-bengali">
          <a href="#home" className="hover:text-pink-400 transition-colors">হোম</a>
          <a href="#features" className="hover:text-pink-400 transition-colors">ফিচারসমূহ</a>
          <a href="#how" className="hover:text-pink-400 transition-colors">কিভাবে কাজ করে</a>
          <button
            onClick={onOpenOpenAiConfig}
            className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors cursor-pointer text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>OpenAI স্ট্যাটাস</span>
          </button>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenAiAnalysis}
            className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-sky-400" />
            <span>AI এনালাইসিস</span>
          </button>

          <button
            onClick={onOpenWishBox}
            className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Gift className="w-4 h-4 text-purple-400" />
            <span>উইশ বক্স</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenResponses}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer font-bengali"
              >
                <UserIcon className="w-4 h-4 text-pink-400" />
                <span className="truncate max-w-[100px]">{currentUser.name}</span>
              </button>
              <button
                onClick={onLogout}
                title="লগআউট"
                aria-label="লগআউট করুন"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer font-bengali"
            >
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>লগইন</span>
            </button>
          )}

          <button
            onClick={onStartQuiz}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-md shadow-pink-500/20 hover:shadow-pink-500/40 active:scale-95 transition-all flex items-center gap-2 cursor-pointer font-bengali"
          >
            <Heart className="w-4 h-4 fill-white animate-bounce" />
            <span>কুইজ শুরু করুন</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onStartQuiz}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 font-bengali"
          >
            কুইজ শুরু
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="মেনু খুলুন"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-[#0c1233] border-b border-white/10 space-y-3 font-bengali animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2 text-sm text-slate-300 pb-3 border-b border-white/10">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-pink-400"
            >
              হোম
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-pink-400"
            >
              ফিচারসমূহ
            </a>
            <a
              href="#how"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-pink-400"
            >
              কিভাবে কাজ করে
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOpenAiConfig();
              }}
              className="text-left py-1.5 text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>OpenAI ChatGPT কনফিগারেশন</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiAnalysis();
              }}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold text-sky-300 bg-sky-500/10 border border-sky-500/30 flex items-center justify-center gap-1.5"
            >
              <Bot className="w-4 h-4 text-sky-400" />
              <span>AI এনালাইসিস</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWishBox();
              }}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/30 flex items-center justify-center gap-1.5"
            >
              <Gift className="w-4 h-4 text-purple-400" />
              <span>উইশ বক্স</span>
            </button>
          </div>

          {currentUser ? (
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResponses();
                }}
                className="text-xs text-white font-medium flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4 text-pink-400" />
                <span>ড্যাশবোর্ড ({currentUser.name})</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 border border-white/10 flex items-center justify-center gap-1.5"
            >
              <UserIcon className="w-4 h-4" />
              <span>লগইন / রেজিস্টার</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
