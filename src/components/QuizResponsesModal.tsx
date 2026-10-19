import React, { useState, useEffect } from 'react';
import { X, FileCheck2, Bot, Trash2, Calendar, User as UserIcon, MessageSquare, AlertCircle, Share2, Plus } from 'lucide-react';
import { api } from '../services/apiClient';
import { Quiz, QuizResponse, VoluntaryAnswer } from '../types/backend';

interface QuizResponsesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateQuiz: () => void;
  onOpenShareModal: (quiz: Quiz) => void;
  onOpenAiAnalysisWithData: (friendName: string, answers: VoluntaryAnswer[], voluntaryNotes?: string) => void;
}

export const QuizResponsesModal: React.FC<QuizResponsesModalProps> = ({
  isOpen,
  onClose,
  onOpenCreateQuiz,
  onOpenShareModal,
  onOpenAiAnalysisWithData,
}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadQuizzes = async () => {
    setIsLoadingQuizzes(true);
    try {
      const data = await api.getMyQuizzes();
      setQuizzes(data);
      if (data.length > 0 && !selectedQuizId) {
        setSelectedQuizId(data[0].id);
      }
    } catch {
      // Ignored
    } finally {
      setIsLoadingQuizzes(false);
    }
  };

  const loadResponses = async (quizId: string) => {
    setIsLoadingResponses(true);
    try {
      const data = await api.getQuizResponses(quizId);
      setResponses(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'রেসপন্স লোড করতে সমস্যা হয়েছে।');
    } finally {
      setIsLoadingResponses(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadQuizzes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedQuizId) {
      loadResponses(selectedQuizId);
    }
  }, [selectedQuizId]);

  useEffect(() => {
    if (!isOpen) return;
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-bengali"
    >
      <div className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl bg-[#0e1438] border border-sky-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#121945]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h2 id="quiz-responses-title" className="font-bold text-sm sm:text-base text-white">
                আমার কুইজ ও বন্ধুদের রেসপন্স ড্যাশবোর্ড
              </h2>
              <p className="text-[11px] text-sky-200/80">
                বন্ধুরা যেসব উত্তর স্বেচ্ছায় শেয়ার করেছে তা পর্যালোচনা করুন
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

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quizzes Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-300">আমার তৈরি কুইজসমূহ:</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCreateQuiz();
              }}
              className="text-xs text-pink-400 hover:text-pink-300 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন কুইজ তৈরি করুন</span>
            </button>
          </div>

          {isLoadingQuizzes ? (
            <p className="text-xs text-slate-400 text-center py-4">কুইজ তালিকা লোড হচ্ছে...</p>
          ) : quizzes.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-400 space-y-3">
              <p>আপনি এখনো কোনো কাস্টম কুইজ তৈরি করেননি।</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCreateQuiz();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs cursor-pointer shadow-md"
              >
                প্রথম কুইজ তৈরি করুন
              </button>
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {quizzes.map((q) => {
                const isSelected = selectedQuizId === q.id;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setSelectedQuizId(q.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-400 text-white shadow-sm'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{q.title}</span>
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-white/10">
                      {q.responsesCount ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Current Quiz Details & Action */}
          {currentQuiz && (
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold text-xs sm:text-sm text-white">{currentQuiz.title}</span>
                <p className="text-[11px] text-slate-400">{currentQuiz.description || 'বন্ধুদের পছন্দের কুইজ'}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenShareModal(currentQuiz)}
                  className="px-3 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>আমন্ত্রণ লিংক</span>
                </button>

                {confirmDeleteId === currentQuiz.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDeleteQuiz(currentQuiz.id)}
                      className="px-2.5 py-1 rounded bg-rose-600 text-white text-[11px] font-semibold cursor-pointer"
                    >
                      নিশ্চিত মুছুন
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-1 rounded bg-white/10 text-slate-300 text-[11px] cursor-pointer"
                    >
                      বাতিল
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(currentQuiz.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    title="কুইজ মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Responses List */}
          {selectedQuizId && (
            <div className="space-y-3 pt-1">
              <span className="text-xs font-bold text-slate-300 block">
                প্রাপ্ত রেসপন্সসমূহ ({responses.length}):
              </span>

              {isLoadingResponses ? (
                <p className="text-xs text-slate-400 text-center py-4">রেসপন্স লোড হচ্ছে...</p>
              ) : responses.length === 0 ? (
                <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-400 space-y-1">
                  <p>এই কুইজে এখনো কোনো বন্ধু রেসপন্স সাবমিট করেনি।</p>
                  <p className="text-[11px] text-slate-500">আমন্ত্রণ লিংকটি বন্ধুদের মেসেঞ্জারে বা হোয়াটসঅ্যাপে পাঠান!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {responses.map((resp) => (
                    <div
                      key={resp.id}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 hover:border-sky-500/30 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-xs font-bold">
                            {resp.respondentName.charAt(0)}
                          </div>
                          <span className="font-bold text-xs sm:text-sm text-white">
                            {resp.respondentName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(resp.submittedAt).toLocaleDateString('bn-BD')}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleLaunchAiAnalysis(resp)}
                            className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Bot className="w-3.5 h-3.5 text-sky-400" />
                            <span>AI দিয়ে বিশ্লেষণ করান</span>
                          </button>
                        </div>
                      </div>

                      {/* Answers detail */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {resp.answers.map((a, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-black/20 border border-white/5 space-y-0.5">
                            <span className="text-[10px] text-sky-300 font-medium">{a.category || a.questionText}</span>
                            <p className="text-white text-[11px]">{a.selectedOption}</p>
                          </div>
                        ))}
                      </div>

                      {resp.voluntaryNote && (
                        <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 flex items-start gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block text-[10px] text-purple-300">বন্ধুর চিরকুট:</span>
                            <p className="text-[11px] leading-relaxed">{resp.voluntaryNote}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
