/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Save,
  FileText,
  UserX,
} from 'lucide-react';
import { api } from '../services/apiClient';
import { UserPrivacySettings, User } from '../types/backend';

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAccountDeleted: () => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAccountDeleted,
}) => {
  const [settings, setSettings] = useState<UserPrivacySettings>({
    isProfileSearchable: false,
    defaultQuizPrivate: true,
    allowAiAnalysisConsent: true,
    allowAnonymousResponses: false,
    dataRetentionDays: 90,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Account deletion states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowDeleteConfirm(false);
      setConfirmInput('');
      setError(null);
      return;
    }

    if (currentUser?.privacySettings) {
      setSettings(currentUser.privacySettings);
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

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      if (currentUser) {
        const updated = await api.updatePrivacySettings(settings);
        setSettings(updated);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'সেটিংস সংরক্ষণে ব্যর্থ হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    setError(null);

    try {
      let data;
      if (currentUser) {
        data = await api.exportUserData();
      } else {
        data = {
          exportDate: new Date().toISOString(),
          note: 'গেস্ট সেশন ডেটা',
          clientStorage: 'Local Session',
        };
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wishreveal_data_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('ডেটা এক্সপোর্ট করতে সমস্যা হয়েছে।');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmInput.trim() !== 'DELETE' && confirmInput.trim() !== 'মুছে ফেলুন') {
      setError('নিশ্চিত করতে অনুগ্রহ করে "DELETE" বা "মুছে ফেলুন" লিখুন।');
      return;
    }

    setIsDeletingAccount(true);
    setError(null);

    try {
      if (currentUser) {
        await api.deleteAccount(confirmInput.trim());
      } else {
        api.clearSession();
      }
      onAccountDeleted();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'অ্যাকাউন্ট মোছা সম্ভব হয়নি।');
      setIsDeletingAccount(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl rounded-2xl sm:rounded-3xl bg-[#0e1438] border border-indigo-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#121945]/90 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 id="privacy-settings-title" className="font-bold text-sm sm:text-base font-bengali text-white truncate">
                গোপনীয়তা ও ডেটা নিয়ন্ত্রণ সেটিংস
              </h2>
              <p className="text-[11px] text-indigo-200/70 font-bengali truncate">
                ব্যবহারকারীর গোপনীয়তা নীতি ও অধিকার ব্যবস্থাপনা
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar font-bengali">

          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saveSuccess && (
            <div
              role="status"
              className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>গোপনীয়তা সেটিংস সফলভাবে আপডেট হয়েছে!</span>
            </div>
          )}

          {/* Privacy Toggles Form */}
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <h3 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>ডেটা সুরক্ষা ও দৃশ্যমানতা প্রেফারেন্স:</span>
            </h3>

            <div className="space-y-2.5">
              {/* Toggle 1: Default Quiz Private */}
              <label className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 cursor-pointer hover:border-indigo-500/40 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.defaultQuizPrivate}
                  onChange={(e) => setSettings({ ...settings, defaultQuizPrivate: e.target.checked })}
                  className="mt-0.5 rounded border-white/20 bg-black/40 text-indigo-500 focus:ring-0"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">
                    কুইজ স্বয়ংক্রিয়ভাবে ব্যক্তিগত রাখা (Private by Default)
                  </span>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    আপনার তৈরি করা কুইজ কোনো পাবলিক সার্চে আসবে না। শুধুমাত্র যাদের আপনি লিংক পাঠাবেন তারাই অংশ নিতে পারবেন।
                  </p>
                </div>
              </label>

              {/* Toggle 2: Profile Searchable */}
              <label className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 cursor-pointer hover:border-indigo-500/40 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.isProfileSearchable}
                  onChange={(e) => setSettings({ ...settings, isProfileSearchable: e.target.checked })}
                  className="mt-0.5 rounded border-white/20 bg-black/40 text-indigo-500 focus:ring-0"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">
                    ইমেইল দিয়ে প্রোফাইল অনুসন্ধান অনুমোদন (ডিফল্ট: বন্ধ)
                  </span>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    বন্ধুরা যাতে সরাসরি ইমেইল লিখে আপনাকে খুঁজে পেতে পারে। বন্ধ থাকলে আপনি সম্পূর্ণ অদৃশ্য থাকবেন।
                  </p>
                </div>
              </label>

              {/* Toggle 3: AI Analysis Consent */}
              <label className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 cursor-pointer hover:border-indigo-500/40 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.allowAiAnalysisConsent}
                  onChange={(e) => setSettings({ ...settings, allowAiAnalysisConsent: e.target.checked })}
                  className="mt-0.5 rounded border-white/20 bg-black/40 text-indigo-500 focus:ring-0"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">
                    স্বেচ্ছায় শেয়ারকৃত উত্তরে AI পরামর্শ ব্যবহারের সম্মতি
                  </span>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    AI শুধুমাত্র স্বেচ্ছায় দেওয়া উত্তরের থিম বিশ্লেষণ করে নিরাপদ উপহার ও আগ্রহের আইডিয়া তৈরি করবে।
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সংরক্ষণ করুন'}</span>
            </button>
          </form>

          {/* Data Export (GDPR Portability) */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <h3 className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-sky-400" />
              <span>ডেটা ডাউনলোড ও বহনযোগ্যতা (Data Portability):</span>
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              আপনার অ্যাকাউন্টে সংরক্ষিত সকল কুইজ, রেসপন্স ও ব্যক্তিগত ইচ্ছার একটি সম্পূর্ণ কপি JSON ফরম্যাটে ডাউনলোড করুন।
            </p>
            <button
              type="button"
              onClick={handleExportData}
              disabled={isExporting}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer border border-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'প্রস্তুত হচ্ছে...' : 'আমার সমস্ত ডেটা ডাউনলোড করুন (Export JSON)'}</span>
            </button>
          </div>

          {/* Account Deletion (GDPR Right to Erasure) */}
          <div className="pt-2 border-t border-white/10 space-y-3">
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>অ্যাকাউন্ট ডিলিট ও ডেটা নিশ্চিহ্নকরণ (Right to Erasure)</span>
              </div>
              <p className="text-[11px] text-rose-200/90 leading-relaxed">
                অ্যাকাউন্ট মুছে ফেললে আপনার তৈরি সকল কুইজ, বন্ধুদের দেওয়া উত্তর এবং গোপন ইচ্ছা বাক্স স্থায়ীভাবে চিরতরে ডিলিট হয়ে যাবে। এই পদক্ষেপটি অপরিবর্তনীয়।
              </p>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/50 text-rose-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                  <span>অ্যাকাউন্ট মুছে ফেলার অপশন</span>
                </button>
              ) : (
                <div className="p-3 rounded-lg bg-black/40 border border-rose-500/40 space-y-2.5 animate-in fade-in duration-150">
                  <label className="block text-[11px] text-slate-200 font-semibold">
                    স্থায়ীভাবে ডিলিট নিশ্চিত করতে নিচে <strong className="text-rose-400">DELETE</strong> অথবা <strong className="text-rose-400">মুছে ফেলুন</strong> টাইপ করুন:
                  </label>
                  <input
                    type="text"
                    placeholder="DELETE বা মুছে ফেলুন"
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#090d26] border border-rose-500/40 text-xs text-white focus:outline-none"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isDeletingAccount || (!confirmInput.includes('DELETE') && !confirmInput.includes('মুছে ফেলুন'))}
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>{isDeletingAccount ? 'মুছে ফেলা হচ্ছে...' : 'স্থায়ীভাবে ডিলিট নিশ্চিত করুন'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setConfirmInput('');
                      }}
                      className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-xs cursor-pointer"
                    >
                      বাতিল
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
