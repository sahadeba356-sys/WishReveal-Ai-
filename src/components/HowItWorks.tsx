import React from 'react';
import { Smartphone, MessageSquareText, BrainCircuit, Smile, ArrowRight, Sparkles } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

interface HowItWorksProps {
  onStartQuiz: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartQuiz }) => {
  const steps = [
    {
      num: '1',
      badgeColor: 'bg-indigo-600 text-white shadow-indigo-500/40',
      iconBoxBg: 'bg-gradient-to-tr from-indigo-900/60 to-purple-900/40 border-indigo-500/30 text-indigo-300',
      title: 'লিংক শেয়ার করুন',
      desc: 'আপনার বন্ধুকে লিংক পাঠান (অথবা সে নিজে আসুক)!',
      icon: (
        <div className="relative">
          <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-300" />
          <span className="absolute top-1.5 left-2.5 w-3.5 h-3.5 bg-pink-500 rounded-xs flex items-center justify-center text-[7px] text-white font-bold">
            ?
          </span>
        </div>
      ),
    },
    {
      num: '2',
      badgeColor: 'bg-sky-500 text-white shadow-sky-500/40',
      iconBoxBg: 'bg-gradient-to-tr from-sky-900/60 to-cyan-900/40 border-sky-500/30 text-sky-300',
      title: 'প্রশ্নের উত্তর দিন',
      desc: 'কয়েকটি সহজ ও মজার প্রশ্নের উত্তর দিতে হবে।',
      icon: (
        <div className="relative">
          <MessageSquareText className="w-8 h-8 sm:w-10 sm:h-10 text-sky-300" />
          <span className="absolute -top-1 -right-1 text-pink-400 animate-twinkle">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-pink-400" />
          </span>
        </div>
      ),
    },
    {
      num: '3',
      badgeColor: 'bg-fuchsia-600 text-white shadow-fuchsia-500/40',
      iconBoxBg: 'bg-gradient-to-tr from-purple-900/60 to-pink-900/40 border-pink-500/30 text-pink-300',
      title: 'AI বিশ্লেষণ করবে',
      desc: 'আপনার বন্ধুর উত্তর বিশ্লেষণ করে AI জানাবে তার মনের ইচ্ছা।',
      icon: (
        <div className="relative">
          <BrainCircuit className="w-8 h-8 sm:w-10 sm:h-10 text-pink-300" />
          <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-purple-600 rounded text-[8px] text-white font-bold">
            AI
          </span>
        </div>
      ),
    },
    {
      num: '4',
      badgeColor: 'bg-emerald-500 text-white shadow-emerald-500/40',
      iconBoxBg: 'bg-gradient-to-tr from-amber-900/50 to-emerald-900/40 border-emerald-500/30 text-amber-300',
      title: 'ফলাফল দেখুন',
      desc: 'জানুন তার স্বপ্ন, পছন্দ, ব্যক্তিত্ব এবং আরও অনেক কিছু!',
      icon: (
        <div className="relative">
          <Smile className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 animate-cat-subtle" />
          <span className="absolute -top-1 -right-1 text-amber-400 animate-twinkle delay-500">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
          </span>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 md:py-24 bg-[#090e24] text-white relative overflow-hidden w-full max-w-full">
      {/* Background soft glow circles with gentle ambient pulse */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none animate-ambient-glow" />
      <div className="absolute bottom-10 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-pink-600/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none animate-ambient-glow delay-700" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading with Reveal on Scroll */}
        <RevealOnScroll className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 text-amber-400 font-bold text-lg sm:text-2xl">
            <span className="animate-twinkle">⚡</span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              কিভাবে কাজ করে?
            </h2>
            <span className="animate-twinkle delay-300">⚡</span>
          </div>
          <p className="text-pink-200/80 text-xs sm:text-base font-medium px-2">
            মাত্র ৪টি সহজ ধাপে জানুন আপনার বন্ধুর মনের কথা
          </p>
        </RevealOnScroll>

        {/* Steps Flow Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => (
            <RevealOnScroll key={step.num} delay={idx * 100}>
              <div className="relative flex flex-col items-center text-center group p-4 sm:p-5 rounded-2xl bg-white/[0.02] sm:bg-transparent border border-white/5 sm:border-none hover:bg-white/[0.04] transition-all duration-300">
                
                {/* Connector Arrow (desktop only) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-10 -right-4 translate-x-1/2 z-20 text-indigo-400/50 group-hover:text-pink-400 transition-colors">
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}

                {/* Number Badge & Main Icon Container */}
                <div className="relative mb-4 sm:mb-6">
                  {/* Floating Number Circle Badge */}
                  <div
                    className={`absolute -top-2.5 -left-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full ${step.badgeColor} flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg transform group-hover:scale-110 transition-transform duration-200`}
                  >
                    {step.num}
                  </div>

                  {/* Outer Glassmorphic Icon Box */}
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl ${step.iconBoxBg} border backdrop-blur-md flex items-center justify-center shadow-lg sm:shadow-xl group-hover:scale-105 group-hover:border-pink-500/50 transition-all duration-300`}
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2 font-brand group-hover:text-pink-300 transition-colors">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xs font-normal">
                  {step.desc}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Quick Action below steps with Animated Gradient */}
        <RevealOnScroll delay={200} className="mt-10 sm:mt-14 text-center">
          <button
            onClick={onStartQuiz}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 animate-gradient-flow hover:scale-105 active:scale-98 text-white font-semibold text-sm sm:text-base shadow-lg shadow-pink-600/30 transition-transform duration-200 cursor-pointer min-h-[48px]"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-twinkle" />
            <span>এখনই প্রথম ধাপ শুরু করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </RevealOnScroll>

      </div>
    </section>
  );
};
