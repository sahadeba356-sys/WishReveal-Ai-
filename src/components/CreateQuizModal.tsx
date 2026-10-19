import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Trash2, CheckCircle2, Lock, Share2 } from 'lucide-react';
import { api } from '../services/apiClient';
import { Quiz, User } from '../types/backend';

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onQuizCreated: (quiz: Quiz) => void;
  onOpenLogin: () => void;
}

export const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onQuizCreated,
  onOpenLogin,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('dreams');
  const [questions, setQuestions] = useState<
    Array<{ id: string; question: string; category: string; categoryIcon: string; options: Array<{ text: string }> }>
  >([
    {
      id: 'q_1',
      question: 'যদি যেকোনো জায়গায় ঘুরে আসার সুযোগ পান, প্রথম পছন্দ কোথায়?',
      category: 'ভ্রমণ ও প্রকৃতি',
      categoryIcon: '✈️',
      options: [
        { text: 'পাহাড়ের শান্ত কুয়াশা ও পাইন বন' },
        { text: 'সমুদ্রের উত্তাল নীল ঢেউ ও সূর্যাস্ত' },
        { text: 'জাপানের চেরি ব্লসম ও প্রাচীন ঐতিহ্যের ঐতিহাসিক শহর' },
      ],
    },
    {
      id: 'q_2',
      question: 'কেমন উপহার পেলে আপনার মুখে সবচেয়ে খাঁটি হাসি ফুটে উঠবে?',
      category: 'পছন্দের উপহার',
      categoryIcon: '🎁',
      options: [
        { text: 'কাছের মানুষের হাতে লেখা আবেগমাখা চিঠি' },
        { text: 'দৈনন্দিন কাজে সহায়ক স্মার্ট টেক গ্যাজেট' },
        { text: 'একসাথে কোনো সারপ্রাইজ ডে-আউট ট্রিপ' },
      ],
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleAddQuestion = () => {
    if (questions.length >= 8) return;
    setQuestions((prev) => [
      ...prev,
      {
        id: `q_${Date.now()}`,
        question: '',
        category: 'সাধারণ পছন্দ',
        categoryIcon: '✨',
        options: [{ text: '' }, { text: '' }],
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddOption = (qIdx: number) => {
    const q = questions[qIdx];
    if (q.options.length >= 5) return;
    const updated = [...questions];
    updated[qIdx].options.push({ text: '' });
    setQuestions(updated);
  };

  const handleRemoveOption = (qIdx: number, optIdx: number) => {
    const q = questions[qIdx];
    if (q.options.length <= 2) return;
    const updated = [...questions];
    updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== optIdx);
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || title.trim().length < 3) {
      setErrorMessage('কুইজের শিরোনাম লিখুন (কমপক্ষে ৩ অক্ষর)।');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        setErrorMessage(`প্রশ্ন #${i + 1}-এর বিবরণ ফাঁকা রাখা যাবে না।`);
        return;
      }
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].text.trim()) {
          setErrorMessage(`প্রশ্ন #${i + 1}-এর অপশন #${j + 1} লিখুন।`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const created = await api.createQuiz({
        title: title.trim(),
        description: description.trim(),
        theme,
        isPrivate: true,
        allowMultipleResponses: false,
        questions: questions.map((q) => ({
          id: q.id,
          question: q.question.trim(),
          category: q.category,
          categoryIcon: q.categoryIcon,
          options: q.options.map((opt) => ({ text: opt.text.trim(), category: q.category })),
        })),
      });

      onQuizCreated(created);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'কুইজ তৈরিতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-quiz-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-bengali"
    >
      <div className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-[#0c1233] border border-pink-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#10173e]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="create-quiz-modal-title" className="font-bold text-sm sm:text-base text-white">
                কাস্টম ফ্রেন্ডশিপ কুইজ তৈরি করুন
              </h2>
              <p className="text-[11px] text-pink-300/80">
                বন্ধুদের সাথে শেয়ার করে তাদের পছন্দ ও ইচ্ছা জানার কুইজ
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
          {!currentUser ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-pink-300">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-white">লগইন প্রয়োজন</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  কুইজ তৈরি ও রেসপন্স ট্র্যাক করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                লগইন / রেজিস্টার করুন
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  কুইজের নাম বা শিরোনাম <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: তানভীরের ফ্রেন্ডশিপ উইশ কুইজ..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d26] border border-white/15 focus:border-pink-400 focus:outline-none text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  বিবরণ বা বন্ধুদের উদ্দেশ্যে বার্তা (ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  placeholder="যেমন: আমার প্রিয় বন্ধুরা কে আমাকে কতটা চেনে এবং তাদের পছন্দ কেমন তা জানার কুইজ!"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d26] border border-white/15 focus:border-pink-400 focus:outline-none text-xs text-white"
                />
              </div>

              {/* Questions List */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    কুইজের প্রশ্নসমূহ ({questions.length}/8):
                  </span>
                  {questions.length < 8 && (
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="text-xs text-pink-400 hover:text-pink-300 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>প্রশ্ন যোগ করুন</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3.5">
                  {questions.map((q, qIdx) => (
                    <div key={q.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-pink-300">
                          প্রশ্ন #{qIdx + 1}
                        </span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIdx)}
                            className="text-slate-400 hover:text-rose-400 text-xs flex items-center gap-0.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>মুছুন</span>
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="প্রশ্নটি লিখুন..."
                        value={q.question}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[qIdx].question = e.target.value;
                          setQuestions(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#080d26] border border-white/15 focus:border-pink-400 text-xs text-white"
                      />

                      {/* Options */}
                      <div className="space-y-1.5 pl-2 border-l-2 border-pink-500/20">
                        <span className="text-[11px] text-slate-400 block font-medium">অপশনসমূহ:</span>
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              required
                              placeholder={`অপশন ${optIdx + 1}`}
                              value={opt.text}
                              onChange={(e) => {
                                const updated = [...questions];
                                updated[qIdx].options[optIdx].text = e.target.value;
                                setQuestions(updated);
                              }}
                              className="flex-1 px-2.5 py-1.5 rounded-md bg-[#080d26] border border-white/10 text-xs text-white"
                            />
                            {q.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(qIdx, optIdx)}
                                className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}

                        {q.options.length < 5 && (
                          <button
                            type="button"
                            onClick={() => handleAddOption(qIdx)}
                            className="text-[11px] text-sky-400 hover:underline pt-0.5 cursor-pointer block"
                          >
                            + আরও একটি অপশন যোগ করুন
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'কুইজ তৈরি হচ্ছে...' : 'কুইজ সম্পন্ন করুন ও শেয়ার লিংক পান'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
