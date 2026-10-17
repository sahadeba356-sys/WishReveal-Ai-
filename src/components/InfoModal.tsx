import React, { useEffect } from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface InfoModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!type) return;
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
  }, [type, onClose]);

  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-[#0e1438] border border-pink-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#121945]/80 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-400 shrink-0">
              {isPrivacy ? <Shield className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base font-brand text-white truncate">
                {isPrivacy ? 'প্রাইভেসি পলিসি' : 'শর্তাবলী ও নীতিমালা'}
              </h3>
              <p className="text-[11px] text-pink-200/70 font-bengali truncate">WishReveal Ai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 text-xs sm:text-sm text-slate-300 font-bengali leading-relaxed flex-1">
          {isPrivacy ? (
            <>
              <p className="font-semibold text-white">
                ১. তথ্য সুরক্ষা ও গোপনীয়তা
              </p>
              <p>
                WishReveal Ai ব্যবহারকারীর ব্যক্তিগত তথ্য এবং ইচ্ছার সর্বোচ্চ গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ। আপনার অনুমতি ছাড়া কোনো তথ্য তৃতীয় পক্ষের সাথে শেয়ার করা হয় না।
              </p>
              <p className="font-semibold text-white">
                ২. কুইজের উত্তর সংগ্রহ
              </p>
              <p>
                কুইজের উত্তরগুলো সম্পূর্ণ স্বেচ্ছায় প্রদত্ত। উত্তরগুলো শুধুমাত্র এআই বিশ্লেষণের মাধ্যমে বন্ধুদের মনের ইচ্ছা ও উপহারের পরামর্শ প্রস্তুত করার কাজে ব্যবহার করা হয়।
              </p>
              <p className="font-semibold text-white">
                ৩. কুকিজ ও লোকাল স্টোরেজ
              </p>
              <p>
                আপনার সংরক্ষিত ইচ্ছা এবং পছন্দ ব্রাউজারে নিরাপদ রাখার সুবিধার্থে লোকাল ক্যাশিং ব্যবস্থা ব্যবহৃত হয়।
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-white">
                ১. বন্ধুত্বপূর্ণ ব্যবহারের নিয়মাবলী
              </p>
              <p>
                WishReveal Ai শুধুমাত্র বন্ধুত্ব, আন্তরিকতা ও ইতিবাচক আনন্দের জন্য তৈরি। কোনো প্রকার হয়রানি, অপব্যবহার বা আপত্তিজনক মন্তব্য সম্পূর্ণ নিষিদ্ধ।
              </p>
              <p className="font-semibold text-white">
                ২. এআই বিশ্লেষণ সীমাবদ্ধতা
              </p>
              <p>
                আমাদের এআই মডেল বন্ধুর পছন্দ ও সম্ভাব্য স্বপ্ন সংক্রান্ত ধারণা দেয়। এটি কোনো আইনি বা পেশাদার মনস্তাত্ত্বিক পরামর্শ নয়।
              </p>
              <p className="font-semibold text-white">
                ৩. বৌদ্ধিক সম্পত্তি
              </p>
              <p>
                WishReveal Ai-এর সমস্ত লোগো, ডিজাইন ও অ্যালগরিদম স্বত্বাধিকার আইনের অধীনে সংরক্ষিত।
              </p>
            </>
          )}

          <div className="pt-3 text-center">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-98 text-white font-medium text-xs transition-colors min-h-[44px] cursor-pointer"
            >
              বুঝেছি, বন্ধ করুন
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
