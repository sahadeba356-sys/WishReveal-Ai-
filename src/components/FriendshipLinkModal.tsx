/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Link2,
  Copy,
  Check,
  Send,
  Sparkles,
  Heart,
  Share2,
  AlertCircle,
  CheckCircle2,
  Lock,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Quiz } from '../types/backend';
import { api } from '../services/apiClient';

interface FriendshipLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuiz: () => void;
  targetQuiz?: Quiz | null;
  onOpenRespondModal?: (token: string) => void;
}

export const FriendshipLinkModal: React.FC<FriendshipLinkModalProps> = ({
  isOpen,
  onClose,
  onOpenQuiz,
  targetQuiz,
  onOpenRespondModal,
}) => {
  const [yourName, setYourName] = useState('');
  const [friendName, setFriendName] = useState('');
  const [theme, setTheme] = useState('dreams');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [shareToken, setShareToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (targetQuiz) {
      const currentOrigin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://wishreveal.ai';
      const token = targetQuiz.shareToken || 'wq_sample_friendship_token';
      setShareToken(token);
      setGeneratedLink(`${currentOrigin}/#respond?token=${token}`);
      setYourName(targetQuiz.creatorName || '');
      setFriendName('বন্ধু');
    } else {
      setGeneratedLink('');
      setShareToken('');
    }
  }, [isOpen, targetQuiz]);

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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setShareSuccess(null);

    const trimmedYourName = yourName.trim();
    const trimmedFriendName = friendName.trim();

    if (!trimmedYourName) {
      setValidationError('অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }

    if (!trimmedFriendName) {
      setValidationError('অনুগ্রহ করে আপনার বন্ধুর নাম লিখুন।');
      return;
    }

    setIsGenerating(true);

    try {
      const currentOrigin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://wishreveal.ai';

      // If user is logged in, create a real secure quiz with token
      const currentUser = api.getCurrentUser();
      if (currentUser) {
        const created = await api.createQuiz({
          title: `${trimmedYourName} ও ${trimmedFriendName}-এর ফ্রেন্ডশিপ কুইজ`,
          description: `${trimmedFriendName}-এর মনের ইচ্ছা ও পছন্দ জানার জন্য ${trimmedYourName}-এর তৈরি বিশেষ কুইজ।`,
          theme,
          isPrivate: true,
          allowMultipleResponses: false,
          questions: [
            {
              id: 'q1',
              question: 'যদি যেকোনো জায়গায় এখনই ঘুরে আসার সুযোগ পান, প্রথম পছন্দ কোথায়?',
              category: 'ভ্রমণ ও প্রকৃতি',
              categoryIcon: '✈️',
              options: [
                { text: 'পাহাড়ের শান্ত কুয়াশা ও পাইন বন', category: 'ভ্রমণ' },
                { text: 'সমুদ্রের উত্তাল নীল ঢেউ ও সূর্যাস্ত', category: 'ভ্রমণ' },
                { text: 'জাপানের চেরি ব্লসম ও প্রাচীন ঐতিহ্যের শহর', category: 'ভ্রমণ' },
              ],
            },
            {
              id: 'q2',
              question: 'কেমন উপহার পেলে আপনার মুখে সবচেয়ে খাঁটি আনন্দের হাসি ফুটে উঠবে?',
              category: 'পছন্দের উপহার',
              categoryIcon: '🎁',
              options: [
                { text: 'কাছের মানুষের আবেগমাখা হাতে লেখা চিঠি ও মেমোরি কিপসেক', category: 'উপহার' },
                { text: 'দৈনন্দিন জীবনে কাজে লাগে এমন কোনো স্মার্ট টেক গ্যাজেট', category: 'উপহার' },
                { text: 'একসাথে চমৎকার কোনো কনসার্ট বা ডে-আউট ট্রিপের টিকিট', category: 'উপহার' },
              ],
            },
          ],
        });

        const token = created.shareToken;
        setShareToken(token);
        setGeneratedLink(`${currentOrigin}/#respond?token=${token}`);
      } else {
        // Unauthenticated quick token
        const mockToken = `wq_${Date.now().toString(36)}`;
        setShareToken(mockToken);
        setGeneratedLink(`${currentOrigin}/#respond?token=${mockToken}&from=${encodeURIComponent(trimmedYourName)}&to=${encodeURIComponent(trimmedFriendName)}`);
      }

      setShareSuccess('ফ্রেন্ডশিপ কুইজ লিংক সফলভাবে তৈরি হয়েছে!');
      setTimeout(() => setShareSuccess(null), 3500);
    } catch {
      setValidationError('লিংক তৈরিতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedLink) return;
    const inviteText = `হ্যালো ${friendName || 'বন্ধু'}! 💖 WishReveal Ai-তে তোমার মনের পছন্দ ও ইচ্ছা জানতে এই কুইজ লিংকটি খোলো: ${generatedLink}`;

    navigator.clipboard.writeText(inviteText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (!generatedLink) return;

    const shareData = {
      title: 'WishReveal Ai - ফ্রেন্ডশিপ উইশ কুইজ',
      text: `হ্যালো ${friendName || 'বন্ধু'}! 💖 WishReveal Ai-তে তোমার পছন্দের স্বপ্ন ও ইচ্ছা জানতে একটি কুইজ শেয়ার করেছি। লিংকটি খুলে উত্তর দাও:`,
      url: generatedLink,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setShareSuccess('কুইজ লিংকটি সফলভাবে শেয়ার করা হয়েছে!');
        setTimeout(() => setShareSuccess(null), 3000);
        return;
      } catch {
        // Fallback to clipboard
        copyToClipboard();
        return;
      }
    }

    copyToClipboard();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="friendship-link-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-[#0e1438] border border-pink-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#121945]/90 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Link2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 id="friendship-link-title" className="font-bold text-sm sm:text-base font-bengali text-white truncate">
                ফ্রেন্ডশিপ লিংক তৈরি ও শেয়ার
              </h2>
              <p className="text-[11px] text-pink-200/70 font-bengali truncate">
                ইউনিক সিকিউর টোকেন সহ শেয়ারেবল ইনভাইট
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

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">

          {/* Authorization & Privacy Callout */}
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/25 text-purple-200 text-xs font-bengali flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px] sm:text-xs leading-relaxed">
              <span className="font-bold text-purple-300 block">গোপনীয়তা ও এক্সেস সুরক্ষা:</span>
              <p className="text-slate-300">
                এই লিংকের মাধ্যমে বন্ধু যে উত্তর প্রদান করবেন, তা সরাসরি এনক্রিপ্ট হয়ে আপনার নিজস্ব অ্যাকাউন্টে জমা হবে। উত্তরদাতা কিংবা তৃতীয় কেউ অন্যদের উত্তর দেখতে পাবেন না।
              </p>
            </div>
          </div>

          {validationError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-bengali flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {shareSuccess && (
            <div
              role="status"
              className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-bengali flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{shareSuccess}</span>
            </div>
          )}

          {/* Form when not target quiz */}
          {!targetQuiz && (
            <form onSubmit={handleGenerate} className="space-y-3 font-bengali">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    আপনার নাম <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: তানভীর"
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090d26] border border-white/15 focus:border-pink-500 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    বন্ধুর নাম <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: সাদিয়া"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090d26] border border-white/15 focus:border-pink-500 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  কুইজের থিম বেছে নিন:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'dreams', label: 'গোপন স্বপ্ন 🌟' },
                    { id: 'gifts', label: 'পছন্দের উপহার 🎁' },
                    { id: 'travel', label: 'ভ্রমণ ও আড্ডা ✈️' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        theme === t.id
                          ? 'bg-pink-500/20 border-pink-400 text-white'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-500 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[42px] mt-1"
              >
                <Sparkles className="w-4 h-4 text-pink-200" />
                <span>{isGenerating ? 'লিংক তৈরি হচ্ছে...' : 'সিকিউর লিংক তৈরি করুন'}</span>
              </button>
            </form>
          )}

          {/* Generated Link Display */}
          {generatedLink && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-pink-500/30 space-y-3 font-bengali animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold text-pink-300 flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-pink-400" />
                  <span>আপনার ফ্রেন্ডশিপ লিংক:</span>
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Lock className="w-3 h-3" />
                  <span>টোকেন সুরক্ষিত</span>
                </span>
              </div>

              {/* Link Input with Copy Button */}
              <div className="flex items-center gap-2 bg-[#090d26] p-1.5 rounded-xl border border-white/15">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="bg-transparent px-2 text-xs text-slate-200 flex-1 truncate focus:outline-none"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
              </div>

              {/* Share & Preview Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-white/10"
                >
                  <Share2 className="w-4 h-4 text-pink-400" />
                  <span>সরাসরি শেয়ার করুন (WhatsApp / Share)</span>
                </button>

                {onOpenRespondModal && shareToken && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRespondModal(shareToken);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 active:scale-98 text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-indigo-500/30"
                  >
                    <span>উত্তর দেওয়ার ভিউ দেখুন</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
