import React from 'react';
import { Sparkles, HelpCircle, UserCheck, Bot, Gift, ArrowRight } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

interface HowItWorksProps {
  onStartQuiz: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartQuiz }) => {
  const steps = [
    {
      num: '০১',
      title: 'কুইজ খেলুন বা তৈরি করুন',
      desc: 'ভ্রমণ, পছন্দের উপহার, শখ ও স্বপ্নের ওপর ভিত্তি করে সহজ ও অর্থপূর্ণ প্রশ্নগুলোর উত্তর নির্বাচন করুন।',
      icon: UserCheck,
      color: 'from-pink-500 to-rose-500',
    },
    {
      num: '০২',
      title: 'বন্ধুর সাথে শেয়ার করুন',
      desc: 'কুইজ শেষের ইউনিক লিংকটি বন্ধুর সাথে শেয়ার করুন। বন্ধু তার নিজের পছন্দ স্বেচ্ছায় জানিয়ে উত্তর সাবমিট করবে।',
      icon: HelpCircle,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      num: '০৩',
      title: 'AI দিয়ে সঠিক উপহার বুঝুন',
      desc: 'OpenAI ChatGPT উত্তরের প্যাটার্ন পর্যালোচনা করে জানাবে কোন উপহারটি সবচেয়ে নিখুঁত ও স্মৃতিময় হবে।',
      icon: Bot,
      color: 'from-sky-500 to-blue-500',
    },
    {
      num: '০৪',
      title: 'পারফেক্ট সারপ্রাইজ দিন',
      desc: 'কোনো দ্বিধা বা অপ্রাসঙ্গিক উপহার নয়—বন্ধুকে চমকে দিন এমন কিছু দিয়ে যা সে আসলেই মনে প্রাণে চেয়েছিল!',
      icon: Gift,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section id="how" className="py-16 sm:py-24 relative overflow-hidden bg-[#080c1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>সহজ ৪ ধাপ</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-bengali">
              কিভাবে কাজ করে WishReveal Ai?
            </h2>
            <p className="mt-3.5 text-xs sm:text-base text-slate-300 font-bengali leading-relaxed">
              স্বচ্ছতা ও সম্মতির ভিত্তিতে তৈরি একটি সহজ ও মজাদার উপহার প্ল্যানিং জার্নি।
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <RevealOnScroll key={idx} delay={idx * 120}>
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between h-full relative group">
                  <span className="text-3xl font-black text-white/10 group-hover:text-pink-500/20 transition-colors font-brand absolute top-4 right-4">
                    {step.num}
                  </span>

                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white font-bengali">
                      {step.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 font-bengali leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll delay={500}>
          <div className="mt-12 text-center">
            <button
              onClick={onStartQuiz}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-500/20 active:scale-95 transition-all cursor-pointer font-bengali"
            >
              <span>এখনই একটি কুইজ শুরু করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
