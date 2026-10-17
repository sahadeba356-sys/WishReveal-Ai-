/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  FileQuestion,
  Plus,
  Trash2,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Link2,
  Calendar,
} from 'lucide-react';
import { api } from '../services/apiClient';
import { Quiz, QuizQuestion } from '../types/backend';

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuizCreated: (quiz: Quiz) => void;
}

const defaultQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'যদি যেকোনো জায়গায় ঘুরে আসার সুযোগ পান, প্রথম পছন্দ কোথায়?',
    category: 'ভ্রমণ ও প্রকৃতি',
    categoryIcon: '✈️',
    options: [
      { text: 'পাহাড়ের শান্ত কুয়াশা ও পাইন বন', category: 'ভ্রমণ' },
      { text: 'সমুদ্রের উত্তাল নীল ঢেউ ও সূর্যাস্ত', category: 'ভ্রমণ' },
      { text: 'জাপানের চেরি ব্লসম ও প্রাচীন শহর', category: 'ভ্রমণ' },
      { text: 'ইউরোপের ক্যাফে ও আর্ট গ্যালারি', category: 'ভ্রমণ' },
    ],
  },
  {
    id: 'q2',
    question: 'কেমন উপহার পেলে আপনার মুখে সবচেয়ে খাঁটি হাসি ফুটে উঠবে?',
    category: 'পছন্দের উপহার',
    categoryIcon: '🎁',
    options: [
      { text: 'কাছের মানুষের আবেগমাখা হাতে লেখা চিঠি', category: 'উপহার' },
      { text: 'দৈনন্দিন জীবনে কাজে লাগে এমন টেক গ্যাজেট', category: 'উপহার' },
      { text: 'একসাথে কোনো সারপ্রাইজ ডে-আউট ট্রিপ', category: 'উপহার' },
      { text: 'বইমেলার গিফট ভাউচার ও সুবাসিত মোমবাতি', category: 'উপহার' },
    ],
  },
  {
    id: 'q3',
    question: 'বন্ধুদের সাথে সময় কাটানোর ক্ষেত্রে কোন ধরণের আড্ডা সবচেয়ে প্রিয়?',
    category: 'রুচি ও আড্ডা',
    categoryIcon: '☕',
    options: [
      { text: 'নিরিবিলি বারান্দা বা ছাদে রাত জেগে গভীর আড্ডা', category: 'আড্ডা' },
      { text: 'স্ট্রিট ফুড ও ক্যাফেতে নতুন খাবারের খোঁজে ঘোরা', category: 'আড্ডা' },
      { text: 'একসাথে কোনো সিনেমা নাইট বা সিরিজ দেখা', category: 'আড্ডা' },
      { text: 'বিপদে বা মন খারাপে নীরবে পাশে থাকা', category: 'আড্ডা' },
    ],
  },
];

