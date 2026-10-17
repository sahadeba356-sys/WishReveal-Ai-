/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Bot,
  Sparkles,
  Heart,
  CheckCircle2,
  Gift,
  Compass,
  AlertCircle,
  HelpCircle,
  Cpu,
  UserCheck,
  RefreshCw,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
  Info,
  Send,
  Sparkle,
  MessageCircle,
} from 'lucide-react';
import { analyzeFriendWishes, AnalysisResult, VoluntaryAnswer } from '../services/aiService';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: () => void;
  initialAnswers?: VoluntaryAnswer[];
  initialFriendName?: string;
}

// 5 Standard Question Themes matching the Secret Wish Quiz
const categoryQuestions = [
  {
    category: 'ভ্রমণ ও প্রকৃতি',
    icon: '✈️',
    label: 'ভ্রমণ ও প্রিয় পরিবেশ',
    options: [
      'পাহাড়ের শান্ত কুয়াশা, মেঘ ও পাইন বন',
      'সমুদ্রের উত্তাল নীল ঢেউ, সৈকত ও সূর্যাস্ত',
      'জাপানের চেরি ব্লসম ও প্রাচীন ঐতিহ্যের শহর',
      'ইউরোপের প্রাচীন ক্যাফে, আর্ট গ্যালারি ও মিউজিয়াম',
    ],
  },
  {
    category: 'শখ ও অবসর',
    icon: '🎨',
    label: 'অবসর সময় ও শখের মাধ্যম',
    options: [
      'বইয়ের পাতায় হারিয়ে যাওয়া বা ডায়েরি লেখা',
      'ভিডিও গেম খেলা বা টেক গ্যাজেট এক্সপ্লোর করা',
      'ছবি আঁকা, ফটোগ্রাফি বা ক্রিয়েটিভ কোনো কাজ',
      'গান শোনা, বাদ্যযন্ত্র বাজানো বা নতুন রান্না ট্রাই করা',
    ],
  },
  {
    category: 'পছন্দের উপহার',
    icon: '🎁',
    label: 'যে উপহারে খাঁটি আনন্দ পায়',
    options: [
      'কাছের মানুষের আবেগমাখা হাতে লেখা চিঠি ও মেমোরি কিপসেক',
      'দৈনন্দিন জীবনে কাজে লাগে এমন কোনো স্মার্ট টেক গ্যাজেট',
      'সুস্বাদু চকোলেট বক্স, মিষ্টি পারফিউম বা সুন্দর ফুল',
      'একসাথে চমৎকার কোনো কনসার্ট বা ডে-আউট ট্রিপের টিকিট',
    ],
  },
  {
    category: 'রুচি ও আড্ডা',
    icon: '☕',
    label: 'আড্ডা ও সময় কাটানোর ধরণ',
    options: [
      'নিরিবিলি বারান্দা বা ছাদে রাত জেগে মন খুলে গভীর আড্ডা',
      'স্ট্রিট ফুড ও ক্যাফেতে নতুন নতুন খাবারের খোঁজে ঘুরে বেড়ানো',
      'একসাথে কোনো সিনেমা নাইট, সিরিজ দেখা বা গান উপভোগ করা',
      'বিপদে কিংবা মন খারাপে নীরবে নিঃশর্ত পাশে দাঁড়িয়ে থাকা',
    ],
  },
  {
    category: 'মনের গভীর স্বপ্ন',
    icon: '🌟',
    label: 'জীবনের সবচেয়ে বড় লালিত স্বপ্ন',
    options: [
      'স্বাধীনভাবে পুরো পৃথিবী ঘুরে সব সংস্কৃতি ও মানুষের গল্প জানা',
      'নিজের প্রতিভায় সৃজনশীল কোনো কাজের মাধ্যমে সমাজে দাগ রেখে যাওয়া',
      'কাছের প্রিয় মানুষদের সবসময় হাসিখুশি ও নিরাপদে রাখা',
      'সব কৃত্রিম ব্যস্ততা পেরিয়ে প্রকৃতির কোলে একটি শান্ত নির্ঝঞ্ঝাট জীবন',
    ],
  },
];

