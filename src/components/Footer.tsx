import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
  onOpenQuiz?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
  onOpenQuiz,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#070b1e] border-t border-white/10 text-slate-400 py-10 sm:py-12 relative z-10 w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <RevealOnScroll>
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 pb-6 sm:pb-8 border-b border-white/5">
          
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center p-0.5 shadow-md shadow-pink-500/20 shrink-0">
                <div className="w-full h-full bg-[#0b0f24] rounded-[10px] flex items-center justify-center">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 fill-pink-400" />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-brand font-black text-white">
                WishReveal <span className="text-pink-400">Ai</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-pink-200/70 font-bengali mt-1">
              মনের ইচ্ছা এখন আর রহস্য নয়!
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-slate-300">
            <a href="#home" className="hover:text-pink-400 transition-colors py-1">হোম</a>
            <span className="text-slate-600 hidden xs:inline">|</span>
            <a href="#features" className="hover:text-pink-400 transition-colors py-1">ফিচার</a>
            <span className="text-slate-600 hidden xs:inline">|</span>
            <a href="#how-it-works" className="hover:text-pink-400 transition-colors py-1">কিভাবে কাজ করে</a>
            <span className="text-slate-600 hidden xs:inline">|</span>
            {onOpenQuiz ? (
              <button
                type="button"
                onClick={onOpenQuiz}
                className="hover:text-pink-400 transition-colors cursor-pointer py-1"
              >
                ডিসকভার
              </button>
            ) : (
              <a href="#features" className="hover:text-pink-400 transition-colors py-1">ডিসকভার</a>
            )}
            <span className="text-slate-600 hidden xs:inline">|</span>
            <button onClick={onOpenContact} className="hover:text-pink-400 transition-colors cursor-pointer py-1">
              যোগাযোগ
            </button>
          </div>

          {/* Social Media Links with 40px+ touch targets */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all min-w-[40px] min-h-[40px]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all min-w-[40px] min-h-[40px]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-pink-600/20 border border-pink-500/30 text-pink-400 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all min-w-[40px] min-h-[40px]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* Telegram */}
            <a
              href="https://telegram.org"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-400 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all min-w-[40px] min-h-[40px]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
          </div>

        </div>

        {/* Bottom Copyright & Action Row */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          
          <div className="flex items-center gap-3 order-2 sm:order-1">
            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              aria-label="উপরে যান"
              className="w-10 h-10 rounded-full bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white flex items-center justify-center transition-all cursor-pointer min-w-[40px] min-h-[40px]"
            >
              <ArrowUp className="w-4 h-4" />
            </button>

            {/* Copyright Text */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 font-bengali text-[11px] sm:text-xs">
              <span>© 2025 WishReveal Ai. সর্বস্বত্ব সংরক্ষিত।</span>
              <span className="text-slate-600 hidden xs:inline">|</span>
              <span className="text-pink-400/90 flex items-center gap-1">
                একটি বন্ধুত্বপূর্ণ প্ল্যাটফর্ম <Heart className="w-3 h-3 text-pink-400 fill-pink-400 inline" />
              </span>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex items-center justify-center gap-3 text-slate-400 text-xs order-1 sm:order-2">
            <button onClick={onOpenPrivacy} className="hover:text-pink-300 transition-colors cursor-pointer py-1">
              প্রাইভেসি পলিসি
            </button>
            <span className="text-slate-700">·</span>
            <button onClick={onOpenTerms} className="hover:text-pink-300 transition-colors cursor-pointer py-1">
              শর্তাবলী
            </button>
          </div>

        </div>
        </RevealOnScroll>

      </div>
    </footer>
  );
};
