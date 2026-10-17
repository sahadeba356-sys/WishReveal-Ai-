import React from 'react';
import { ArrowRight, Heart, Sparkles, Bot, Gift, Link2, FileQuestion } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

interface FeaturesProps {
  onOpenQuiz: () => void;
  onOpenAiAnalysis: () => void;
  onOpenWishBox: () => void;
  onOpenFriendshipLink: () => void;
}

export const Features: React.FC<FeaturesProps> = ({
  onOpenQuiz,
  onOpenAiAnalysis,
  onOpenWishBox,
  onOpenFriendshipLink,
}) => {
  const featureList = [
    {
      id: 'quiz',
      title: 'Secret Wish Quiz',
      subtitle: 'মজার প্রশ্নের উত্তর',
      description: 'কয়েকটি মজার প্রশ্নের উত্তর দিয়ে জেনে নিন আপনার বন্ধুর মনের ইচ্ছা ও স্বপ্ন।',
      cardGradient: 'from-pink-50 via-rose-50/60 to-pink-100/80',
      borderColor: 'border-pink-200/80 hover:border-pink-300',
      btnBg: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
      shadowColor: 'hover:shadow-pink-500/25',
      action: onOpenQuiz,
      icon: (
        <div className="relative">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-500/30">
            <FileQuestion className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <span className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-500 text-white shadow-sm animate-float-heart">
            <Heart className="w-3.5 h-3.5 fill-white" />
          </span>
        </div>
      ),
    },
    {
      id: 'ai',
      title: 'AI বিশ্লেষণ',
      subtitle: 'স্মার্ট পার্সোনালিটি ও ড্রিম ইনসাইট',
      description: 'আপনার বন্ধুর উত্তর বিশ্লেষণ করে AI জানাবে তার পছন্দ, ব্যক্তিত্ব ও সম্ভাব্য ইচ্ছা।',
      cardGradient: 'from-sky-50 via-blue-50/60 to-cyan-100/80',
      borderColor: 'border-sky-200/80 hover:border-sky-300',
      btnBg: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700',
      shadowColor: 'hover:shadow-sky-500/25',
      action: onOpenAiAnalysis,
      icon: (
        <div className="relative">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-500/30">
            <Bot className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-sm">
            AI
          </span>
        </div>
      ),
    },
    {
      id: 'box',
      title: 'Surprise Wish Box',
      subtitle: 'ডিজিটাল ইচ্ছা বাক্স',
      description: 'বন্ধু নিজের গোপন ইচ্ছা লিখে রাখতে পারবে একটি ডিজিটাল বাক্সে। পরে চাইলে শেয়ার করতে পারবে।',
      cardGradient: 'from-purple-50 via-violet-50/60 to-purple-100/80',
      borderColor: 'border-purple-200/80 hover:border-purple-300',
      btnBg: 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700',
      shadowColor: 'hover:shadow-purple-500/25',
      action: onOpenWishBox,
      icon: (
        <div className="relative">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-purple-400 to-violet-500 flex items-center justify-center text-white shadow-md shadow-purple-500/30">
            <Gift className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-400 text-slate-900 shadow-sm animate-twinkle">
            <Sparkles className="w-3.5 h-3.5 fill-slate-900" />
          </span>
        </div>
      ),
    },
    {
      id: 'link',
      title: 'Friendship Link',
      subtitle: 'এক ক্লিকে ইনভাইট',
      description: 'একটি লিংক তৈরি করে বন্ধুকে পাঠান। সে লিংক খুলে উত্তর দেবে, আপনি তার অনুমতি অনুযায়ী দেখতে পারবেন।',
      cardGradient: 'from-emerald-50 via-teal-50/60 to-green-100/80',
      borderColor: 'border-emerald-200/80 hover:border-emerald-300',
      btnBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
      shadowColor: 'hover:shadow-emerald-500/25',
      action: onOpenFriendshipLink,
      icon: (
        <div className="relative">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
            <Link2 className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <span className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-emerald-600 text-white shadow-sm animate-twinkle delay-500">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-14 sm:py-20 bg-gradient-to-b from-[#f8f9ff] via-[#f1f3fd] to-[#e9ecfc] text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header with Reveal Animation */}
        <RevealOnScroll className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2.5">
          <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 text-pink-600 font-bold text-base sm:text-xl">
            <span className="inline-block animate-float-heart">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 fill-pink-500 shrink-0" />
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              আমাদের বিশেষ ফিচারসমূহ
            </h2>
            <span className="text-pink-500 text-lg sm:text-xl font-bold shrink-0 animate-bounce">⤹</span>
          </div>
          <p className="text-slate-600 text-sm sm:text-base font-medium px-2">
            আপনার বন্ধুর মনের কথা জানার জন্য আরও সহজ, আরও মজার উপায়!
          </p>
        </RevealOnScroll>

        {/* 1 Column on Mobile, 2 Columns on Tablet, 4 Columns on Desktop with Smooth Hover Transitions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featureList.map((card, idx) => (
            <RevealOnScroll key={card.id} delay={idx * 80}>
              <div
                role="button"
                tabIndex={0}
                aria-label={`${card.title} খুলুন`}
                onClick={card.action}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.action();
                  }
                }}
                className={`group relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 bg-gradient-to-b ${card.cardGradient} border ${card.borderColor} shadow-sm sm:shadow-lg shadow-slate-200/70 hover:shadow-2xl ${card.shadowColor} hover:-translate-y-2 active:scale-98 transition-all duration-300 ease-out flex flex-col justify-between cursor-pointer h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500`}
              >
                <div>
                  {/* Icon Lockup */}
                  <div className="mb-4 sm:mb-6 flex justify-center">
                    <div className="transform group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300 ease-out">
                      {card.icon}
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 text-center mb-1.5 sm:mb-2 font-brand group-hover:text-pink-600 transition-colors">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed text-center font-normal">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Action Circle Button with smooth hover transition */}
                <div className="mt-6 sm:mt-8 pt-4 flex justify-center border-t border-slate-200/50">
                  <span
                    aria-hidden="true"
                    className={`w-12 h-12 rounded-full ${card.btnBg} text-white flex items-center justify-center shadow-md transform group-hover:scale-110 group-hover:rotate-6 active:scale-95 transition-all duration-200 min-w-[48px] min-h-[48px]`}
                  >
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
};