export const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
  isOpen,
  onClose,
  onQuizCreated,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('dreams');
  const [isPrivate, setIsPrivate] = useState(true); // Private by default
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>(defaultQuestions);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q_${Date.now()}`,
      question: '',
      category: 'ব্যক্তিগত পছন্দ',
      categoryIcon: '✨',
      options: [
        { text: '', category: 'বিকল্প ১' },
        { text: '', category: 'বিকল্প ২' },
        { text: '', category: 'বিকল্প ৩' },
      ],
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      setErrorMessage('কুইজে কমপক্ষে একটি প্রশ্ন থাকা আবশ্যক।');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx: number, text: string) => {
    const updated = [...questions];
    updated[idx].question = text;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx: number, optIdx: number, val: string) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx].text = val;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMessage('কুইজের একটি সুন্দর শিরোনাম দিন।');
      return;
    }

    // Validate that questions have non-empty text and at least 2 options
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        setErrorMessage(`প্রশ্ন #${i + 1}-এর বিবরণ লিখুন।`);
        return;
      }
      const filledOptions = questions[i].options.filter((o) => o.text.trim());
      if (filledOptions.length < 2) {
        setErrorMessage(`প্রশ্ন #${i + 1}-এ কমপক্ষে ২টি উত্তরের বিকল্প লিখুন।`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const created = await api.createQuiz({
        title: trimmedTitle,
        description: description.trim(),
        theme,
        isPrivate,
        allowMultipleResponses: allowMultiple,
        questions: questions.map((q) => ({
          ...q,
          options: q.options.filter((o) => o.text.trim()),
        })),
      });

      onQuizCreated(created);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'কুইজ তৈরিতে সমস্যা হয়েছে।';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-quiz-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-[#0e1438] border border-pink-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#121945]/90 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <FileQuestion className="w-4 h-4 fill-white" />
            </div>
            <div className="min-w-0">
              <h2 id="create-quiz-title" className="font-bold text-sm sm:text-base font-bengali text-white truncate">
                নতুন ফ্রেন্ডশিপ কুইজ তৈরি করুন
              </h2>
              <p className="text-[11px] text-pink-200/70 font-bengali truncate">
                কাস্টম প্রশ্ন ও প্রাইভেট অ্যাক্সেস কন্ট্রোল
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">

          {/* Error Message */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-bengali flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Privacy Default Notice */}
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs font-bengali space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-300">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>ডিফল্ট প্রাইভেসি পলিসি (Private by Default):</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              আপনার কুইজটি স্বয়ংক্রিয়ভাবে ব্যক্তিগত রাখা হবে। শুধুমাত্র যাদের আপনি শেয়ারযোগ্য টোকেন লিংক পাঠাবেন, তারাই এতে অংশ নিতে পারবেন।
            </p>
          </div>

          {/* Quiz Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-bengali">
              কুইজের শিরোনাম <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: তানভীরের বন্ধুদের উইশ কুইজ 💖"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d26] border border-white/15 focus:border-pink-500 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 font-bengali"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-bengali">
              সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)
            </label>
            <input
              type="text"
              placeholder="বন্ধুদের জন্য একটি মিষ্টি বার্তা লিখুন..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d26] border border-white/15 focus:border-pink-500 focus:outline-none text-xs text-white placeholder-slate-500 font-bengali"
            />
          </div>

          {/* Privacy & Settings Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-bengali">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-black/40 text-pink-500 focus:ring-0"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-white block">প্রাইভেট কুইজ (Private by Default)</span>
                <span className="text-[11px] text-slate-400 block">অন্য কেউ পাবলিকলি সার্চ করে দেখতে পারবে না।</span>
              </div>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allowMultiple}
                onChange={(e) => setAllowMultiple(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-black/40 text-pink-500 focus:ring-0"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-white block">একাধিক উত্তর অনুমোদন</span>
                <span className="text-[11px] text-slate-400 block">একই বন্ধু চাইলে একাধিকবার উত্তর পাঠাতে পারবে।</span>
              </div>
            </label>
          </div>

          {/* Questions Builder */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-pink-300 font-bengali flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>কুইজের প্রশ্নসমূহ ({questions.length}টি)</span>
              </h3>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-2.5 py-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/30 text-pink-300 text-xs font-bold font-bengali flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>প্রশ্ন যোগ করুন</span>
              </button>
            </div>

            <div className="space-y-3">
              {questions.map((q, qIdx) => (
                <div
                  key={q.id || qIdx}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-sky-400 font-bengali">
                      প্রশ্ন #{qIdx + 1}
                    </span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        aria-label="প্রশ্ন মুছুন"
                        className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="প্রশ্নের বিষয় লিখুন..."
                    value={q.question}
                    onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#090d26] border border-white/15 focus:border-pink-500 focus:outline-none text-xs text-white placeholder-slate-500 font-bengali"
                  />

                  {/* Options */}
                  <div className="space-y-1.5 pl-2 border-l-2 border-pink-500/30">
                    <span className="text-[11px] text-slate-400 block font-bengali">উত্তরের বিকল্পসমূহ:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {q.options.map((opt, optIdx) => (
                        <input
                          key={optIdx}
                          type="text"
                          placeholder={`বিকল্প ${optIdx + 1}`}
                          value={opt.text}
                          onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                          className="px-2.5 py-1.5 rounded-md bg-black/30 border border-white/10 focus:border-pink-400 focus:outline-none text-[11px] text-white placeholder-slate-600 font-bengali"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-500 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[44px] font-bengali focus-visible:ring-2 focus-visible:ring-pink-400"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{isSubmitting ? 'কুইজ তৈরি হচ্ছে...' : 'কুইজ সংরক্ষণ করুন ও লিংক নিন'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
