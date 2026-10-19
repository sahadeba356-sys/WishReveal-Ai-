import React from 'react';
import {
  Sparkles,
  Heart,
  Bot,
  Lock,
  Share2,
  Gift,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

interface FeaturesProps {
  onStartQuiz: () => void;
  onOpenWishBox: () => void;
  onOpenAiAnalysis: () => void;
  onOpenFriendshipLink: () => void;
}

export const Features: React.FC<FeaturesProps> = ({
  onStartQuiz,
  onOpenWishBox,
  onOpenAiAnalysis,
  onOpenFriendshipLink,
}) => {
  const cards = [
    {
      title: 'ড্রিম উইশ কুইজ',
      desc: 'ভ্রমণ, শখ, প্রিয় খাবার ও পছন্দের উপহার সম্পর্কিত ৫টি আকর্ষণীয় প্রশ্নের সমন্বয়ে তৈরি রোমাঞ্চকর কুইজ।',
      icon: Heart,
      tag: 'কোর ফিচার',
      gradient: 'from-pink-500/20 to-purple-500/20',
      border: 'border-pink-500/30',
      iconColor: 'text-pink-400',
      action: onStartQuiz,
      btnText: 'কুইজ খেলুন',
    },
    {
      title: 'OpenAI ChatGPT এনালাইসিস',
      desc: 'স্বেচ্ছায় শেয়ার করা উত্তরের প্রাসঙ্গিকতা বিশ্লেষণ করে তৈরি হয় উপহারের সেরা আইডিয়া ও আন্তরিক বন্ধুত্বের টিপস।',
      icon: Bot,
      tag: 'AI পাওয়ারড',
      gradient: 'from-sky-500/20 to-blue-500/20',
      border: 'border-sky-500/30',
      iconColor: 'text-sky-400',
      action: onOpenAiAnalysis,
      btnText: 'বিশ্লেষণ করুন',
    },
    {
      title: 'সিক্রেট উইশ বক্স',
      desc: 'নিজের মনের অব্যক্ত ইচ্ছা বা জীবনের লালিত স্বপ্ন নিরাপদে লিখে রাখুন। এটি সম্পূর্ণ ব্যক্তিগত ও সুরক্ষিত।',
      icon: Lock,
      tag: 'প্রাইভেট স্টোরেজ',
      gradient: 'from-purple-500/20 to-indigo-500/20',
      border: 'border-purple-500/30',
      iconColor: 'text-purple-400',
      action: onOpenWishBox,
      btnText: 'ইচ্ছা লিখুন',
    },
    {
      title: 'ইনভাইট ও ফ্রেন্ডশিপ লিংক',
      desc: 'বন্ধুকে নিজের কুইজের লিংক পাঠিয়ে জেনে নিন সে আপনাকে কতটা বোঝে এবং তার পছন্দের রুচি কেমন।',
      icon: Share2,
      tag: 'শেয়ারেবল',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      action: onOpenFriendshipLink,
      btnText: 'লিংক তৈরি করুন',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 relative overflow-hidden bg-[#090e24]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>অনন্য সুবিধাসমূহ</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-bengali">
              বন্ধুত্বের সম্পর্ক আরও গাঢ় ও অর্থপূর্ণ করার টুলস
            </h2>
            <p className="mt-3.5 text-xs sm:text-base text-slate-300 font-bengali leading-relaxed">
              সবার সামনে না বলা ছোট ছোট ইচ্ছা ও পছন্দগুলো প্রকাশের জন্য চমৎকার ডিজিটাল অভিজ্ঞতা।
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <RevealOnScroll key={idx} delay={idx * 100}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={card.action}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      card.action();
                    }
                  }}
                  className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-br ${card.gradient} border ${card.border} backdrop-blur-md hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col justify-between group h-full shadow-lg hover:shadow-xl`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center ${card.iconColor} shadow-inner`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10 font-bengali">
                        {card.tag}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white font-bengali group-hover:text-pink-300 transition-colors">
                      {card.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 font-bengali leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-white group-hover:text-pink-300 font-bengali">
                    <span>{card.btnText}</span>
                    <span
                      aria-hidden="true"
                      className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};
