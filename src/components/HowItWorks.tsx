import React from 'react';
import { Sparkles, HelpCircle, UserCheck, Bot, Gift, ArrowRight } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';
import { useLanguage } from '../i18n/LanguageContext';

interface HowItWorksProps {
  onStartQuiz: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartQuiz }) => {
  const { language, t } = useLanguage();

  const steps = [
    {
      num: language === 'bn' ? '০১' : '01',
      title: t.step1Title,
      desc: t.step1Desc,
      icon: UserCheck,
      color: 'from-pink-500 to-rose-500',
    },
    {
      num: language === 'bn' ? '০২' : '02',
      title: t.step2Title,
      desc: t.step2Desc,
      icon: HelpCircle,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      num: language === 'bn' ? '০৩' : '03',
      title: t.step3Title,
      desc: t.step3Desc,
      icon: Bot,
      color: 'from-sky-500 to-blue-500',
    },
    {
      num: language === 'bn' ? '০৪' : '04',
      title: t.step4Title,
      desc: t.step4Desc,
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
              <span>{t.howBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-bengali">
              {t.howTitle}
            </h2>
            <p className="mt-3.5 text-xs sm:text-base text-slate-300 font-bengali leading-relaxed">
              {t.howSubtitle}
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
              <span>{language === 'bn' ? 'এখনই একটি কুইজ শুরু করুন' : 'Start a Quiz Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

