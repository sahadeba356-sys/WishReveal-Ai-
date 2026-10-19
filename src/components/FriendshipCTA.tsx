import React from 'react';
import { Heart, ArrowRight, Gift } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';
import { useLanguage } from '../i18n/LanguageContext';

interface FriendshipCTAProps {
  onStartQuiz: () => void;
  onOpenWishBox: () => void;
}

export const FriendshipCTA: React.FC<FriendshipCTAProps> = ({
  onStartQuiz,
  onOpenWishBox,
}) => {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-[#080c1e] via-[#101438] to-[#080c1e]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <RevealOnScroll>
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-pink-950/40 via-purple-950/40 to-indigo-950/40 border border-pink-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-pink-500/25">
              <Heart className="w-8 h-8 fill-white animate-pulse" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-bengali max-w-2xl mx-auto leading-snug">
              {t.ctaTitle}
            </h2>

            <p className="mt-4 text-xs sm:text-base text-slate-300 font-bengali max-w-xl mx-auto leading-relaxed">
              {t.ctaSubtitle}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-sm mx-auto">
              <button
                onClick={onStartQuiz}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer font-bengali"
              >
                <span>{t.ctaStartQuiz}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenWishBox}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-slate-200 hover:text-white border border-white/15 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-bengali"
              >
                <Gift className="w-4 h-4 text-purple-300" />
                <span>{t.ctaWishBox}</span>
              </button>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

