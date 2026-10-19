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
import { VoluntaryAnswer } from '../types/backend';
import { useLanguage } from '../i18n/LanguageContext';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFriendshipLink: () => void;
  onOpenAiAnalysis?: (answers: VoluntaryAnswer[]) => void;
}

const questionIcons = [
  { icon: Globe2, iconColor: 'text-sky-400' },
  { icon: Palette, iconColor: 'text-purple-400' },
  { icon: Gift, iconColor: 'text-pink-400' },
  { icon: Coffee, iconColor: 'text-amber-400' },
  { icon: Compass, iconColor: 'text-emerald-400' },
];

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onOpenFriendshipLink,
  onOpenAiAnalysis,
}) => {
  const { language, t, quizQuestions } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const currentQuestion = quizQuestions[currentStep];

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentStep] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Finished all questions - show simulated analysis
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setIsComplete(true);
      }, 1200);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setIsComplete(false);
    setIsAnalyzing(false);
  };

  const handleCopyResult = () => {
    const text = `✨ WishReveal Ai - আমার ফ্রেন্ডশিপ কুইজ ফলাফল:\n` +
      quizQuestions
        .map((q, idx) => `${idx + 1}. ${q.category}: ${q.options[selectedAnswers[idx]]?.text || 'নির্বাচিত নয়'}`)
        .join('\n') +
      `\n\nআপনিও জেনে নিন আপনার বন্ধুর ইচ্ছা: WishReveal Ai`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const answersForAi: VoluntaryAnswer[] = selectedAnswers.map((optIdx, qIdx) => ({
    category: quizQuestions[qIdx]?.category || 'ক্যাটাগরি',
    answer: quizQuestions[qIdx]?.options[optIdx]?.text || '',
  }));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl rounded-2xl sm:rounded-3xl bg-[#0d1335] border border-pink-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#10173e]/90 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="quiz-modal-title" className="font-bold text-sm sm:text-base font-bengali text-white">
                {isComplete
                  ? (language === 'bn' ? 'কুইজ সম্পন্ন হয়েছে 🎉' : 'Quiz Completed 🎉')
                  : (language === 'bn' ? 'ফ্রেন্ডশিপ উইশ কুইজ' : 'Friendship Wish Quiz')}
              </h2>
              <span className="text-[11px] text-pink-300/80 font-bengali">
                {isComplete
                  ? (language === 'bn' ? 'আপনার পছন্দের সারসংক্ষেপ' : 'Your Preference Summary')
                  : (language === 'bn' ? `প্রশ্ন ${currentStep + 1} / ${quizQuestions.length}` : `Question ${currentStep + 1} of ${quizQuestions.length}`)}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={t.close}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Progress Bar (when in quiz mode) */}
          {!isComplete && !isAnalyzing && (
            <div className="space-y-1.5">
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {isAnalyzing ? (
            /* Loading State */
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 font-bengali">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-xl animate-pulse">
                  <Bot className="w-8 h-8" />
                </div>
                <span className="absolute -top-1 -right-1 p-1 rounded-full bg-sky-400 animate-ping" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-white">
                  {language === 'bn' ? 'উত্তরগুলো সংকলন করা হচ্ছে...' : 'Compiling your answers...'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'bn' ? 'আপনার পছন্দের প্রোফাইল প্রস্তুত হচ্ছে' : 'Preparing your preference profile'}
                </p>
              </div>
            </div>
          ) : !isComplete ? (
            /* Questions View */
            <div className="space-y-5 font-bengali animate-in fade-in duration-150">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">
                  {currentQuestion.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentStep] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3.5 sm:p-4 rounded-xl text-left text-xs sm:text-sm transition-all cursor-pointer flex items-start gap-3 border ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-400/80 text-white font-medium shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full mt-0.5 shrink-0 flex items-center justify-center border text-xs ${
                        isSelected ? 'border-pink-400 bg-pink-500 text-white' : 'border-slate-500'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <span className="leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Step Navigation Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    currentStep === 0
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{language === 'bn' ? 'পূর্ববর্তী' : 'Previous'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={selectedAnswers[currentStep] === undefined}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    selectedAnswers[currentStep] === undefined
                      ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md hover:brightness-110 active:scale-95'
                  }`}
                >
                  <span>
                    {currentStep === quizQuestions.length - 1
                      ? (language === 'bn' ? 'ফলাফল দেখুন' : 'View Results')
                      : (language === 'bn' ? 'পরবর্তী প্রশ্ন' : 'Next Question')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Quiz Results Screen */
            <div className="space-y-5 font-bengali animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-950/40 via-purple-950/40 to-indigo-950/40 border border-pink-500/30 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 mx-auto">
                  <Heart className="w-6 h-6 fill-pink-400" />
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {language === 'bn' ? 'আপনার ফ্রেন্ডশিপ উইশ প্রোফাইল প্রস্তুত!' : 'Your Friendship Wish Profile is Ready!'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                  {language === 'bn'
                    ? 'আপনার নির্বাচিত উত্তরগুলো সুন্দরভাবে সংরক্ষিত হয়েছে। এবার বন্ধুকে আমন্ত্রণ জানিয়ে তার পছন্দ জানুন অথবা AI এনালাইসিস করে দেখুন!'
                    : 'Your answers are securely compiled. Now invite a friend to see what they love, or analyze these answers with AI!'}
                </p>
              </div>

              {/* Answers Review List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-pink-300">
                  {language === 'bn' ? 'আপনার নির্বাচিত উত্তরসমূহ:' : 'Your Selected Answers:'}
                </h4>
                <div className="space-y-2">
                  {quizQuestions.map((q, idx) => {
                    const chosen = q.options[selectedAnswers[idx]]?.text || (language === 'bn' ? 'উত্তর দেওয়া হয়নি' : 'Not answered');
                    return (
                      <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                        <span className="text-[10px] text-pink-400 font-semibold">{q.category}</span>
                        <p className="text-xs text-slate-200">{chosen}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-2">
                {onOpenAiAnalysis && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAiAnalysis(answersForAi);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Bot className="w-4 h-4" />
                    <span>
                      {language === 'bn'
                        ? 'এই উত্তরগুলো OpenAI ChatGPT দিয়ে বিশ্লেষণ করান'
                        : 'Analyze these answers with OpenAI ChatGPT'}
                    </span>
                  </button>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCopyResult}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? t.copied : (language === 'bn' ? 'ফলাফল কপি করুন' : 'Copy Results')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenFriendshipLink();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{language === 'bn' ? 'বন্ধুকে ইনভাইট পাঠান' : 'Send Invite to Friend'}</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Home className="w-4 h-4 text-pink-400" />
                    <span>{language === 'bn' ? 'হোমপেজে ফিরে যান' : 'Back to Home'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'আবার নতুন করে কুইজ খেলুন' : 'Restart Quiz'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
