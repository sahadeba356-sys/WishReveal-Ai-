import React, { useState, useEffect } from 'react';
import { X, Lock, Sparkles, Plus, Trash2, Heart, Shield, CheckCircle2 } from 'lucide-react';
import { api } from '../services/apiClient';
import { Wish, User } from '../types/backend';

interface WishBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onOpenLogin: () => void;
}

export const WishBoxModal: React.FC<WishBoxModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenLogin,
}) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWishText, setNewWishText] = useState('');
  const [newWishCategory, setNewWishCategory] = useState('স্বপ্ন');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadWishes = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const data = await api.getWishes();
      setWishes(data);
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      loadWishes();
    }
  }, [isOpen, currentUser]);

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

  const handleAddWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishText.trim() || newWishText.trim().length < 5) return;

    setIsSaving(true);
    try {
      const created = await api.createWish({
        text: newWishText.trim(),
        category: newWishCategory,
        isLocked: true,
        isPrivate: true,
      });
      setWishes((prev) => [created, ...prev]);
      setNewWishText('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch {
      // Error
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteWish = async (id: string) => {
    try {
      await api.deleteWish(id);
      setWishes((prev) => prev.filter((w) => w.id !== id));
    } catch {
      // Error
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wish-box-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-bengali"
    >
      <div className="relative w-full max-w-xl rounded-2xl sm:rounded-3xl bg-[#0c1233] border border-purple-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#111742]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 id="wish-box-modal-title" className="font-bold text-sm sm:text-base text-white">
                সিক্রেট উইশ বক্স (Private by Default)
              </h2>
              <p className="text-[11px] text-purple-300/80">
                আপনার গোপন লালিত স্বপ্ন ও ইচ্ছাগুলো একান্তই আপনার নিজের
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
          
          {/* Privacy Box */}
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              এই বক্সের কোনো ইচ্ছা কখনো পাবলিক ফিডে বা অন্য কারো প্রোফাইলে দেখা যাবে না।
            </span>
          </div>

          {!currentUser ? (
            /* Login Required */
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-purple-300">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-white">লগইন প্রয়োজন</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  আপনার ব্যক্তিগত ইচ্ছাগুলো সুরক্ষিত রাখতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন বা সাইন আপ করুন।
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
                লগইন / অ্যাকাউন্ট তৈরি করুন
              </button>
            </div>
          ) : (
            <>
              {/* Form to add new wish */}
              <form onSubmit={handleAddWish} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="wish-input" className="text-xs font-semibold text-slate-200">
                    নতুন একটি ইচ্ছা গোপন বক্সে যোগ করুন:
                  </label>
                  <select
                    value={newWishCategory}
                    onChange={(e) => setNewWishCategory(e.target.value)}
                    className="px-2 py-1 rounded bg-[#080d26] border border-white/15 text-[11px] text-purple-300 focus:outline-none"
                  >
                    <option value="স্বপ্ন">🌟 স্বপ্ন</option>
                    <option value="ভ্রমণ">✈️ ভ্রমণ</option>
                    <option value="উপহার">🎁 পছন্দের উপহার</option>
                    <option value="শখ">🎨 শখ ও অবসর</option>
                    <option value="অন্যান্য">✨ অন্যান্য</option>
                  </select>
                </div>

                <textarea
                  id="wish-input"
                  rows={2}
                  required
                  placeholder="যেমন: বন্ধুদের সাথে সাজেক ট্রিপে যাওয়া বা প্রিয় বইয়ের কালেকশন সম্পন্ন করা..."
                  value={newWishText}
                  onChange={(e) => setNewWishText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080d26] border border-white/15 focus:border-purple-400 focus:outline-none text-xs text-white placeholder-slate-500 resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  {saveSuccess ? (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ইচ্ছা সংরক্ষিত হয়েছে!</span>
                    </span>
                  ) : <span />}

                  <button
                    type="submit"
                    disabled={isSaving || newWishText.trim().length < 5}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'লক করে রাখুন'}</span>
                  </button>
                </div>
              </form>

              {/* Wishes List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    আপনার সংরক্ষিত গোপন ইচ্ছাসমূহ ({wishes.length}):
                  </span>
                </div>

                {isLoading ? (
                  <p className="text-xs text-slate-400 text-center py-4">লোড হচ্ছে...</p>
                ) : wishes.length === 0 ? (
                  <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-400 space-y-1">
                    <p>এখনো কোনো গোপন ইচ্ছা সংরক্ষণ করা হয়নি।</p>
                    <p className="text-[11px] text-slate-500">উপরের বক্সে লিখে নিরাপদে লক করে রাখুন!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {wishes.map((w) => (
                      <div
                        key={w.id}
                        className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start justify-between gap-3 group hover:border-purple-500/30 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {w.category}
                          </span>
                          <p className="text-xs text-white leading-relaxed pt-0.5 break-words">
                            {w.text}
                          </p>
                          <span className="text-[10px] text-slate-500 block">
                            লক করা হয়েছে: {new Date(w.createdAt).toLocaleDateString('bn-BD')}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteWish(w.id)}
                          aria-label="ইচ্ছা মুছুন"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
