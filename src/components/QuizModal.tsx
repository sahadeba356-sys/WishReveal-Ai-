import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Heart,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Gift,
  RefreshCw,
  Share2,
  Copy,
  Check,
  Compass,
  Palette,
  Coffee,
  Globe2,
  Bot,
  Home,
} from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFriendshipLink: () => void;
  onOpenAiAnalysis?: (answers: { category: string; answer: string }[]) => void;
}

interface Question {
  id: number;
  category: string;
  categoryIcon: string;
  question: string;
  options: {
    text: string;
    icon: string;
    vibe: string;
    gift: string;
  }[];
}

const quizQuestions: Question[] = [
  {
    id: 1,
    category: 'ভ্রমণ ও প্রকৃতি',
    categoryIcon: '✈️',
    question: 'যদি যেকোনো জায়গায় এখনই ঘুরে আসার সুযোগ পান, আপনার প্রথম পছন্দ কোথায়?',
    options: [
      { text: 'পাহাড়ের শান্ত কুয়াশা, মেঘ ও পাইন বন', icon: '🌲', vibe: 'প্রকৃতিপ্রেমী ও শান্তপ্রিয়', gift: 'ক্যাম্পিং ফ্লাস্ক বা মাটির চায়ের মগ' },
      { text: 'সমুদ্রের উত্তাল নীল ঢেউ, সৈকত ও সূর্যাস্ত', icon: '🌊', vibe: 'রোমাঞ্চপ্রিয় ও প্রাণবন্ত', gift: 'ওয়াটারপ্রুফ ব্লুটুথ স্পিকার বা বিচ সানগ্লাস' },
      { text: 'জাপানের চেরি ব্লসম ও প্রাচীন ঐতিহ্যের শহর', icon: '🌸', vibe: 'সৌন্দর্যপিপাসু ও স্বপ্নচারী', gift: 'জাপানিজ কিউট নোটবুক বা সুবাসিত ক্যান্ডেল' },
      { text: 'ইউরোপের প্রাচীন ক্যাফে, আর্ট গ্যালারি ও মিউজিয়াম', icon: '🎨', vibe: 'শিল্পমনা ও রুচিশীল', gift: 'হ্যান্ডমেড লেদার জার্নাল বা আর্ট প্রিন্ট' },
    ],
  },
  {
    id: 2,
    category: 'শখ ও অবসর',
    categoryIcon: '🎨',
    question: 'সারাদিনের ব্যস্ততা শেষে নিজের একান্ত সময়ে কোন শখে মেতে থাকতে সবচেয়ে বেশি ভালোবাসেন?',
    options: [
      { text: 'বইয়ের পাতায় হারিয়ে যাওয়া বা ডায়েরি লেখা', icon: '📖', vibe: 'ভাবুক ও অন্তর্মুখী মন', gift: 'বইমেলা গিফট ভাউচার ও মেটালিক বুকমার্ক' },
      { text: 'ভিডিও গেম খেলা বা টেক গ্যাজেট এক্সপ্লোর করা', icon: '🎮', vibe: 'টেকপ্রিয় ও আধুনিক', gift: 'RGB গেমিং এক্সেসরিজ বা ওয়্যারলেস হেডসেট' },
      { text: 'ছবি আঁকা, ফটোগ্রাফি বা ক্রিয়েটিভ কোনো কাজ', icon: '📷', vibe: 'সৃজনশীল শিল্পী', gift: 'পোলারয়েড ক্যামেরা ফিল্ম বা স্কেচিং কিট' },
      { text: 'গান শোনা, বাদ্যযন্ত্র বাজানো বা নতুন রান্না ট্রাই করা', icon: '🎵', vibe: 'সুরপ্রেমী ও ফুডি', gift: 'প্রিমিয়াম স্পটিফাই কিউরেটেড প্লেলিস্ট ও বেকিং টুলস' },
    ],
  },
  {
    id: 3,
    category: 'পছন্দের উপহার',
    categoryIcon: '🎁',
    question: 'কেমন উপহার পেলে আপনার মুখে সবচেয়ে খাঁটি আনন্দের হাসি ফুটে উঠবে?',
    options: [
      { text: 'কাছের মানুষের আবেগমাখা হাতে লেখা চিঠি ও মেমোরি কিপসেক', icon: '💌', vibe: 'ইমোশনাল ও গভীর সম্পর্কপ্রিয়', gift: 'কাস্টম ফ্রেন্ডশিপ মেমোরি জার্নাল' },
      { text: 'দৈনন্দিন জীবনে কাজে লাগে এমন কোনো স্মার্ট টেক গ্যাজেট', icon: '⚡', vibe: 'বাস্তববাদী ও কর্মচঞ্চল', gift: 'স্মার্ট ওয়াচ বা ম্যাগনেটিক পাওয়ার ব্যাংক' },
      { text: 'সুস্বাদু চকোলেট বক্স, মিষ্টি পারফিউম বা সুন্দর ফুল', icon: '🍫', vibe: 'উৎসবমুখর ও মিষ্টভাষী', gift: 'আর্টিশানাল ডার্ক চকোলেট ও সুবাসিত পারফিউম' },
      { text: 'একসাথে চমৎকার কোনো কনসার্ট বা ডে-আউট ট্রিপের টিকিট', icon: '🎟️', vibe: 'স্মৃতিপ্রেমী ও সামাজিক', gift: 'মিউজিক ফেস্ট পাস বা সারপ্রাইজ ডে-আউট' },
    ],
  },
  {
    id: 4,
    category: 'ব্যক্তিগত রুচি ও আড্ডা',
    categoryIcon: '☕',
    question: 'বন্ধুদের সাথে সময় কাটানোর ক্ষেত্রে কোনটি আপনার সবচেয়ে বেশি পছন্দের?',
    options: [
      { text: 'নিরিবিলি বারান্দা বা ছাদে রাত জেগে মন খুলে গভীর আড্ডা', icon: '🌙', vibe: 'বিশ্বস্ত ও খাঁটি বন্ধু', gift: 'ম্যাচিং কফি মগ সেট ও গল্প' },
      { text: 'স্ট্রিট ফুড ও ক্যাফেতে নতুন নতুন খাবারের খোঁজে ঘুরে বেড়ানো', icon: '🍜', vibe: 'খাদ্যরসিক ও আনন্দের সঙ্গী', gift: 'প্রিয় রেস্তোরাঁর ট্রিট কুপন' },
      { text: 'একসাথে কোনো সিনেমা নাইট, সিরিজ দেখা বা গান উপভোগ করা', icon: '🎬', vibe: 'শান্ত ও সমঝদার বন্ধু', gift: 'নেটফ্লিক্স নাইট ও পপকর্ন বাকেট' },
      { text: 'বিপদে কিংবা মন খারাপে নীরবে নিঃশর্ত পাশে দাঁড়িয়ে থাকা', icon: '🤝', vibe: 'অমূল্য নির্ভরতার প্রতীক', gift: 'আলিঙ্গন ও আন্তরিক শুভেচ্ছা কার্ড' },
    ],
  },
  {
    id: 5,
    category: 'মনের গভীর স্বপ্ন',
    categoryIcon: '🌟',
    question: 'মনের গভীরে সযত্নে লুকিয়ে রাখা সবচেয়ে বড় স্বপ্ন বা ইচ্ছা কোনটি?',
    options: [
      { text: 'স্বাধীনভাবে পুরো পৃথিবী ঘুরে সব সংস্কৃতি ও মানুষের গল্প জানা', icon: '🌍', vibe: 'মুক্ত বিহঙ্গ ও যাযাবর মন', gift: 'ট্রাভেল স্ক্র্যাচ ওয়ার্ল্ড ম্যাপ' },
      { text: 'নিজের প্রতিভায় সৃজনশীল কোনো কাজের মাধ্যমে সমাজে দাগ রেখে যাওয়া', icon: '✨', vibe: 'উদ্ভাবক ও পথপ্রদর্শক', gift: 'ক্রিয়েটিভ মাস্টারক্লাস বা টুলকিট' },
      { text: 'কাছের প্রিয় মানুষদের সবসময় হাসিখুশি ও নিরাপদে রাখা', icon: '💖', vibe: 'স্নেহশীল ও দায়িত্ববান হৃদয়', gift: 'ফ্যামিলি ও ফ্রেন্ডস ফটোফ্রেম অ্যালবাম' },
      { text: 'সব কৃত্রিম ব্যস্ততা পেরিয়ে প্রকৃতির কোলে একটি শান্ত নির্ঝঞ্ঝাট জীবন', icon: '🏡', vibe: 'আধ্যাত্মিক ও মানসিক প্রশান্তি', gift: 'ইনডোর গ্রিন প্ল্যান্ট ও মেডিটেশন মিউজিক' },
    ],
  },
];

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onOpenFriendshipLink,
  onOpenAiAnalysis,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [copied, setCopied] = useState(false);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentQ = quizQuestions[currentStep];

  const handleSelectOption = (index: number) => {
    const updated = [...selectedAnswers];
    updated[currentStep] = index;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setIsComplete(true);
      }, 1100);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setIsComplete(false);
    setIsAnalyzing(false);
  };

  const handleCopyResult = () => {
    const textToCopy = `✨ WishReveal Ai - আমার ফ্রেন্ডশিপ কুইজ ফলাফল:\n` +
      `• ভ্রমণ: ${quizQuestions[0].options[selectedAnswers[0]]?.text || 'পছন্দ নির্ধারিত'}\n` +
      `• শখ: ${quizQuestions[1].options[selectedAnswers[1]]?.text || 'পছন্দ নির্ধারিত'}\n` +
      `• প্রিয় উপহার: ${quizQuestions[2].options[selectedAnswers[2]]?.text || 'পছন্দ নির্ধারিত'}\n` +
      `• ড্রিম ভাইব: ${personalityArchetype}\n\n` +
      `তোমার বন্ধুর মনের ইচ্ছা জানতে খেলো: https://wishreveal.ai`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Archetype derived from answers
  const personalityArchetype =
    selectedAnswers[4] === 0
      ? 'মুক্ত বিহঙ্গ বিশ্ব-ভ্রমণপিপাসু'
      : selectedAnswers[4] === 1
      ? 'উদ্ভাবক ও সৃজনশীল স্বপ্নবাজ'
      : selectedAnswers[4] === 2
      ? 'স্নেহশীল হৃদয়ের পথপ্রদর্শক'
      : 'প্রশান্তিময় শান্ত মনের সাধক';

  const selectedGifts = selectedAnswers
    .map((optIdx, qIdx) => quizQuestions[qIdx]?.options[optIdx]?.gift)
    .filter(Boolean);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl rounded-2xl sm:rounded-3xl bg-[#0e1438] border border-pink-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#121945]/80 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300 shrink-0">
              <Heart className="w-4 h-4 fill-pink-400" />
            </div>
            <div className="min-w-0">
              <h3 id="quiz-modal-title" className="font-bold text-sm sm:text-base font-brand text-white truncate">
                Secret Wish Quiz
              </h3>
              <p className="text-[11px] text-pink-200/70 font-bengali truncate">
                ৫টি প্রশ্নে বন্ধুর পছন্দ, শখ ও মনের ইচ্ছা উন্মোচন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="কুইজ বন্ধ করুন"
            className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {isAnalyzing ? (
            /* AI Analyzing State */
            <div className="py-14 sm:py-18 text-center space-y-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-pink-500/30 border-t-pink-500 animate-spin" />
                <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl">
                  ✨
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-lg sm:text-xl font-bold text-white font-bengali">
                  উত্তরগুলো বিশ্লেষণ করা হচ্ছে...
                </h4>
                <p className="text-xs sm:text-sm text-pink-200/70 font-bengali">
                  স্বেচ্ছায় প্রদত্ত পছন্দের ভিত্তিতে সারপ্রাইজ সাজেশন তৈরি হচ্ছে
                </p>
              </div>
            </div>
          ) : isComplete ? (
            /* Final Summary State */
            <div className="space-y-5 animate-in zoom-in-95 duration-200">
              {/* Highlight Banner */}
              <div className="rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-purple-900/60 via-pink-900/40 to-indigo-900/60 border border-pink-500/40 text-center relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold mb-2 sm:mb-3 border border-pink-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>কুইজ ফলাফল ও ড্রিম সামারি</span>
                </div>

                <h4 className="text-xl sm:text-2xl font-extrabold text-white font-bengali mb-1 leading-snug">
                  {personalityArchetype}
                </h4>
                <p className="text-pink-200/80 text-xs font-normal font-bengali">
                  উত্তরসমূহের সমন্বয়ে প্রস্তুত সম্ভাব্য ব্যক্তিত্ব ও স্বপ্নের সারমর্ম
                </p>

                {/* Compatibility gauge */}
                <div className="mt-3.5 flex items-center justify-center gap-2">
                  <div className="w-32 h-2 rounded-full bg-black/40 overflow-hidden">
                    <div className="w-[96%] h-full bg-gradient-to-r from-pink-500 via-purple-400 to-amber-300 rounded-full" />
                  </div>
                  <span className="text-xs font-bold text-amber-300">৯৬% ড্রিম ম্যাচ</span>
                </div>
              </div>

              {/* Comprehensive Answer Breakdown (Final Summary) */}
              <div className="space-y-2.5">
                <h5 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2 font-bengali">
                  <Compass className="w-4 h-4 text-pink-400" />
                  <span>আপনার নির্বাচিত পছন্দের সারসংক্ষেপ:</span>
                </h5>
                <div className="space-y-1.5 text-xs text-slate-300 bg-white/5 rounded-xl p-3 border border-white/10 font-bengali">
                  {quizQuestions.map((q, idx) => {
                    const chosenOption = q.options[selectedAnswers[idx]];
                    return (
                      <div key={q.id} className="flex items-start gap-2 py-1 border-b border-white/5 last:border-none">
                        <span className="text-pink-400 font-bold shrink-0">{q.categoryIcon} {q.category}:</span>
                        <span className="text-slate-100 font-medium">
                          {chosenOption ? chosenOption.text : 'অনুল্লিখিত'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gift & Wish Insights */}
              <div className="space-y-2.5">
                <h5 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2 font-bengali">
                  <Gift className="w-4 h-4 text-pink-400" />
                  <span>পরামর্শকৃত সারপ্রাইজ উপহার আইডিয়াসমূহ (পরামর্শ মাত্র):</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedGifts.slice(0, 4).map((gift, i) => (
                    <div
                      key={i}
                      className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                      <span className="font-medium leading-relaxed font-bengali">{gift}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {onOpenAiAnalysis && (
                  <button
                    onClick={() => {
                      onClose();
                      const answersForAi = selectedAnswers.map((optIdx, qIdx) => ({
                        category: quizQuestions[qIdx]?.category || 'ক্যাটাগরি',
                        answer: quizQuestions[qIdx]?.options[optIdx]?.text || '',
                      }));
                      onOpenAiAnalysis(answersForAi);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-sky-400 font-bengali"
                  >
                    <Bot className="w-4 h-4 text-sky-200" />
                    <span>এই উত্তরগুলো AI দিয়ে বিশ্লেষণ করান</span>
                  </button>
                )}

                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <button
                    onClick={handleCopyResult}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'কপি হয়েছে!' : 'ফলাফল কপি করুন'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenFriendshipLink();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 active:scale-98 border border-white/15 text-slate-200 hover:text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-pink-400"
                  >
                    <Share2 className="w-4 h-4 text-pink-300" />
                    <span>বন্ধুকে কুইজ লিংক পাঠান</span>
                  </button>
                </div>
              </div>

              {/* Navigation Back & Restart Actions */}
              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-200 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
                >
                  <Home className="w-4 h-4 text-pink-400" />
                  <span>হোমপেজে ফিরে যান</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="text-xs text-slate-400 hover:text-pink-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer py-2 px-3 rounded-lg hover:bg-white/5 font-bengali"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>নতুন করে কুইজ শুরু করুন</span>
                </button>
              </div>
            </div>
          ) : (
            /* Question Stepper View */
            <div className="space-y-4 sm:space-y-5">
              {/* Progress Indicator */}
              <div>
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="text-pink-300 font-bold">{currentQ.categoryIcon} {currentQ.category}</span>
                    <span>· প্রশ্ন {currentStep + 1} / {quizQuestions.length}</span>
                  </span>
                  <span className="text-pink-300 font-semibold">
                    {Math.round(((currentStep + 1) / quizQuestions.length) * 100)}% সম্পন্ন
                  </span>
                </div>
                <div className="w-full h-1.5 sm:h-2 rounded-full bg-white/10 overflow-hidden" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={quizQuestions.length}>
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-bold text-white font-bengali leading-snug">
                  {currentQ.question}
                </h4>
                <p className="text-[11px] text-slate-400 font-bengali">
                  যেকোনো একটি বিকল্প বেছে নিন (পরবর্তীতে পরিবর্তনযোগ্য):
                </p>
              </div>

              {/* Options */}
              <div role="radiogroup" aria-label={currentQ.question} className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentStep] === idx;
                  return (
                    <button
                      key={idx}
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3 sm:p-3.5 rounded-xl text-left border transition-all duration-200 flex items-center gap-3 cursor-pointer min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
                        isSelected
                          ? 'bg-pink-500/20 border-pink-400/80 shadow-md shadow-pink-500/20 text-white ring-1 ring-pink-400/40'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 active:bg-white/15 text-slate-200'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl shrink-0 p-1 sm:p-1.5 rounded-lg bg-white/5">
                        {opt.icon}
                      </span>
                      <span className="text-xs sm:text-sm font-medium font-bengali leading-relaxed flex-1">
                        {opt.text}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Stepper Navigation Controls */}
              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10 gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
                    currentStep === 0
                      ? 'text-slate-600 cursor-not-allowed opacity-40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10 cursor-pointer'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>পূর্ববর্তী</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={selectedAnswers[currentStep] === undefined}
                  className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
                    selectedAnswers[currentStep] !== undefined
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 active:scale-95 text-white shadow-md cursor-pointer'
                      : 'bg-white/10 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>{currentStep === quizQuestions.length - 1 ? 'ফলাফল ও সামারি দেখুন' : 'পরবর্তী প্রশ্ন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
