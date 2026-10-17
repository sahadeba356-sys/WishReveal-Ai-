import React, { useState } from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import sunsetImg from '../assets/images/sunset_friends_cta_1792078186938.jpg';
import { RevealOnScroll } from './RevealOnScroll';

interface FriendshipCTAProps {
  onStartQuiz: () => void;
}

interface BurstHeart {
  id: number;
  tx: number;
  ty: number;
  color: string;
  size: number;
}

export const FriendshipCTA: React.FC<FriendshipCTAProps> = ({ onStartQuiz }) => {
  const [burstHearts, setBurstHearts] = useState<BurstHeart[]>([]);

  const handleCtaClick = () => {
    const colors = ['#f472b6', '#ec4899', '#f43f5e', '#fb7185', '#c084fc'];
    const newHearts: BurstHeart[] = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      tx: (Math.random() - 0.5) * 80,
      ty: -(40 + Math.random() * 50),
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
    <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden bg-[#0a0d26] w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Sunset Card Container with Viewport Entrance Animation */}
        <RevealOnScroll>
          <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-4xl overflow-hidden shadow-2xl border border-white/20 min-h-[320px] sm:min-h-[400px] md:min-h-[440px] flex items-center justify-center">
            
            {/* Background Sunset Artwork */}
            <img
              src={sunsetImg}
              alt="Two close friends sitting side by side looking at a magical sunset"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 transform hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
              loading="lazy"
            />

            {/* Warm Gradient Atmosphere Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090d26]/95 via-[#0d1338]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-amber-900/30 mix-blend-multiply" />

            {/* Playful Handwritten English Doodles */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-12 hidden md:block text-right z-20 pointer-events-none transform rotate-3">
              <p className="font-handwriting text-2xl sm:text-3xl lg:text-4xl text-amber-200/90 leading-tight drop-shadow-md">
                Good Friends<br />
                Know Each<br />
                Other&apos;s<br />
                Dreams ♡
              </p>
            </div>

            {/* Floating Heart Outline Doodle */}
            <div className="absolute top-8 left-12 sm:left-24 hidden lg:block text-pink-300/80 pointer-events-none animate-float-heart">
              <Heart className="w-10 h-10 stroke-[1.5] -rotate-12 fill-pink-500/10" />
            </div>

            {/* Content Center Block */}
            <div className="relative z-20 text-center max-w-2xl mx-auto px-4 py-8 sm:py-10 space-y-3.5 sm:space-y-5">
              
              {/* Glowing Heart Icon with gentle float */}
              <div className="inline-flex items-center justify-center p-2.5 sm:p-3 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-400/30 mb-0.5 animate-float-heart">
                <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-pink-400 fill-pink-400 animate-pulse-glow" />
              </div>

              {/* Main Headline */}
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug drop-shadow-lg px-2">
                বন্ধুত্ব মানে শুধু সাথে থাকা নয়,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200">
                  বন্ধুর মনের স্বপ্ন ও ইচ্ছাকেও জানা!
                </span>
              </h2>

              {/* Description Subtitle */}
              <p className="text-pink-100/90 text-xs sm:text-base font-medium drop-shadow-md max-w-lg mx-auto flex items-center justify-center gap-1.5 px-2">
                <span>আজই আপনার বন্ধুর পছন্দ ও স্বপ্নের গল্প শুরু করুন</span>
                <span className="inline-block animate-float-heart">
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 inline shrink-0" />
                </span>
              </p>

              {/* CTA Button with Heart Burst and Gradient Flow */}
              <div className="pt-2 w-full sm:w-auto relative flex justify-center">
                
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
                  className="w-full sm:w-auto group px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 animate-gradient-flow hover:scale-105 active:scale-95 text-white font-bold text-base sm:text-lg shadow-xl shadow-purple-900/60 hover:shadow-pink-500/60 transition-transform duration-200 inline-flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                >
                  <span className="font-bengali font-bold">শুরু করুন</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
};
