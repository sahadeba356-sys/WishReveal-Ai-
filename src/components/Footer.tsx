import React from 'react';
import { Sparkles, Heart, Shield, FileText, Mail } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
}) => {
  return (
    <footer className="w-full bg-[#060918] border-t border-white/10 pt-12 pb-8 text-slate-400 text-xs font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 fill-white/20" />
            </div>
            <span className="font-extrabold text-base text-white font-brand">
              WishReveal <span className="text-pink-400">Ai</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-pink-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>গোপনীয়তা নীতি</span>
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-pink-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>ব্যবহারের শর্তাবলী</span>
            </button>
            <button
              onClick={onOpenContact}
              className="hover:text-pink-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>যোগাযোগ ও ফিডব্যাক</span>
            </button>
          </div>
        </div>

        {/* Ethical Notice */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 text-center leading-relaxed max-w-3xl mx-auto">
          ⚠️ <strong>নৈতিকতার প্রতিশ্রুতি:</strong> WishReveal Ai কোনো অবচেতন চিন্তা বা মন পড়ার দাবি করে না।
          অ্যাপ্লিকেশনটির সমস্ত বিশ্লেষণ ও উপহার আইডিয়া ব্যবহারকারীর স্বেচ্ছায় ও সচেতনভাবে দেওয়া উত্তরের ওপর ভিত্তি করে OpenAI ChatGPT ইঞ্জিনের মাধ্যমে প্রস্তুত করা হয়।
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} WishReveal Ai. সর্বস্বত্ব সংরক্ষিত।</span>
          <span className="flex items-center justify-center gap-1">
            আন্তরিক ভালোবাসার সাথে নির্মিত <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> বন্ধুদের জন্য
          </span>
        </div>
      </div>
    </footer>
  );
};
