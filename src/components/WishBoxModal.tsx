/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Gift,
  Lock,
  Unlock,
  Sparkles,
  Trash2,
  Heart,
  Plus,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  User,
} from 'lucide-react';
import { api } from '../services/apiClient';
import { Wish } from '../types/backend';

interface WishBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

export const WishBoxModal: React.FC<WishBoxModalProps> = ({ isOpen, onClose, onOpenLogin }) => {
  const [wishText, setWishText] = useState('');
  const [category, setCategory] = useState('স্বপ্ন');
  const [isLocked, setIsLocked] = useState(true);
  const [isPrivate, setIsPrivate] = useState(true); // Private by default
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentUser = api.getCurrentUser();

  const loadWishes = () => {
    if (currentUser) {
      setLoading(true);
      api.getWishes()
        .then((data) => {
          setWishes(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      // Local session wishes
      const fallback: Wish[] = [
        {
          id: 'local_1',
          userId: 'local',
          text: 'একদিন সব প্রিয় বন্ধুদের নিয়ে বান্দরবানের পাহাড়ে ভোরবেলা গরম চায়ের কাপ হাতে সূর্যোদয় দেখা!',
          category: 'ভ্রমণ',
          isLocked: true,
          isPrivate: true,
          createdAt: new Date().toISOString(),
        },
      ];
      setWishes(fallback);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadWishes();
    }
  }, [isOpen, currentUser]);

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

  const handleSaveWish = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmed = wishText.trim();
    if (!trimmed) {
      setErrorMessage('অনুগ্রহ করে আপনার ইচ্ছা বা স্বপ্নের বিবরণ লিখুন।');
      return;
    }

    if (trimmed.length < 5) {
      setErrorMessage('ইচ্ছাটি স্পষ্টভাবে লিখতে কমপক্ষে ৫টি অক্ষর ব্যবহার করুন।');
      return;
    }

    setIsSaving(true);

    try {
      if (currentUser) {
        const saved = await api.createWish({
          text: trimmed,
          category,
          isLocked,
          isPrivate,
        });
        setWishes([saved, ...wishes]);
        setSuccessMessage('আপনার ইচ্ছাটি ব্যক্তিগত ক্লাউড সেশনে সফলভাবে সংরক্ষিত হয়েছে!');
      } else {
        const localWish: Wish = {
          id: `local_${Date.now()}`,
          userId: 'local',
          text: trimmed,
          category,
          isLocked,
          isPrivate,
          createdAt: new Date().toISOString(),
        };
        setWishes([localWish, ...wishes]);
        setSuccessMessage('ইচ্ছাটি বর্তমান ব্রাউজার সেশনে সেভ হয়েছে (অ্যাকাউন্ট যুক্ত করলে ক্লাউডে সংরক্ষিত থাকবে)।');
      }

      setWishText('');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'ইচ্ছা সংরক্ষণে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteWish = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই ইচ্ছাটি স্থায়ীভাবে মুছে ফেলতে চান?')) return;

    setDeletingId(id);
    try {
      if (currentUser) {
        await api.deleteWish(id);
      }
      setWishes(wishes.filter((w) => w.id !== id));
      setSuccessMessage('ইচ্ছাটি স্থায়ীভাবে মুছে ফেলা হয়েছে।');
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'ইচ্ছা মোছা সম্ভব হয়নি।');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishbox-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-[#0e1438] border border-purple-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#121945]/90 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 id="wishbox-title" className="font-bold text-sm sm:text-base font-bengali text-white truncate">
                Surprise Wish Box (গোপন ইচ্ছা বাক্স)
              </h2>
              <p className="text-[11px] text-purple-200/70 font-bengali truncate">
                ব্যক্তিগত ইচ্ছা সংরক্ষণ ও ডিলিট ব্যবস্থাপনা
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">

          {/* Privacy & Authorization Notice */}
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/25 text-purple-200 text-xs font-bengali flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px] sm:text-xs leading-relaxed">
              <span className="font-bold text-purple-300 block">প্রাইভেট বাই ডিফল্ট (Private by Default):</span>
              <p className="text-slate-300">
                আপনার লিখিত প্রতিটি ইচ্ছা সম্পূর্ণ ব্যক্তিগত এবং লক করা থাকে। শুধুমাত্র আপনি নিজে পাসকোড/ক্লিক দিয়ে আনলক করতে পারবেন।
              </p>
            </div>
          </div>

          {!currentUser && onOpenLogin && (
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-bengali flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">ইচ্ছাগুলো ক্লাউডে স্থায়ীভাবে সেভ করতে চান?</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="text-pink-400 hover:underline font-bold text-[11px] cursor-pointer"
              >
                লগইন করুন
              </button>
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-bengali flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-bengali flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSaveWish} className="space-y-3 font-bengali">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                আপনার গোপন ইচ্ছা বা পছন্দের বিষয় লিখুন:
              </label>
              <textarea
                rows={3}
                required
                placeholder="যেমন: কোনো এক মেঘলা দিনে প্রিয় বন্ধুর সাথে পাহাড়ি ট্রেইল হাইকিংয়ে যাওয়া..."
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d26] border border-white/15 focus:border-purple-500 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">ক্যাটাগরি:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#090d26] border border-white/15 text-white focus:outline-none focus:border-purple-400 cursor-pointer text-xs"
                >
                  <option value="স্বপ্ন">স্বপ্ন 🌟</option>
                  <option value="ভ্রমণ">ভ্রমণ ✈️</option>
                  <option value="উপহার">উপহার 🎁</option>
                  <option value="স্মৃতি">স্মৃতি 💖</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">লক স্ট্যাটাস:</label>
                <button
                  type="button"
                  onClick={() => setIsLocked(!isLocked)}
                  className={`w-full py-1.5 px-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    isLocked
                      ? 'bg-purple-500/20 border-purple-400/40 text-purple-300'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{isLocked ? 'লক করা থাকবে' : 'আনলক'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[42px] mt-1"
            >
              <Plus className="w-4 h-4" />
              <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'ইচ্ছা বাক্সে যুক্ত করুন'}</span>
            </button>
          </form>

          {/* Saved Wishes List */}
          <div className="space-y-2.5 pt-2 font-bengali">
            <h3 className="text-xs font-bold text-purple-300 flex items-center justify-between">
              <span>সংরক্ষিত ইচ্ছাসমূহ ({wishes.length}টি):</span>
              <span className="text-[10px] text-slate-400 font-normal">শুধুমাত্র আপনার জন্য দৃশ্যমান</span>
            </h3>

            {loading ? (
              <div className="py-6 text-center text-xs text-slate-400">ইচ্ছাগুলো লোড হচ্ছে...</div>
            ) : wishes.length === 0 ? (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-slate-400">
                এখনও কোনো ইচ্ছা সংরক্ষণ করা হয়নি।
              </div>
            ) : (
              <div className="space-y-2">
                {wishes.map((w) => {
                  const isRevealed = revealedIds[w.id] || !w.isLocked;
                  return (
                    <div
                      key={w.id}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-purple-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-bold">
                          {w.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {w.isLocked && (
                            <button
                              type="button"
                              onClick={() => toggleReveal(w.id)}
                              className="text-[11px] text-purple-300 hover:text-white flex items-center gap-1 p-1 cursor-pointer"
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              <span>{isRevealed ? 'লুকান' : 'দেখুন'}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={deletingId === w.id}
                            onClick={() => confirmDeleteWish(w.id)}
                            aria-label="ইচ্ছা মুছুন"
                            className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-slate-200 leading-relaxed">
                        {isRevealed ? (
                          <p className="animate-in fade-in duration-150">{w.text}</p>
                        ) : (
                          <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 flex items-center gap-2 text-slate-400 text-xs">
                            <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span>ইচ্ছাটি লক করা আছে। দেখতে উপরের 'দেখুন' বাটনে চাপ দিন।</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
