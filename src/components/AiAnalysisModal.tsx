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
  UserCheck,
  RefreshCw,
  Copy,
  Check,
  ShieldAlert,
  Info,
  Send,
  MessageCircle,
} from 'lucide-react';
import {
  analyzeFriendWishes,
  askOpenAiFriendAdvisor,
  generateDemoAnalysis,
  AnalysisResult,
  VoluntaryAnswer,
} from '../services/aiService';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: () => void;
  initialAnswers?: VoluntaryAnswer[];
  initialFriendName?: string;
  initialVoluntaryNotes?: string;
}

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
  initialVoluntaryNotes,
}) => {
  const [friendName, setFriendName] = useState(initialFriendName || '');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [voluntaryNotes, setVoluntaryNotes] = useState(initialVoluntaryNotes || '');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  // Stored payload for retry
  const [lastSubmission, setLastSubmission] = useState<{
    friendName: string;
    answers: VoluntaryAnswer[];
    voluntaryNotes: string;
  } | null>(null);

  // Interactive ChatGPT advisor state
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatCopied, setChatCopied] = useState(false);

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
    if (initialVoluntaryNotes) {
      setVoluntaryNotes(initialVoluntaryNotes);
    }
  }, [initialAnswers, initialFriendName, initialVoluntaryNotes, isOpen]);

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
    setApiError(null);
    setAnalysisResult(null);
  };

  const handleClearForm = () => {
    setFriendName('');
    setSelectedAnswers({});
    setVoluntaryNotes('');
    setValidationError(null);
    setApiError(null);
    setAnalysisResult(null);
    setChatResponse(null);
    setChatError(null);
  };

  const runAnalysis = async (
    targetName: string,
    targetAnswers: VoluntaryAnswer[],
    targetNotes: string,
    fallbackDemoOnly: boolean = false
  ) => {
    setIsLoading(true);
    setApiError(null);
    setLoadingStep(0);

    const stepTimer1 = setTimeout(() => setLoadingStep(1), 700);
    const stepTimer2 = setTimeout(() => setLoadingStep(2), 1400);

    try {
      if (fallbackDemoOnly) {
        const demoRes = generateDemoAnalysis({
          friendName: targetName,
          answers: targetAnswers,
          voluntaryNotes: targetNotes,
        });
        setAnalysisResult(demoRes);
      } else {
        const result = await analyzeFriendWishes(
          {
            friendName: targetName,
            answers: targetAnswers,
            voluntaryNotes: targetNotes,
          },
          { fallbackToDemoOnError: false }
        );
        setAnalysisResult(result);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI বিশ্লেষণে অপ্রত্যাশিত ত্রুটি দেখা দিয়েছে।';
      setApiError(msg);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
    }
  };

  const handleSubmitAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = friendName.trim();
    const answerEntries = Object.entries(selectedAnswers).map(([category, answer]) => ({
      category,
      answer,
    }));

    if (!trimmedName) {
      setValidationError('অনুগ্রহ করে আপনার বন্ধুর নাম বা একটি ছদ্মনাম লিখুন।');
      return;
    }

    if (answerEntries.length < 2 && !voluntaryNotes.trim()) {
      setValidationError('অনুগ্রহ করে কমপক্ষে ২টি বিষয়ের উত্তর নির্বাচন করুন বা অতিরিক্ত তথ্য লিখুন, যাতে সঠিক প্যাটার্ন বিশ্লেষণ সম্ভব হয়।');
      return;
    }

    setValidationError(null);
    setApiError(null);

    const payload = {
      friendName: trimmedName,
      answers: answerEntries,
      voluntaryNotes: voluntaryNotes.trim(),
    };
    setLastSubmission(payload);

    await runAnalysis(payload.friendName, payload.answers, payload.voluntaryNotes);
  };

  const handleRetry = async () => {
    if (!lastSubmission) return;
    await runAnalysis(lastSubmission.friendName, lastSubmission.answers, lastSubmission.voluntaryNotes);
  };

  const handleUseDemo = () => {
    if (!lastSubmission) return;
    runAnalysis(lastSubmission.friendName, lastSubmission.answers, lastSubmission.voluntaryNotes, true);
  };

  const handleAskChatGpt = async (customPrompt?: string) => {
    const question = (customPrompt || chatQuestion).trim();
    if (!question) return;

    setChatLoading(true);
    setChatError(null);
    setChatResponse(null);

    try {
      const contextSummary = analysisResult
        ? `Friend: ${analysisResult.friendName}. Preferences: ${analysisResult.suggestions.map((s) => s.title).join(', ')}. Gifts: ${analysisResult.suggestedGifts.map((g) => g.name).join(', ')}`
        : `Friend: ${friendName}`;

      const res = await askOpenAiFriendAdvisor(question, analysisResult?.friendName || friendName, contextSummary);
      setChatResponse(res.reply);
      if (!customPrompt) {
        setChatQuestion('');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ChatGPT থেকে পরামর্শ পেতে সাময়িক সমস্যা হয়েছে।';
      setChatError(msg);
    } finally {
      setChatLoading(false);
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
                <span>বন্ধুর পছন্দ বুঝুন OpenAI ChatGPT-এর সাহায্যে</span>
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

          {/* Ethical AI & Privacy Boundary Box */}
          <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/30 text-sky-200 text-xs font-bengali space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sky-300">
              <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
              <span>নীতিমালা ও গোপনীয়তার প্রতিশ্রুতি (Ethical Guidelines)</span>
            </div>
            <p className="leading-relaxed text-slate-300 text-[11px] sm:text-xs">
              • <strong>মন পড়ার ভান নয়:</strong> WishReveal Ai কোনো গোপন চিন্তা পড়তে পারে না।
              <br />
              • <strong>স্বেচ্ছায় শেয়ারকৃত উত্তর:</strong> কেবল বন্ধু স্বেচ্ছায় যেসব উত্তর জানিয়েছেন, সেগুলোর শব্দার্থিক প্যাটার্ন মিলিয়ে সৃজনশীল আইডিয়া তৈরি হয়।
              <br />
              • <strong>সুরক্ষিত ব্যাকএন্ড:</strong> OpenAI API Key সম্পূর্ণ সার্ভার-সাইডে রক্ষিত থাকে এবং ব্রাউজারে কখনো দৃশ্যমান হয় না।
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
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 font-bengali"
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
                    if (apiError) setApiError(null);
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

              {/* API error notice with Retry button */}
              {apiError && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs font-bengali space-y-2.5 animate-in fade-in duration-150"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-rose-300">AI যোগাযোগে সমস্যা হয়েছে:</strong>
                      <p className="text-[11px] text-rose-200/90 leading-relaxed">{apiError}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={isLoading}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>পুনরায় চেষ্টা করুন (Retry)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleUseDemo}
                      disabled={isLoading}
                      className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>ডেমো মোডে ফলাফল দেখুন</span>
                    </button>
                  </div>
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
                  <span>OpenAI ChatGPT দিয়ে বিশ্লেষণ শুরু করুন</span>
                </button>
              </div>

            </form>
          ) : (
            /* Analysis Results Screen */
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Header Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-white/5 border border-white/10 font-bengali">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${
                    analysisResult.mode === 'real_ai'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    <span>{analysisResult.mode === 'real_ai' ? 'লাইভ AI ইঞ্জিন সক্রিয়' : 'স্মার্ট ডেমো মোড'}</span>
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium">
                    {analysisResult.providerName}
                  </span>
                </div>

                <button
                  onClick={handleClearForm}
                  className="text-xs text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>নতুন বিশ্লেষণ</span>
                </button>
              </div>

              {/* Demo Notice Banner */}
              {analysisResult.mode === 'demo_mode' && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-bengali flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block text-amber-300">স্বচ্ছতা বিজ্ঞপ্তি: এটি একটি ডেমো মোড</span>
                    <p className="text-[11px] text-amber-100/90 leading-relaxed">
                      {analysisResult.demoNotice || 'ব্যাকএন্ডে OPENAI_API_KEY কনফিগার করা না থাকায় এটি একটি ডেমো অ্যালগরিদম দিয়ে প্রস্তুত করা হয়েছে। লাইভ ChatGPT উত্তরের জন্য OPENAI_API_KEY সেট করুন।'}
                    </p>
                  </div>
                </div>
              )}

              {/* Friend Overview Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-950/40 via-indigo-950/30 to-purple-950/40 border border-sky-500/30 space-y-3 font-bengali">
                <div className="flex items-center gap-2 text-sky-300 font-bold text-sm sm:text-base">
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400 shrink-0" />
                  <span>{analysisResult.friendName}-এর শেয়ারকৃত উত্তরের বিশ্লেষণ সারসংক্ষেপ</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Uncertainty Notice Banner */}
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
              <div className="space-y-3 font-bengali">
                <h3 className="text-xs sm:text-sm font-bold text-sky-300 flex items-center gap-1.5">
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
                          <span className="font-bold text-xs sm:text-sm text-white">
                            {sug.title}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                          {sug.confidence}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pl-6">
                        {sug.description}
                      </p>

                      <div className="ml-6 p-2.5 rounded-lg bg-black/25 border border-white/5 space-y-1 text-[11px]">
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
                <div className="space-y-3 pt-2 font-bengali">
                  <h3 className="text-xs sm:text-sm font-bold text-pink-300 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-pink-400" />
                    <span>সম্ভাব্য সারপ্রাইজ উপহার আইডিয়াসমূহ (পরামর্শ মাত্র):</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {analysisResult.suggestedGifts.map((gift, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-gradient-to-br from-pink-950/20 to-purple-950/20 border border-pink-500/20 space-y-1.5"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-pink-200">
                          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 shrink-0" />
                          <span className="truncate">{gift.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {gift.reason}
                        </p>
                        <span className="block text-[10px] text-pink-300/70 pt-0.5">
                          ভিত্তিক: "{gift.supportingAnswer}"
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Friendship Tip */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200 text-xs font-bengali flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-purple-300 block">বন্ধুত্বের আন্তরিক পরামর্শ:</span>
                  <p className="text-[11px] text-purple-100/90 leading-relaxed">
                    {analysisResult.friendshipTip}
                  </p>
                </div>
              </div>

              {/* Interactive ChatGPT Friendship Advisor Drawer */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0c1638] to-[#121136] border border-sky-500/30 space-y-3 font-bengali">
                <div className="flex items-center gap-2 text-sky-300 font-bold text-xs sm:text-sm">
                  <Bot className="w-4 h-4 text-sky-400" />
                  <span>ChatGPT-এর কাছে সরাসরি আরও পরামর্শ চান:</span>
                </div>

                {/* Quick Chips */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAskChatGpt(`${analysisResult.friendName}-এর জন্য ৫০০-১০০০ টাকার মধ্যে একটি সারপ্রাইজ উপহার আইডিয়া দিন`)}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    🎁 বাজেট উপহার আইডিয়া
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAskChatGpt(`${analysisResult.friendName}-এর জন্য একটি মন ছুঁয়ে যাওয়া জন্মদিনের শুভেচ্ছা বার্তা লিখে দিন`)}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    💌 জন্মদিনের শুভেচ্ছা বার্তা
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAskChatGpt(`${analysisResult.friendName}-এর সাথে আড্ডা আরও জমজমাট করতে চমৎকার কোনো প্ল্যানিং টিপস দিন`)}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    ☕ আড্ডার চমৎকার প্ল্যান
                  </button>
                </div>

                {/* Custom Question Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`যেমন: ${analysisResult.friendName}-এর সাথে সারপ্রাইজ পার্টির আইডিয়া...`}
                    value={chatQuestion}
                    onChange={(e) => setChatQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAskChatGpt();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-black/30 border border-white/15 focus:border-sky-400 focus:outline-none text-xs text-white placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAskChatGpt()}
                    disabled={chatLoading || !chatQuestion.trim()}
                    className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 disabled:bg-white/10 disabled:text-slate-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {chatLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>জানুন</span>
                  </button>
                </div>

                {/* ChatGPT Response Area */}
                {chatResponse && (
                  <div className="p-3.5 rounded-xl bg-black/40 border border-sky-400/30 text-xs text-slate-200 space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px] text-sky-300 font-semibold border-b border-white/10 pb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-sky-400" />
                        <span>ChatGPT-এর পরামর্শ:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(chatResponse);
                          setChatCopied(true);
                          setTimeout(() => setChatCopied(false), 2000);
                        }}
                        className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {chatCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{chatCopied ? 'কপি হয়েছে' : 'কপি'}</span>
                      </button>
                    </div>
                    <div className="leading-relaxed whitespace-pre-wrap text-slate-300 text-[11px] sm:text-xs">
                      {chatResponse}
                    </div>
                  </div>
                )}

                {chatError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-center justify-between gap-2">
                    <span>{chatError}</span>
                    <button
                      type="button"
                      onClick={() => handleAskChatGpt()}
                      className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold cursor-pointer shrink-0"
                    >
                      আবার চেষ্টা করুন
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 font-bengali">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-98 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px] border border-white/10"
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
                  className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 active:scale-98 text-white font-semibold text-xs shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
                >
                  <Gift className="w-4 h-4" />
                  <span>নিজের কুইজ খেলে দেখুন</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Loading Overlay with stepped progression */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#0c1233]/92 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-200 font-bengali">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/30 animate-pulse">
                <Bot className="w-8 h-8" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-pink-500 text-white animate-bounce">
                <Sparkles className="w-4 h-4 fill-white" />
              </span>
            </div>

            <div className="space-y-1.5 max-w-sm">
              <h4 className="text-base font-bold text-white">
                {loadingStep === 0 && '🔍 স্বেচ্ছায় প্রদত্ত উত্তরগুলো যাচাই করা হচ্ছে...'}
                {loadingStep === 1 && '💡 OpenAI ChatGPT-এর সাথে যোগাযোগ হচ্ছে...'}
                {loadingStep === 2 && '✨ নিরাপদ ও অর্থবহ উপহার আইডিয়া প্রস্তুত হচ্ছে...'}
              </h4>
              <p className="text-xs text-sky-200/80">
                {friendName}-এর উত্তর থেকে পছন্দের নিখুঁত বিশ্লেষণ প্রস্তুত হচ্ছে
              </p>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping delay-150" />
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping delay-300" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
