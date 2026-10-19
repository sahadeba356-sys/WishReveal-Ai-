import React from 'react';
import {
  Sparkles,
  Heart,
  Bot,
  Lock,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';
import { useLanguage } from '../i18n/LanguageContext';

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
  const { language, t } = useLanguage();

  const cards = [
    {
      title: t.featureQuizTitle,
      desc: t.featureQuizDesc,
      icon: Heart,
      tag: t.featureQuizTag,
      gradient: 'from-pink-500/20 to-purple-500/20',
      border: 'border-pink-500/30',
      iconColor: 'text-pink-400',
      action: onStartQuiz,
      btnText: t.featureQuizBtn,
    },
    {
      title: t.featureAiTitle,
      desc: t.featureAiDesc,
      icon: Bot,
      tag: t.featureAiTag,
      gradient: 'from-sky-500/20 to-blue-500/20',
      border: 'border-sky-500/30',
      iconColor: 'text-sky-400',
      action: onOpenAiAnalysis,
      btnText: t.featureAiBtn,
    },
    {
      title: t.featureWishTitle,
      desc: t.featureWishDesc,
      icon: Lock,
      tag: t.featureWishTag,
      gradient: 'from-purple-500/20 to-indigo-500/20',
      border: 'border-purple-500/30',
      iconColor: 'text-purple-400',
      action: onOpenWishBox,
      btnText: t.featureWishBtn,
    },
    {
      title: t.featureShareTitle,
      desc: t.featureShareDesc,
      icon: Share2,
      tag: t.featureShareTag,
      gradient: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      action: onOpenFriendshipLink,
      btnText: t.featureShareBtn,
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 relative overflow-hidden bg-[#090e24]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.featuresBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-bengali">
              {t.featuresTitle}
            </h2>
            <p className="mt-3.5 text-xs sm:text-base text-slate-300 font-bengali leading-relaxed">
              {t.featuresSubtitle}
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