// Presets for quick demonstration
const presetScenarios = [
  {
    name: 'তানভীর (ভ্রমণ ও পাহাড়ি পরিবেশপ্রেমী)',
    friendName: 'তানভীর',
    answers: [
      { category: 'ভ্রমণ ও প্রকৃতি', answer: 'পাহাড়ের শান্ত কুয়াশা, মেঘ ও পাইন বন' },
      { category: 'শখ ও অবসর', answer: 'ছবি আঁকা, ফটোগ্রাফি বা ক্রিয়েটিভ কোনো কাজ' },
      { category: 'পছন্দের উপহার', answer: 'কাছের মানুষের আবেগমাখা হাতে লেখা চিঠি ও মেমোরি কিপসেক' },
      { category: 'মনের গভীর স্বপ্ন', answer: 'স্বাধীনভাবে পুরো পৃথিবী ঘুরে সব সংস্কৃতি ও মানুষের গল্প জানা' },
    ],
    notes: 'বন্ধুটি খুব সকালে হাঁটতে পছন্দ করে এবং ট্রাভেল ডায়েরি লিখে রাখে।',
  },
  {
    name: 'সাদিয়া (টেক ও গেমিং অনুরাগী)',
    friendName: 'সাদিয়া',
    answers: [
      { category: 'ভ্রমণ ও প্রকৃতি', answer: 'জাপানের চেরি ব্লসম ও প্রাচীন ঐতিহ্যের শহর' },
      { category: 'শখ ও অবসর', answer: 'ভিডিও গেম খেলা বা টেক গ্যাজেট এক্সপ্লোর করা' },
      { category: 'পছন্দের উপহার', answer: 'দৈনন্দিন জীবনে কাজে লাগে এমন কোনো স্মার্ট টেক গ্যাজেট' },
      { category: 'রুচি ও আড্ডা', answer: 'একসাথে কোনো সিনেমা নাইট, সিরিজ দেখা বা গান উপভোগ করা' },
    ],
    notes: 'নতুন গেমিং মাউস আর মেকানিক্যাল কিবোর্ড নিয়ে কথা বলতে ভালোবাসে।',
  },
  {
    name: 'রাফসান (বই, সাহিত্য ও চা-প্রেমী)',
    friendName: 'রাফসান',
    answers: [
      { category: 'ভ্রমণ ও প্রকৃতি', answer: 'ইউরোপের প্রাচীন ক্যাফে, আর্ট গ্যালারি ও মিউজিয়াম' },
      { category: 'শখ ও অবসর', answer: 'বইয়ের পাতায় হারিয়ে যাওয়া বা ডায়েরি লেখা' },
      { category: 'রুচি ও আড্ডা', answer: 'নিরিবিলি বারান্দা বা ছাদে রাত জেগে মন খুলে গভীর আড্ডা' },
      { category: 'মনের গভীর স্বপ্ন', answer: 'সব কৃত্রিম ব্যস্ততা পেরিয়ে প্রকৃতির কোলে একটি শান্ত নির্ঝঞ্ঝাট জীবন' },
    ],
    notes: 'বৃষ্টির দিনে কফি আর রবীন্দ্রসংগীতের ভীষণ ভক্ত।',
  },
];

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  onStartQuiz,
  initialAnswers,
  initialFriendName,
}) => {
  const [friendName, setFriendName] = useState(initialFriendName || '');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [voluntaryNotes, setVoluntaryNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  // Sync initial answers if provided
  useEffect(() => {
    if (initialAnswers && initialAnswers.length > 0) {
      const map: Record<string, string> = {};
      initialAnswers.forEach((ans) => {
        map[ans.category] = ans.answer;
      });
      setSelectedAnswers(map);
    }
    if (initialFriendName) {
      setFriendName(initialFriendName);
    }
  }, [initialAnswers, initialFriendName, isOpen]);

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

  const handleSelectOption = (category: string, option: string) => {
    setValidationError(null);
    setSelectedAnswers((prev) => {
      const updated = { ...prev };
      if (updated[category] === option) {
        delete updated[category];
      } else {
        updated[category] = option;
      }
      return updated;
    });
  };

  const handleApplyPreset = (preset: typeof presetScenarios[0]) => {
    setFriendName(preset.friendName);
    const map: Record<string, string> = {};
    preset.answers.forEach((a) => {
      map[a.category] = a.answer;
    });
    setSelectedAnswers(map);
    setVoluntaryNotes(preset.notes);
    setValidationError(null);
    setAnalysisResult(null);
  };

  const handleClearForm = () => {
    setFriendName('');
    setSelectedAnswers({});
    setVoluntaryNotes('');
    setValidationError(null);
    setAnalysisResult(null);
  };

  const handleSubmitAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = friendName.trim();
    const answerEntries = Object.entries(selectedAnswers).map(([category, answer]) => ({
      category,
      answer,
    }));

    // Validation
    if (!trimmedName) {
      setValidationError('অনুগ্রহ করে আপনার বন্ধুর নাম বা একটি ছদ্মনাম লিখুন।');
      return;
    }

    if (answerEntries.length < 2 && !voluntaryNotes.trim()) {
      setValidationError('অনুগ্রহ করে কমপক্ষে ২টি বিষয়ের উত্তর নির্বাচন করুন বা অতিরিক্ত তথ্য লিখুন, যাতে সঠিক প্যাটার্ন বিশ্লেষণ সম্ভব হয়।');
      return;
    }

    setValidationError(null);
    setIsLoading(true);
    setLoadingStep(0);

    // Friendly stepped loading animation
    const stepTimer1 = setTimeout(() => setLoadingStep(1), 700);
    const stepTimer2 = setTimeout(() => setLoadingStep(2), 1400);

    try {
      const result = await analyzeFriendWishes({
        friendName: trimmedName,
        answers: answerEntries,
        voluntaryNotes: voluntaryNotes.trim(),
      });
      setAnalysisResult(result);
    } catch {
      // Handled inside service
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!analysisResult) return;
    const textToCopy = `✨ WishReveal Ai - ${analysisResult.friendName}-এর পছন্দ বিশ্লেষণ\n\n` +
      `📌 সারসংক্ষেপ:\n${analysisResult.summary}\n\n` +
      `💡 সম্ভাব্য পছন্দসমূহ:\n` +
      analysisResult.suggestions.map((s, idx) => `${idx + 1}. ${s.title} (${s.confidence})\n- যে উত্তরের ভিত্তিতে: "${s.supportingAnswer}"\n- কারণ: ${s.reasoning}`).join('\n\n') +
      `\n\n🎁 উপহার আইডিয়া:\n` +
      analysisResult.suggestedGifts.map((g, idx) => `• ${g.name} (${g.reason})`).join('\n') +
      `\n\n⚠️ ${analysisResult.uncertaintyStatement}`;

    navigator.clipboard.writeText(textToCopy);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-analysis-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-[#0c1233] border border-sky-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#101944]/90 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500/30 to-blue-600/30 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0 shadow-inner">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 id="ai-analysis-modal-title" className="font-bold text-sm sm:text-base text-white font-bengali truncate flex items-center gap-2">
                <span>বন্ধুর পছন্দ বুঝুন AI-এর সাহায্যে</span>
              </h2>
              <p className="text-[11px] text-sky-200/80 font-bengali truncate">
                স্বেচ্ছায় শেয়ার করা উত্তরের প্যাটার্ন থেকে পছন্দের বিশ্লেষণ ও উপহারের আইডিয়া
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">

          {/* Ethical AI & Privacy Boundary Box (Critical Compliance) */}
          <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/30 text-sky-200 text-xs font-bengali space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sky-300">
              <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
              <span>নীতিমালা ও গোপনীয়তার প্রতিশ্রুতি (Ethical Guidelines)</span>
            </div>
            <p className="leading-relaxed text-slate-300 text-[11px] sm:text-xs">
              • <strong>মন পড়ার ভান নয়:</strong> WishReveal Ai কোনো গোপন চিন্তা বা অবচেতন মনের ইচ্ছা পড়তে পারে না।
              <br />
              • <strong>স্বেচ্ছায় শেয়ারকৃত উত্তর:</strong> কেবল বন্ধু স্বেচ্ছায় যেসব উত্তর জানিয়েছেন, সেগুলোর শব্দার্থিক প্যাটার্ন মিলিয়ে সৃজনশীল আইডিয়া তৈরি হয়।
              <br />
              • <strong>সংবেদনশীল তথ্য মুক্ত:</strong> ব্যক্তিগত, অর্থনৈতিক বা অতি-সংবেদনশীল কোনো অনুমানের স্থান নেই।
            </p>
          </div>

          {!analysisResult ? (
            /* Input & Questionnaire Form */
            <form onSubmit={handleSubmitAnalysis} className="space-y-5">
              
              {/* Presets Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 font-bengali flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>দ্রুত নমুনা প্রোফাইল দিয়ে পরখ করুন:</span>
                  </span>
                  {(friendName || Object.keys(selectedAnswers).length > 0) && (
                    <button
                      type="button"
                      onClick={handleClearForm}
                      className="text-[11px] text-pink-400 hover:underline cursor-pointer flex items-center gap-1 font-bengali"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>ফর্ম রিসেট</span>
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {presetScenarios.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>✨ {preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Friend's Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="friend-name-input" className="block text-xs font-semibold text-sky-300 font-bengali">
                  বন্ধুর নাম বা ডাকনাম <span className="text-rose-400">*</span>
                </label>
                <input
                  id="friend-name-input"
                  type="text"
                  required
                  placeholder="যেমন: তানভীর, সাদিয়া, ফাহিম..."
                  value={friendName}
                  onChange={(e) => {
                    setFriendName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d26] border border-white/15 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 font-bengali"
                />
              </div>

              {/* Category Questions Selector */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-sky-300 font-bengali flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>বন্ধুর স্বেচ্ছায় দেওয়া উত্তরগুলো নির্বাচন করুন (কমপক্ষে ২টি):</span>
                  </label>
                  <span className="text-[11px] text-sky-400/90 font-medium">
                    {Object.keys(selectedAnswers).length} / {categoryQuestions.length} টি নির্বাচিত
                  </span>
                </div>

                <div className="space-y-3">
                  {categoryQuestions.map((catGroup, idx) => {
                    const currentSelection = selectedAnswers[catGroup.category];
                    return (
                      <div
                        key={idx}
                        className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-sky-500/30 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-medium text-slate-200">
                          <span className="flex items-center gap-1.5 font-bengali font-bold text-sky-300">
                            <span>{catGroup.icon}</span>
                            <span>{catGroup.category}</span>
                          </span>
                          {currentSelection && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bengali">
                              নির্বাচিত
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {catGroup.options.map((opt, optIdx) => {
                            const isSelected = currentSelection === opt;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => handleSelectOption(catGroup.category, opt)}
                                className={`text-left p-2 sm:p-2.5 rounded-lg text-xs transition-all cursor-pointer flex items-start gap-2 border font-bengali ${
                                  isSelected
                                    ? 'bg-sky-500/20 border-sky-400/80 text-white font-medium shadow-sm'
                                    : 'bg-black/20 border-white/5 text-slate-300 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                <span className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 flex items-center justify-center border ${
                                  isSelected ? 'border-sky-400 bg-sky-500 text-white' : 'border-slate-500'
                                }`}>
                                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </span>
                                <span className="leading-snug text-[11px] sm:text-xs">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional voluntary notes */}
              <div className="space-y-1.5">
                <label htmlFor="friend-notes-input" className="block text-xs font-semibold text-slate-300 font-bengali">
                  অতিরিক্ত কোনো কথা বা প্রিয় জিনিসের তথ্য (ঐচ্ছিক):
                </label>
                <textarea
                  id="friend-notes-input"
                  rows={2}
                  placeholder="যেমন: বন্ধু বিড়াল খুব পছন্দ করে এবং প্রায়ই পাহাড়ের ছবি তোলে..."
                  value={voluntaryNotes}
                  onChange={(e) => setVoluntaryNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d26] border border-white/15 focus:border-sky-400 focus:outline-none text-xs text-white placeholder-slate-500 font-bengali resize-none"
                />
              </div>

              {/* Validation error notice */}
              {validationError && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-bengali flex items-center gap-2 animate-in fade-in duration-150"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[46px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 font-bengali"
                >
                  <Bot className="w-4 h-4" />
                  <span>AI বিশ্লেষণ শুরু করুন</span>
                </button>
              </div>

            </form>
          ) : (
            /* Analysis Results Screen */
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Header Status Bar (Mode indicator) */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${
                    analysisResult.mode === 'real_ai'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    <span>{analysisResult.mode === 'real_ai' ? 'লাইভ AI মোড (Gemini 3.8 Flash)' : 'ডেমো মোড (নমুনা প্যাটার্ন)'}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-bengali">
                    বিশ্লেষণ ইঞ্জিন: {analysisResult.providerName}
                  </span>
                </div>

                <button
                  onClick={handleClearForm}
                  className="text-xs text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 font-bengali cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>নতুন বিশ্লেষণ</span>
                </button>
              </div>

              {/* Demo Mode Notice Banner if in demo mode */}
              {analysisResult.mode === 'demo_mode' && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-bengali flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block text-amber-300">স্বচ্ছতা বিজ্ঞপ্তি: এটি একটি ডেমো মোড</span>
                    <p className="text-[11px] text-amber-100/90 leading-relaxed">
                      {analysisResult.demoNotice || 'কোনো লাইভ এআই কী সংযুক্ত না থাকায় এটি পূর্বনির্ধারিত প্যাটার্ন ম্যাচিং অ্যালগরিদম ব্যবহার করছে। আমরা কোনো কৃত্রিমভাবে তৈরি ফলাফলকে বাস্তব এআই বলে দাবি করি না।'}
                    </p>
                  </div>
                </div>
              )}

              {/* Friend Overview Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-950/40 via-indigo-950/30 to-purple-950/40 border border-sky-500/30 space-y-3">
                <div className="flex items-center gap-2 text-sky-300 font-bold text-sm sm:text-base font-bengali">
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400 shrink-0" />
                  <span>{analysisResult.friendName}-এর শেয়ারকৃত উত্তরের বিশ্লেষণ সারসংক্ষেপ</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-bengali leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Explicit Uncertainty Notice Banner */}
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200 text-xs font-bengali flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block text-blue-300">অনিশ্চয়তা ও সম্ভাবনার মাত্রা</span>
                  <p className="text-[11px] text-blue-100/90 leading-relaxed">
                    {analysisResult.uncertaintyStatement}
                  </p>
                </div>
              </div>

              {/* Suggested Preferences with Supporting Evidence */}
              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-sky-300 font-bengali flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-sky-400" />
                  <span>সম্ভাব্য পছন্দ ও আগ্রহসমূহ (প্রমাণ ও যুক্তিসহ):</span>
                </h3>

                <div className="space-y-2.5">
                  {analysisResult.suggestions.map((sug, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-2 hover:border-sky-500/40 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="font-bold text-xs sm:text-sm text-white font-bengali">
                            {sug.title}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bengali">
                          {sug.confidence}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-bengali leading-relaxed pl-6">
                        {sug.description}
                      </p>

                      {/* Explicit evidence mapping box */}
                      <div className="ml-6 p-2.5 rounded-lg bg-black/25 border border-white/5 space-y-1 text-[11px] font-bengali">
                        <div className="text-amber-300/90 font-medium flex items-center gap-1">
                          <span>📌 সমর্থনকারী উত্তর:</span>
                          <span className="text-white">"{sug.supportingAnswer}"</span>
                        </div>
                        <div className="text-slate-400 flex items-start gap-1">
                          <span className="shrink-0">💡 কারণ:</span>
                          <span className="text-slate-300">{sug.reasoning}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Surprise Gifts */}
              {analysisResult.suggestedGifts.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs sm:text-sm font-bold text-pink-300 font-bengali flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-pink-400" />
                    <span>সম্ভাব্য সারপ্রাইজ উপহার আইডিয়াসমূহ (পরামর্শ মাত্র):</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {analysisResult.suggestedGifts.map((gift, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-gradient-to-br from-pink-950/20 to-purple-950/20 border border-pink-500/20 space-y-1.5"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-pink-200 font-bengali">
                          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 shrink-0" />
                          <span className="truncate">{gift.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-bengali leading-relaxed">
                          {gift.reason}
                        </p>
                        <span className="block text-[10px] text-pink-300/70 font-bengali pt-0.5">
                          ভিত্তিক: "{gift.supportingAnswer}"
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Friendship Tip */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200 text-xs font-bengali flex items-start gap-2">
                <Sparkle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-purple-300 block">বন্ধুত্বের আন্তরিক পরামর্শ:</span>
                  <p className="text-[11px] text-purple-100/90 leading-relaxed">
                    {analysisResult.friendshipTip}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-98 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px] border border-white/10 font-bengali"
                >
                  {hasCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{hasCopied ? 'কপি সম্পন্ন হয়েছে!' : 'ফলাফল কপি করুন'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartQuiz();
                  }}
                  className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 active:scale-98 text-white font-semibold text-xs shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px] font-bengali"
                >
                  <Gift className="w-4 h-4" />
                  <span>নিজের কুইজ খেলে দেখুন</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#0c1233]/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-200">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/30 animate-pulse">
                <Bot className="w-8 h-8" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-pink-500 text-white animate-bounce">
                <Sparkles className="w-4 h-4 fill-white" />
              </span>
            </div>

            <div className="space-y-1.5 max-w-sm">
              <h4 className="text-base font-bold text-white font-bengali">
                {loadingStep === 0 && '🔍 স্বেচ্ছায় প্রদত্ত উত্তরগুলো যাচাই করা হচ্ছে...'}
                {loadingStep === 1 && '💡 শব্দার্থ ও পছন্দের প্যাটার্ন অনুসন্ধান করা হচ্ছে...'}
                {loadingStep === 2 && '✨ নিরাপদ ও গঠনমূলক উপহার আইডিয়া প্রস্তুত হচ্ছে...'}
              </h4>
              <p className="text-xs text-sky-200/80 font-bengali">
                {friendName}-এর উত্তর থেকে সম্ভাব্য পছন্দের আইডিয়া প্রস্তুত হচ্ছে
              </p>
            </div>

            {/* Pulsing indicator dots */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping delay-150" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping delay-300" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
