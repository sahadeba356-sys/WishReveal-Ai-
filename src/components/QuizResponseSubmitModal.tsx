/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Lock,
} from 'lucide-react';
import { api } from '../services/apiClient';
import { Quiz } from '../types/backend';

interface QuizResponseSubmitModalProps {
  isOpen: boolean;
  shareToken: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const QuizResponseSubmitModal: React.FC<QuizResponseSubmitModalProps> = ({
  isOpen,
  shareToken,
  onClose,
  onSuccess,
}) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [respondentName, setRespondentName] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [voluntaryNote, setVoluntaryNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen || !shareToken) return;

    setLoading(true);
    setError(null);
    setIsCompleted(false);

    api.getQuizByShareToken(shareToken)
      .then((data) => {
        setQuiz(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'কুইজের তথ্য লোড করতে ব্যর্থ হয়েছে।');
        setLoading(false);
      });
  }, [isOpen, shareToken]);

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

  const handleSelectOption = (questionId: string, optionText: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionText,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz) return;
    setError(null);

    const trimmedName = respondentName.trim();
    if (!trimmedName) {
      setError('অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }

    if (!consentGiven) {
      setError('উত্তরের গোপনীয়তা ও বন্ধুর সাথে শেয়ারের সম্মতি প্রদান আবশ্যক।');
      return;
    }

    // Check if at least 1 answer is selected
    const answerEntries = Object.entries(selectedAnswers);
    if (answerEntries.length === 0) {
      setError('কমপক্ষে একটি প্রশ্নের উত্তর নির্বাচন করুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      const answersPayload = quiz.questions
        .filter((q) => selectedAnswers[q.id])
        .map((q) => ({
          questionId: q.id,
          questionText: q.question,
          category: q.category,
          selectedOption: selectedAnswers[q.id],
        }));

      await api.submitQuizResponse(shareToken, {
        respondentName: trimmedName,
        respondentConsentGiven: true,
        answers: answersPayload,
        voluntaryNote: voluntaryNote.trim() || undefined,
      });

      setIsCompleted(true);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'রেসপন্স পাঠাতে সমস্যা হয়েছে।';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="respond-quiz-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl rounded-2xl sm:rounded-3xl bg-[#0e1438] border border-pink-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#121945]/90 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div className="min-w-0">
              <h2 id="respond-quiz-title" className="font-bold text-sm sm:text-base font-bengali text-white truncate">
                {quiz ? quiz.title : 'ফ্রেন্ডশিপ উইশ কুইজ'}
              </h2>
              <p className="text-[11px] text-pink-200/70 font-bengali truncate">
                {quiz?.creatorName ? `${quiz.creatorName}-এর জন্য আপনার উত্তর` : 'বন্ধুর প্রশ্নের উত্তর দিন'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-pink-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">

          {loading ? (
            <div className="py-12 text-center space-y-3 font-bengali">
              <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">কুইজের তথ্য লোড হচ্ছে...</p>
            </div>
          ) : error && !quiz ? (
            <div className="py-8 text-center space-y-3 font-bengali">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="font-bold text-sm text-white">কুইজটি খোলা সম্ভব হয়নি</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">{error}</p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-semibold cursor-pointer"
              >
                ফিরে যান
              </button>
            </div>
          ) : isCompleted ? (
            /* Success confirmation */
            <div className="py-8 text-center space-y-4 font-bengali animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">উত্তর সফলভাবে জমা হয়েছে! 💖</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  ধন্যবাদ {respondentName}! আপনার পছন্দের উত্তরগুলো নিরাপদভাবে {quiz?.creatorName}-এর কাছে সংরক্ষিত হয়েছে।
                </p>
              </div>

              {/* Security confirmation notice */}
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-200 max-w-md mx-auto text-left flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p>
                  <strong>নিরাপত্তা প্রোটোকল:</strong> আপনার উত্তরটি শুধুমাত্র {quiz?.creatorName} লগইন করার পর দেখতে পারবেন। অন্য কোনো বহিরাগত ব্যক্তির এই তথ্যে প্রবেশাধিকার নেই।
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
                >
                  সম্পন্ন করুন
                </button>
              </div>
            </div>
          ) : (
            /* Quiz Questions Form */
            <form onSubmit={handleSubmit} className="space-y-4">

              {error && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-bengali flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Creator Intro */}
              <div className="p-3 rounded-xl bg-pink-950/30 border border-pink-500/25 text-pink-200 text-xs font-bengali flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                <span>
                  <strong>{quiz?.creatorName}</strong> আপনাকে এই কুইজে আমন্ত্রণ জানিয়েছেন।
                </span>
              </div>

              {/* Respondent Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-bengali">
                  আপনার নাম <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="যেমন: সাদিয়া তাসনিম"
                    value={respondentName}
                    onChange={(e) => setRespondentName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#090d26] border border-white/15 focus:border-pink-500 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 font-bengali"
                  />
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-3.5 pt-1">
                {quiz?.questions.map((q, idx) => {
                  const selected = selectedAnswers[q.id];
                  return (
                    <div
                      key={q.id || idx}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5 font-bengali"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                        <span>{q.categoryIcon || '✨'}</span>
                        <span>প্রশ্ন {idx + 1}: {q.question}</span>
                      </div>

                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = selected === opt.text;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectOption(q.id, opt.text)}
                              className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center gap-2.5 border cursor-pointer ${
                                isOptionSelected
                                  ? 'bg-pink-500/20 border-pink-400 text-white font-semibold'
                                  : 'bg-black/20 border-white/5 text-slate-300 hover:bg-white/5'
                              }`}
                            >
                              <span className={`w-3.5 h-3.5 rounded-full shrink-0 border flex items-center justify-center ${
                                isOptionSelected ? 'border-pink-400 bg-pink-500 text-white' : 'border-slate-500'
                              }`}>
                                {isOptionSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                              <span className="leading-relaxed">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Voluntary Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-bengali">
                  বন্ধুর জন্য কোনো অতিরিক্ত শুভেচ্ছা বার্তা বা মন্তব্য (ঐচ্ছিক):
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: শুভ জন্মদিন বন্ধু! তোমার জন্য অনেক ভালোবাসা..."
                  value={voluntaryNote}
                  onChange={(e) => setVoluntaryNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#090d26] border border-white/15 focus:border-pink-500 focus:outline-none text-xs text-white placeholder-slate-500 font-bengali resize-none"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs font-bengali">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-black/40 text-pink-500 focus:ring-0"
                  />
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">
                      স্বেচ্ছায় শেয়ার ও গোপনীয়তার সম্মতি <span className="text-rose-400">*</span>
                    </span>
                    <span className="text-[11px] text-slate-300 leading-relaxed block">
                      আমি স্বেচ্ছায় এই উত্তরগুলো আমার বন্ধুর সাথে শেয়ার করছি এবং বুঝতে পারছি যে তিনি এই উত্তরগুলো তার ব্যক্তিগত ড্যাশবোর্ডে দেখতে পারবেন।
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || !consentGiven}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-500 disabled:opacity-50 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[44px] font-bengali focus-visible:ring-2 focus-visible:ring-pink-400"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'পাঠানো হচ্ছে...' : 'উত্তর সাবমিট করুন'}</span>
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
