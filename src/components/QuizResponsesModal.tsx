/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  FileCheck2,
  Lock,
  UserCheck,
  Bot,
  Trash2,
  Calendar,
  AlertCircle,
  Sparkles,
  Heart,
  ChevronDown,
  ChevronUp,
  Share2,
} from 'lucide-react';
import { api } from '../services/apiClient';
import { Quiz, QuizResponse, VoluntaryAnswer } from '../types/backend';

interface QuizResponsesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAiAnalysisWithData: (friendName: string, answers: VoluntaryAnswer[], note?: string) => void;
  onOpenShareModal: (quiz: Quiz) => void;
  onCreateNewQuiz: () => void;
}

export const QuizResponsesModal: React.FC<QuizResponsesModalProps> = ({
  isOpen,
  onClose,
  onOpenAiAnalysisWithData,
  onOpenShareModal,
  onCreateNewQuiz,
}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedResponseId, setExpandedResponseId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);

    api.getMyQuizzes()
      .then((data) => {
        setQuizzes(data);
        if (data.length > 0) {
          setSelectedQuizId(data[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'কুইজের তালিকা লোড করতে ব্যর্থ হয়েছে।');
        setLoading(false);
      });
  }, [isOpen]);

  useEffect(() => {
    if (!selectedQuizId) {
      setResponses([]);
      return;
    }

    setLoadingResponses(true);
    setError(null);

    api.getQuizResponses(selectedQuizId)
      .then((resps) => {
        setResponses(resps);
        setLoadingResponses(false);
        if (resps.length > 0) {
          setExpandedResponseId(resps[0].id);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'অননুমোদিত অ্যাক্সেস: রেসপন্স দেখতে ব্যর্থ।');
        setLoadingResponses(false);
      });
  }, [selectedQuizId]);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

  const currentQuiz = quizzes.find((q) => q.id === selectedQuizId);

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await api.deleteQuiz(quizId);
      const updated = quizzes.filter((q) => q.id !== quizId);
      setQuizzes(updated);
      setConfirmDeleteId(null);
      if (updated.length > 0) {
        setSelectedQuizId(updated[0].id);
      } else {
        setSelectedQuizId(null);
        setResponses([]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'কুইজ মুছে ফেলতে ব্যর্থ হয়েছে।');
      setConfirmDeleteId(null);
    }
  };

  const handleLaunchAiAnalysis = (resp: QuizResponse) => {
    const formattedAnswers: VoluntaryAnswer[] = resp.answers.map((a) => ({
      category: a.category || 'পছন্দ',
      answer: a.selectedOption,
    }));

    onClose();
    onOpenAiAnalysisWithData(resp.respondentName, formattedAnswers, resp.voluntaryNote);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-responses-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl bg-[#0e1438] border border-sky-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#121945]/90 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 id="quiz-responses-title" className="font-bold text-sm sm:text-base font-bengali text-white truncate">
                আমার কুইজ ও বন্ধুদের রেসপন্স
              </h2>
              <p className="text-[11px] text-sky-200/70 font-bengali truncate">
                শুধুমাত্র আপনার জন্য অনুমোদিত ব্যক্তিগত ড্যাশবোর্ড
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">

          {/* Authorization Notice Badge */}
          <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/25 text-sky-200 text-xs font-bengali flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px] sm:text-xs">
              <span className="font-bold text-sky-300 block">অনুমোদিত প্রবেশাধিকার (Authorized Access):</span>
              <p className="text-slate-300 leading-normal">
                এই উত্তরগুলো আপনার ব্যক্তিগত অ্যাকাউন্টের সাথে সুরক্ষিত। বহিরাগত কোনো ব্যবহারকারী বা অন্যান্য উত্তরদাতা এগুলো দেখতে পারেন না।
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center space-y-3 font-bengali">
              <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">কুইজ ও রেসপন্স তালিকা লোড হচ্ছে...</p>
            </div>
          ) : error ? (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-bengali flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          ) : quizzes.length === 0 ? (
            /* Empty State */
            <div className="py-10 text-center space-y-3 font-bengali">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
                <Sparkles className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="font-bold text-sm text-white">এখনও কোনো কুইজ তৈরি করা হয়নি</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                আপনার বন্ধুদের ইচ্ছা ও পছন্দের উপহার জানতে একটি সুন্দর ফ্রেন্ডশিপ কুইজ তৈরি করে লিংক পাঠিয়ে দিন!
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onCreateNewQuiz();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
                >
                  এখনই কুইজ তৈরি করুন
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Quiz Selector & Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10 font-bengali">
                <div className="flex-1 min-w-0">
                  <label htmlFor="select-my-quiz" className="block text-[11px] text-slate-400 mb-1">
                    কুইজ নির্বাচন করুন:
                  </label>
                  <select
                    id="select-my-quiz"
                    value={selectedQuizId || ''}
                    onChange={(e) => setSelectedQuizId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#090d26] border border-white/15 text-xs text-white focus:outline-none focus:border-sky-400 cursor-pointer"
                  >
                    {quizzes.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.title} ({q.responsesCount || 0} টি উত্তর)
                      </option>
                    ))}
                  </select>
                </div>

                {currentQuiz && (
                  <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => onOpenShareModal(currentQuiz)}
                      className="px-3 py-2 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/30 text-pink-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>লিংক শেয়ার</span>
                    </button>

                    {confirmDeleteId === currentQuiz.id ? (
                      <div className="flex items-center gap-1.5 p-1 rounded-lg bg-rose-950/60 border border-rose-500/40">
                        <span className="text-[11px] text-rose-200 font-medium px-1">মুছে ফেলবেন?</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuiz(currentQuiz.id)}
                          className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold cursor-pointer"
                        >
                          হ্যাঁ
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[11px] cursor-pointer"
                        >
                          না
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(currentQuiz.id)}
                        className="px-3 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>মুছুন</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Responses List for Selected Quiz */}
              <div className="space-y-3 font-bengali">
                <div className="flex items-center justify-between text-xs font-bold text-sky-300">
                  <span>প্রাপ্ত উত্তরসমূহ ({responses.length}টি)</span>
                  {currentQuiz?.createdAt && (
                    <span className="text-[11px] text-slate-400 font-normal">
                      তৈরি: {new Date(currentQuiz.createdAt).toLocaleDateString('bn-BD')}
                    </span>
                  )}
                </div>

                {loadingResponses ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    রেসপন্স লোড হচ্ছে...
                  </div>
                ) : responses.length === 0 ? (
                  <div className="p-6 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-2">
                    <p className="text-xs text-slate-400">
                      এই কুইজে এখনও কোনো বন্ধু উত্তর পাঠায়নি।
                    </p>
                    {currentQuiz && (
                      <button
                        type="button"
                        onClick={() => onOpenShareModal(currentQuiz)}
                        className="text-xs text-pink-400 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>বন্ধুদের ইনভাইট লিংক পাঠান</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {responses.map((resp) => {
                      const isExpanded = expandedResponseId === resp.id;
                      return (
                        <div
                          key={resp.id}
                          className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden transition-all hover:border-sky-500/30"
                        >
                          {/* Response Accordion Header */}
                          <div
                            onClick={() => setExpandedResponseId(isExpanded ? null : resp.id)}
                            className="p-3.5 flex items-center justify-between cursor-pointer select-none bg-white/[0.01] hover:bg-white/[0.03]"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {resp.respondentName.slice(0, 1)}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                                  {resp.respondentName}
                                </h4>
                                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                  <UserCheck className="w-3 h-3" />
                                  <span>স্বেচ্ছায় শেয়ারকৃত উত্তর</span>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] text-slate-400 hidden sm:inline">
                                {new Date(resp.submittedAt).toLocaleDateString('bn-BD')}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </div>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="p-3.5 sm:p-4 border-t border-white/5 space-y-3 bg-black/20">
                              
                              {/* Answers */}
                              <div className="space-y-2">
                                <span className="text-[11px] font-bold text-slate-400 block">
                                  বন্ধুর নির্বাচিত উত্তরসমূহ:
                                </span>
                                <div className="space-y-1.5">
                                  {resp.answers.map((ans, aIdx) => (
                                    <div
                                      key={aIdx}
                                      className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-xs text-slate-200 space-y-0.5"
                                    >
                                      <span className="text-[11px] text-sky-400 block font-medium">
                                        {ans.category ? `[${ans.category}] ` : ''}{ans.questionText}
                                      </span>
                                      <span className="text-white font-bold block">
                                        👉 {ans.selectedOption}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Voluntary note if any */}
                              {resp.voluntaryNote && (
                                <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200">
                                  <span className="font-bold text-[11px] text-purple-300 block mb-0.5">
                                    বন্ধুর অতিরিক্ত বার্তা:
                                  </span>
                                  <p className="text-slate-300 text-[11px] leading-relaxed">
                                    "{resp.voluntaryNote}"
                                  </p>
                                </div>
                              )}

                              {/* Quick AI Trigger */}
                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleLaunchAiAnalysis(resp)}
                                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                                >
                                  <Bot className="w-4 h-4 text-sky-200" />
                                  <span>{resp.respondentName}-এর এই উত্তরগুলো নিয়ে AI বিশ্লেষণ দেখুন</span>
                                </button>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
