import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, X, Wand2 } from 'lucide-react';

interface FloatingCatWidgetProps {
  onStartQuiz: () => void;
  onOpenWishBox: () => void;
}

export const FloatingCatWidget: React.FC<FloatingCatWidgetProps> = ({
  onStartQuiz,
  onOpenWishBox,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (isDismissed) return null;

  return (
    <div ref={widgetRef} className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-30 flex flex-col items-end max-w-[calc(100vw-24px)]">
      
      {/* Expanded Popover */}
      {isOpen && (
        <div className="mb-2.5 w-[calc(100vw-24px)] sm:w-80 max-w-sm p-4 rounded-2xl sm:rounded-3xl bg-[#10173b]/98 backdrop-blur-xl border border-pink-500/30 shadow-2xl shadow-purple-950/90 animate-in fade-in slide-in-from-bottom-2 duration-200 text-white">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐱</span>
              <span className="font-bold text-xs sm:text-sm text-pink-300 font-brand">Meow Reveal AI</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="পপআপ বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-2.5 text-xs text-slate-200 space-y-1.5 leading-relaxed font-bengali">
            <p className="flex items-start gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>
                &ldquo;বন্ধুত্বের সবচেয়ে মিষ্টি অনুভূতি হলো যখন আপনি বিনা বলাতেই তার মনের ইচ্ছা বুঝতে পারেন!&rdquo;
              </span>
            </p>
            <p className="text-pink-300/80 font-medium">
              আজ কি আপনার প্রিয় বন্ধুর ইচ্ছা জানতে চান?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 font-bengali">
            <button
              onClick={() => {
                setIsOpen(false);
                onStartQuiz();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 active:scale-95 text-white font-bold text-xs shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[40px]"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>কুইজ শুরু</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenWishBox();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[40px]"
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-300" />
              <span>ইচ্ছা বক্স</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Pill Button */}
      <div className="flex items-center gap-1 max-w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-[#17204d]/95 to-[#231b54]/95 hover:from-[#1e2a66] hover:to-[#2e236f] active:scale-95 border border-pink-400/40 shadow-xl shadow-black/50 hover:shadow-pink-500/30 transition-all duration-300 cursor-pointer max-w-[calc(100vw-64px)] min-h-[40px]"
        >
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-pink-300 via-white to-amber-100 flex items-center justify-center text-base sm:text-lg shadow-sm shrink-0 animate-cat-subtle">
            <span>🐱</span>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-pink-500 rounded-full border border-white flex items-center justify-center animate-float-heart">
              <Heart className="w-1.5 h-1.5 text-white fill-white" />
            </span>
          </div>

          <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-pink-200 tracking-wide font-bengali group-hover:text-white transition-colors truncate">
            তোমার বন্ধুর ইচ্ছা জানার অপেক্ষায়...
          </span>
          <span className="text-pink-400 shrink-0">💖</span>
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          title="বন্ধ করুন"
          aria-label="উইজেট বন্ধ করুন"
          className="w-8 h-8 rounded-full bg-black/40 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
