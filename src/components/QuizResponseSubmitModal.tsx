import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, CheckCircle2, AlertCircle, Heart, Lock, ArrowRight } from 'lucide-react';
import { api } from '../services/apiClient';
import { Quiz } from '../types/backend';

interface QuizResponseSubmitModalProps {
  shareToken: string | null;
  onClose: () => void;
  onOpenMyQuiz: () => void;
}

export const QuizResponseSubmitModal: React.FC<QuizResponseSubmitModalProps> = ({
  shareToken,
  onClose,
  onOpenMyQuiz,
}) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [respondentName, setRespondentName] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [voluntaryNote, setVoluntaryNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!shareToken) return;

    const loadQuiz = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await api.getQuizByShareToken(shareToken);
        setQuiz(data);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'কুইজ তথ্য লোড করা যায়নি।');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [shareToken]);

  useEffect(() => {
    if (!shareToken) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shareToken, onClose]);

  if (!shareToken) return null;

  const handleSelectOption = (questionId: string, optionText: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionText,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz) return;

    if (!respondentName.trim() || respondentName.trim().length < 2) {
      setErrorMessage('অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }

    if (!consentGiven) {
      setErrorMessage('বন্ধুর সাথে উত্তর শেয়ারের সম্মতি প্রদান আবশ্যক।');
      return;
    }

    const answerKeys = Object.keys(selectedAnswers);
    if (answerKeys.length === 0) {
      setErrorMessage('কমপক্ষে ১টি প্রশ্নের উত্তর নির্বাচন করুন।');
      return;
    }

    const formattedAnswers = quiz.questions
      .filter((q) => selectedAnswers[q.id])
      .map((q) => ({
        questionId: q.id,
        questionText: q.question,
        category: q.category,
        selectedOption: selectedAnswers[q.id],
      }));

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await api.submitQuizResponse(shareToken, {
        respondentName: respondentName.trim(),
        respondentConsentGiven: true,
        answers: formattedAnswers,
        voluntaryNote: voluntaryNote.trim() || undefined,
      });

      setIsSuccess(true);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'উত্তর জমা দিতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-response-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-bengali"
    >
      <div className="relative w-full max-w-xl rounded-2xl sm:rounded-3xl bg-[#0c1233] border border-pink-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#10173e]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h2 id="quiz-response-modal-title" className="font-bold text-sm sm:text-base text-white">
                {quiz ? `${quiz.creatorName}-এর ফ্রেন্ডশিপ কুইজ` : 'ফ্রেন্ডশিপ কুইজ আমন্ত্রণ'}
              </h2>
              <p className="text-[11px] text-pink-300/80">
                স্বেচ্ছায় আপনার পছন্দের উত্তর জানিয়ে বন্ধুকে চমকে দিন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          {isLoading ? (
            <p className="text-xs text-slate-400 text-center py-8">কুইজ তথ্য লোড হচ্ছে...</p>
          ) : errorMessage && !quiz ? (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-rose-400 mx-auto" />
              <p>{errorMessage}</p>
            </div>
          ) : isSuccess ? (
            /* Success confirmation */
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-base text-white">ধন্যবাদ, {respondentName}!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  আপনার উত্তরটি সফলভাবে আপনার বন্ধু {quiz?.creatorName}-এর কাছে পৌঁছে দেওয়া হয়েছে!
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs cursor-pointer transition-colors"
                >
                  বন্ধ করুন
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMyQuiz();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs shadow-md cursor-pointer hover:brightness-110"
                >
                  নিজের জন্যও কুইজ তৈরি করুন
                </button>
              </div>
            </div>
          ) : quiz ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {quiz.description && (
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300">
                  <span className="font-bold text-pink-300 block mb-0.5">{quiz.creatorName}-এর বার্তা:</span>
                  <p>{quiz.description}</p>
                </div>
              )}

              {/* Respondent Name Field */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-pink-300">
                  আপনার নাম বা ডাকনাম <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: সাদিয়া, রাফসান..."
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d26] border border-white/15 focus:border-pink-400 focus:outline-none text-xs text-white"
                />
              </div>

              {/* Questions */}
              <div className="space-y-4 pt-1">
                <span className="text-xs font-bold text-slate-200 block">
                  প্রশ্নগুলোর উত্তর নির্বাচন করুন:
                </span>

                <div className="space-y-3.5">
                  {quiz.questions.map((q, idx) => (
                    <div key={q.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
                        <span>{q.categoryIcon || '✨'}</span>
                        <span>প্রশ্ন #{idx + 1}: {q.question}</span>
                      </div>

                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[q.id] === opt.text;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectOption(q.id, opt.text)}
                              className={`w-full p-2.5 rounded-lg text-left text-xs transition-all cursor-pointer flex items-start gap-2 border ${
                                isSelected
                                  ? 'bg-pink-500/20 border-pink-400 text-white font-medium shadow-sm'
                                  : 'bg-black/20 border-white/5 text-slate-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-full mt-0.5 shrink-0 flex items-center justify-center border text-[10px] ${
                                isSelected ? 'border-pink-400 bg-pink-500 text-white' : 'border-slate-500'
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </span>
                              <span>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voluntary Note */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  বন্ধুর উদ্দেশ্যে কোনো চিরকুট বা মনের কথা (ঐচ্ছিক):
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: তোর জন্মদিনের সারপ্রাইজ উপহার কিন্তু সেরা হতে হবে..."
                  value={voluntaryNote}
                  onChange={(e) => setVoluntaryNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080d26] border border-white/15 focus:border-pink-400 focus:outline-none text-xs text-white placeholder-slate-500 resize-none"
                />
              </div>

              {/* Consent Checkbox */}
              <label className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-start gap-2 text-xs text-purple-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 rounded text-pink-500 focus:ring-0"
                />
                <span className="leading-relaxed">
                  আমি সচেতনভাবে ও স্বেচ্ছায় এই উত্তরগুলো আমার বন্ধু {quiz.creatorName}-এর সাথে শেয়ার করতে সম্মতি প্রদান করছি।
                </span>
              </label>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'জমা দেওয়া হচ্ছে...' : 'উত্তর সাবমিট করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};
