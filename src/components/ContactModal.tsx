import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Send, CheckCircle2, Heart } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl bg-[#0e1438] border border-pink-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#121945]/80 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-400 shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base font-brand text-white truncate">আমাদের সাথে যোগাযোগ</h3>
              <p className="text-[11px] text-pink-200/70 font-bengali truncate">মতামত বা কোনো জিজ্ঞাসা থাকলে লিখুন</p>
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
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {sent ? (
            <div className="py-8 sm:py-10 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white font-bengali">
                বার্তাটি সফলভাবে পাঠানো হয়েছে!
              </h4>
              <p className="text-xs text-slate-300 font-bengali">
                WishReveal Ai টিম খুব শীঘ্রই আপনার ইমেইলে উত্তর দেবে। ধন্যবাদ! 💖
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-bengali">
                  আপনার নাম
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: রাফিদ আহমেদ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-pink-500 focus:outline-none text-sm text-white placeholder-slate-500 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-bengali">
                  ইমেইল
                </label>
                <input
                  type="email"
                  required
                  placeholder="rafid@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-pink-500 focus:outline-none text-sm text-white placeholder-slate-500 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-bengali">
                  আপনার বার্তা / প্রশ্ন
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="আপনার কোনো পরামর্শ বা প্রশ্ন থাকলে বিস্তারিত লিখুন..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-pink-500 focus:outline-none text-sm text-white placeholder-slate-500 font-bengali"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[44px]"
              >
                <Send className="w-4 h-4" />
                <span>বার্তা পাঠান</span>
              </button>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-white/10 text-center text-[11px] sm:text-xs text-slate-400 font-bengali flex flex-wrap items-center justify-center gap-1">
            <span>বন্ধুত্বপূর্ণ সাপোর্ট</span>
            <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
            <span className="text-slate-300">support@wishreveal.ai</span>
          </div>
        </div>

      </div>
    </div>
  );
};
