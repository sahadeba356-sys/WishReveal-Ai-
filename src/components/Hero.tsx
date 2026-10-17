import React, { useState } from 'react';
import { ArrowRight, Heart, Sparkles, Gift, Wand2, Star, ShieldCheck, Flame } from 'lucide-react';
import heroImg from '../assets/images/hero_dreaming_boy_cat_1792078186434.jpg';

interface HeroProps {
  onStartQuiz: () => void;
  onOpenWishBox: () => void;
}

interface BurstHeart {
  id: number;
  tx: number;
  ty: number;
  color: string;
  size: number;
}

export const Hero: React.FC<HeroProps> = ({ onStartQuiz, onOpenWishBox }) => {
  const [burstHearts, setBurstHearts] = useState<BurstHeart[]>([]);

  const handleCtaClick = () => {
    // Spawn 5 cute lightweight floating hearts on click
    const colors = ['#f472b6', '#ec4899', '#f43f5e', '#a855f7', '#fb7185'];
    const newHearts: BurstHeart[] = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      tx: (Math.random() - 0.5) * 90,
      ty: -(45 + Math.random() * 55),
      color: colors[i % colors.length],
      size: 14 + Math.floor(Math.random() * 8),
    }));

    setBurstHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setBurstHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 750);

    onStartQuiz();
  };

  return (
    <section id="home" className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-36 md:pb-24 overflow-hidden w-full max-w-full">
      {/* Gentle Breathing Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] md:w-[600px] h-[300px] sm:h-[400px] bg-purple-600/15 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none animate-ambient-glow" />
      <div className="absolute top-1/3 right-0 w-[250px] sm:w-[450px] h-[250px] sm:h-[350px] bg-pink-600/15 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none animate-ambient-glow delay-1000" />
      <div className="absolute top-20 left-0 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-indigo-600/10 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none animate-ambient-glow delay-700" />

      {/* Floating Hearts around the hero */}
      <div className="absolute top-28 left-[6%] text-pink-400/40 pointer-events-none animate-float-heart hidden sm:block">
        <Heart className="w-5 h-5 fill-pink-400/30" />
      </div>
      <div className="absolute top-1/2 left-[3%] text-purple-400/30 pointer-events-none animate-float-heart-alt hidden sm:block">
        <Heart className="w-4 h-4 fill-purple-400/25" />
      </div>
      <div className="absolute bottom-28 left-[45%] text-rose-400/35 pointer-events-none animate-float-heart hidden md:block">
        <Heart className="w-4 h-4 fill-rose-400/30" />
      </div>

      {/* Small Sparkling Stars */}
      <div className="absolute top-24 left-[10%] text-pink-400/50 animate-twinkle pointer-events-none">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="absolute top-36 right-[15%] text-amber-300/50 animate-twinkle delay-700 pointer-events-none">
        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-300/40" />
      </div>
      <div className="absolute bottom-16 left-[20%] text-purple-400/40 animate-twinkle delay-1000 pointer-events-none">
        <Star className="w-3 h-3 fill-purple-400/40" />
      </div>

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Action */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6">
            
            {/* Playful Kicker Doodle with gentle floating heart */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-indigo-500/15 border border-pink-500/25 text-pink-300 text-xs sm:text-sm font-semibold tracking-wide max-w-full">
              <span className="text-amber-400 font-bold text-sm sm:text-base">⚡</span>
              <span className="truncate">বন্ধুর মনের ইচ্ছা জানতে চান?</span>
              <span className="inline-block animate-float-heart">
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400 fill-pink-400 inline shrink-0" />
              </span>
            </div>

            {/* Main Brand Headline */}
            <div className="space-y-1.5 w-full">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-brand font-black tracking-tight text-white flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 leading-tight">
                <span className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 shadow-md shadow-pink-500/30 shrink-0 transform hover:scale-105 transition-transform duration-300">
                  <Heart className="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 text-white fill-white" />
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-purple-200">
                  WishReveal
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400">
                  Ai
                </span>
                <span className="text-amber-400 text-2xl sm:text-3xl font-normal">⚡</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-xl px-1 sm:px-0">
              একটি স্মার্ট ও মজার প্ল্যাটফর্ম, যেখানে আপনি জানতে পারবেন
              আপনার বন্ধুর স্বপ্ন, পছন্দ এবং শেয়ার করা ইচ্ছা সম্পর্কে!
            </p>

            {/* Main CTA Button with Heart Burst and Animated Gradient */}
            <div className="pt-2 flex flex-col items-center lg:items-start gap-2.5 w-full">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto relative">
                
                {/* Heart Burst Particles container */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
                  {burstHearts.map((bh) => (
                    <div
                      key={bh.id}
                      className="absolute heart-burst-particle -translate-x-1/2 -translate-y-1/2"
                      style={
                        {
                          '--tx': `${bh.tx}px`,
                          '--ty': `${bh.ty}px`,
                          color: bh.color,
                        } as React.CSSProperties
                      }
                    >
                      <Heart
                        className="fill-current"
                        style={{ width: `${bh.size}px`, height: `${bh.size}px` }}
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleCtaClick}
                  className="w-full sm:w-auto group relative px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 animate-gradient-flow text-white font-bold text-base sm:text-lg shadow-xl shadow-pink-600/30 hover:shadow-purple-500/50 hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 flex items-center justify-center gap-2.5 sm:gap-3 cursor-pointer min-h-[48px] overflow-hidden"
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-pink-200 transition-transform group-hover:translate-x-0.5" />
                  <span className="font-bengali font-bold text-lg sm:text-xl whitespace-nowrap">
                    এখনই শুরু করুন
                  </span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-pink-200 transition-transform group-hover:translate-x-0.5" />
                </button>

                <button
                  onClick={onOpenWishBox}
                  className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 rounded-full bg-white/5 hover:bg-white/10 active:scale-98 border border-white/15 text-slate-200 hover:text-white font-medium text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                >
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300 shrink-0 transform group-hover:rotate-6 transition-transform" />
                  <span className="font-bengali whitespace-nowrap">ইচ্ছা বক্স</span>
                </button>
              </div>

              {/* Small friendly caption with sparkles */}
              <p className="text-pink-300/90 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 pt-1 text-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0 animate-twinkle" />
                <span>মাত্র কয়েকটি প্রশ্নেই শুরু হোক মনের জানালা!</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0 animate-twinkle delay-500" />
              </p>
            </div>

            {/* Trust Badges */}
            <div className="pt-3 grid grid-cols-3 gap-1.5 xs:gap-2 sm:gap-3 w-full max-w-md border-t border-white/10 text-slate-300 font-medium">
              <div className="flex flex-col items-center lg:items-start p-1 text-center lg:text-left">
                <span className="text-white font-bold text-xs xs:text-sm sm:text-base flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" /> ১০,০০০+
                </span>
                <span className="text-slate-400 text-[10px] sm:text-xs">বন্ধু যুক্ত</span>
              </div>
              <div className="flex flex-col items-center lg:items-start p-1 text-center lg:text-left border-x border-white/5 lg:border-none">
                <span className="text-white font-bold text-xs xs:text-sm sm:text-base flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> ১০০%
                </span>
                <span className="text-slate-400 text-[10px] sm:text-xs">নিরাপদ ও গোপন</span>
              </div>
              <div className="flex flex-col items-center lg:items-start p-1 text-center lg:text-left">
                <span className="text-white font-bold text-xs xs:text-sm sm:text-base flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5 text-purple-400 shrink-0" /> স্মার্ট
                </span>
                <span className="text-slate-400 text-[10px] sm:text-xs">এআই ইনসাইট</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Dreaming Character & Cat with sparkling stars */}
          <div className="lg:col-span-6 relative flex justify-center items-center w-full">
            
            {/* Outer Glow Halo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/25 via-pink-500/20 to-sky-500/20 rounded-3xl blur-2xl transform scale-95 pointer-events-none animate-ambient-glow" />

            {/* Sparkling stars positioned delicately around the hero illustration card */}
            <div className="absolute -top-3 -left-3 text-amber-300/80 animate-twinkle pointer-events-none z-20">
              <Sparkles className="w-5 h-5 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            </div>
            <div className="absolute -top-2 right-12 text-pink-400/80 animate-twinkle delay-500 pointer-events-none z-20">
              <Star className="w-4 h-4 fill-pink-400/60 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]" />
            </div>
            <div className="absolute top-1/2 -right-3 text-purple-300/80 animate-twinkle delay-1000 pointer-events-none z-20">
              <Sparkles className="w-4 h-4 drop-shadow-[0_0_8px_rgba(216,180,254,0.6)]" />
            </div>
            <div className="absolute -bottom-2 left-10 text-cyan-300/80 animate-twinkle delay-700 pointer-events-none z-20">
              <Star className="w-3.5 h-3.5 fill-cyan-300/50 drop-shadow-[0_0_6px_rgba(103,232,249,0.5)]" />
            </div>

            {/* Main Illustration Card with Gentle Floating Animation */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-1.5 sm:p-2.5 bg-gradient-to-b from-white/15 to-white/5 border border-white/20 shadow-2xl backdrop-blur-md max-w-sm sm:max-w-md lg:max-w-none w-full animate-float-gentle">
              
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 group">
                <img
                  src={heroImg}
                  alt="A cute boy dreaming beside a sleeping cat with a glowing thought bubble of wishes"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />

                {/* Floating quote badge on the illustration */}
                <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 bg-[#0d122e]/90 backdrop-blur-md border border-pink-500/30 rounded-xl sm:rounded-2xl px-2.5 py-1.5 sm:px-3.5 sm:py-2 shadow-lg shadow-black/40 text-right pointer-events-none max-w-[80%]">
                  <p className="text-[10px] xs:text-xs sm:text-sm font-semibold text-pink-200 flex items-center gap-1 sm:gap-1.5 justify-end">
                    <span className="truncate">প্রতিটি মনের ইচ্ছা গুরুত্বপূর্ণ...</span>
                    <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-400 fill-pink-400 shrink-0 inline-block animate-float-heart" />
                  </p>
                </div>

                {/* Subtle movement indicator for the sleeping cat corner */}
                <div className="absolute bottom-16 left-3 pointer-events-none z-20">
                  <div className="animate-cat-subtle flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0a0f2c]/75 backdrop-blur-sm border border-amber-300/30 text-[10px] text-amber-200 shadow-md">
                    <span>🐾</span>
                    <span className="hidden xs:inline font-bengali">মিষ্টি বিড়াল ঘুমাচ্ছে</span>
                  </div>
                </div>

                {/* Bottom interactive floating hint */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 bg-gradient-to-r from-[#0d1334]/95 to-[#191338]/95 backdrop-blur-md border border-white/15 rounded-xl p-2 sm:p-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 relative shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-slate-200 text-[11px] sm:text-xs font-medium truncate">
                      কুইজ লাইভ: স্বপ্ন ও পছন্দ
                    </span>
                  </div>
                  <button
                    onClick={onStartQuiz}
                    className="px-2 sm:px-2.5 py-1 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold text-[11px] sm:text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0 min-h-[32px] hover:scale-105 active:scale-95"
                  >
                    <span>ট্রাই করুন</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
