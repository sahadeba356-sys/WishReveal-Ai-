import React from 'react';
import { Heart, Sparkles, Bot, ShieldCheck, ArrowRight, Gift } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

interface HeroProps {
  onStartQuiz: () => void;
  onOpenWishBox: () => void;
  onOpenAiAnalysis: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartQuiz,
  onOpenWishBox,
  onOpenAiAnalysis,
}) => {
  return (
    <section id="home" className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
      {/* Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-gradient-to-tr from-pink-600/20 via-purple-600/20 to-sky-600/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-700/15 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <RevealOnScroll>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/30 text-pink-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="font-bengali">AI-চালিত ফ্রেন্ডশিপ ও সারপ্রাইজ উইশ প্ল্যাটফর্ম</span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight md:leading-tight font-bengali">
            বন্ধু না বললেও তার{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400">
              মনের ইচ্ছা
            </span>{' '}
            জানার সবচেয়ে মিষ্টি মাধ্যম ✨
          </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          {/* Description */}
          <p className="mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-bengali">
            মজার ড্রিম কুইজের মাধ্যমে বন্ধুদের সাথে শেয়ার করুন আপনার পছন্দের উপহার, ভ্রমণের স্বপ্ন ও প্রিয় মুহূর্ত।
            OpenAI ChatGPT দিয়ে স্বেচ্ছায় শেয়ার করা উত্তর থেকে বুঝে নিন পারফেক্ট উপহার ও আন্তরিক আইডিয়া।
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={300}>
          {/* Action CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={onStartQuiz}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-purple-700 active:scale-95 text-white font-bold text-sm sm:text-base shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer font-bengali"
            >
              <Heart className="w-5 h-5 fill-white animate-bounce" />
              <span>এখনই শুরু করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAiAnalysis}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 active:scale-95 text-sky-200 hover:text-white border border-sky-500/30 font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer font-bengali"
            >
              <Bot className="w-5 h-5 text-sky-400" />
              <span>AI দিয়ে পছন্দ বুঝুন</span>
            </button>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={400}>
          {/* Secondary Wish Box Pill */}
          <div className="mt-5 flex justify-center">
            <button
              onClick={onOpenWishBox}
              className="inline-flex items-center gap-2 text-xs text-purple-300 hover:text-purple-200 hover:underline cursor-pointer font-bengali"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>নিজের একটি ব্যক্তিগত ইচ্ছা গোপন বক্সে লক করে রাখতে চান? এখানে ক্লিক করুন</span>
            </button>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={500}>
          {/* Trust & Ethics Badges */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center max-w-4xl mx-auto">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-xl sm:text-2xl font-extrabold text-pink-400 font-brand">100%</span>
              <p className="text-xs text-slate-300 font-bengali">স্বেচ্ছায় শেয়ারকৃত উত্তর</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-xl sm:text-2xl font-extrabold text-purple-400 font-brand">Private</span>
              <p className="text-xs text-slate-300 font-bengali">বাই-ডিফল্ট সুরক্ষিত ডেটা</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-xl sm:text-2xl font-extrabold text-sky-400 font-brand">OpenAI</span>
              <p className="text-xs text-slate-300 font-bengali">ChatGPT এআই ইঞ্জিন</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-brand">Zero</span>
              <p className="text-xs text-slate-300 font-bengali">মন পড়ার মিথ্যা দাবি নেই</p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
