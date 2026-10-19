import React, { useState, useEffect } from 'react';
import { X, Shield, Download, Trash2, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { api } from '../services/apiClient';
import { User, UserPrivacySettings } from '../types/backend';
import { useLanguage } from '../i18n/LanguageContext';

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onOpenLogin: () => void;
  onAccountDeleted: () => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenLogin,
  onAccountDeleted,
}) => {
  const { language, t } = useLanguage();
  const [settings, setSettings] = useState<UserPrivacySettings>({
    isProfileSearchable: false,
    defaultQuizPrivate: true,
    allowAiAnalysisConsent: true,
    allowAnonymousResponses: false,
    dataRetentionDays: 90,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.privacySettings) {
      setSettings(currentUser.privacySettings);
    }
  }, [currentUser, isOpen]);

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

  const handleToggle = (key: keyof UserPrivacySettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      await api.updatePrivacySettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      // Ignored
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    if (!currentUser) return;
    setIsExporting(true);
    try {
      const data = await api.exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wishreveal_data_${currentUser.name}_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Ignored
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    const confirmKeyword = language === 'bn' ? 'মুছে ফেলুন' : 'DELETE';
    if (deleteInput.trim() !== confirmKeyword && deleteInput.trim() !== 'DELETE' && deleteInput.trim() !== 'মুছে ফেলুন') {
      setDeleteError(
        language === 'bn'
          ? 'সঠিক নিশ্চিতকরণ টেক্সট লিখুন ("মুছে ফেলুন" বা "DELETE")।'
          : 'Please type the exact confirmation word ("DELETE").'
      );
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await api.deleteAccount(deleteInput);
      onAccountDeleted();
      onClose();
    } catch (err: unknown) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : (language === 'bn' ? 'অ্যাকাউন্ট মোছা যায়নি।' : 'Failed to delete account.')
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-bengali"
    >
      <div className="relative w-full max-w-xl rounded-2xl sm:rounded-3xl bg-[#0c1233] border border-pink-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#10173e]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 id="privacy-modal-title" className="font-bold text-sm sm:text-base text-white">
                {language === 'bn' ? 'গোপনীয়তা ও ডেটা সুরক্ষা সেটিংস' : 'Privacy & Data Protection Settings'}
              </h2>
              <p className="text-[11px] text-pink-300/80">
                {language === 'bn'
                  ? 'আপনার ডেটার সম্পূর্ণ নিয়ন্ত্রণ আপনার হাতে'
                  : 'You maintain complete control over your personal data'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t.close}
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
                <h3 className="font-bold text-sm text-white">{language === 'bn' ? 'লগইন প্রয়োজন' : 'Login Required'}</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {language === 'bn'
                    ? 'ব্যক্তিগত গোপনীয়তা সেটিংস পরিবর্তন করতে অ্যাকাউন্টে লগইন করুন।'
                    : 'Log in to customize your personal data and privacy settings.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs shadow-md cursor-pointer hover:brightness-110"
              >
                {t.navLogin}
              </button>
            </div>
          ) : (
            <>
              {/* Privacy Toggles */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-white block">
                      {language === 'bn' ? 'ডিফল্ট প্রাইভেট কুইজ' : 'Default Private Quizzes'}
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {language === 'bn'
                        ? 'আপনার তৈরি করা সমস্ত কুইজ শুধুমাত্র লিংকধারী বন্ধুদের জন্যই উন্মুক্ত থাকবে।'
                        : 'Your created quizzes are strictly accessible to people with the invite link.'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.defaultQuizPrivate}
                    onChange={() => handleToggle('defaultQuizPrivate')}
                    className="w-4 h-4 rounded text-pink-500 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-white block">
                      {language === 'bn' ? 'AI বিশ্লেষণ ব্যবহারের সম্মতি' : 'AI Processing Consent'}
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {language === 'bn'
                        ? 'উত্তরের শব্দার্থিক প্যাটার্ন থেকে OpenAI ChatGPT দ্বারা উপহার আইডিয়া তৈরিতে সম্মতি।'
                        : 'Consent to synthesize thoughtful gift recommendations using OpenAI ChatGPT.'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowAiAnalysisConsent}
                    onChange={() => handleToggle('allowAiAnalysisConsent')}
                    className="w-4 h-4 rounded text-pink-500 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-white block">
                      {language === 'bn' ? 'অজ্ঞাতনামা রেসপন্স গ্রহণ' : 'Allow Anonymous Responses'}
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {language === 'bn'
                        ? 'বন্ধুরা নাম গোপন রেখে রেসপন্স পাঠাতে পারবে কিনা তা নির্ধারণ করুন।'
                        : 'Allow friends to answer your custom quizzes with nicknames or anonymously.'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowAnonymousResponses}
                    onChange={() => handleToggle('allowAnonymousResponses')}
                    className="w-4 h-4 rounded text-pink-500 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  {saveSuccess ? (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{language === 'bn' ? 'সেটিংস সংরক্ষিত হয়েছে!' : 'Settings Saved!'}</span>
                    </span>
                  ) : <span />}

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    {isSaving
                      ? (language === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...')
                      : (language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes')}
                  </button>
                </div>
              </div>

              {/* Data Export & GDPR */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="text-xs font-bold text-slate-200 block">
                  {language === 'bn' ? 'ডেটা পোর্টেবিলিটি ও এক্সপোর্ট (GDPR):' : 'Data Portability & Export (GDPR):'}
                </span>
                <p className="text-[11px] text-slate-400">
                  {language === 'bn'
                    ? 'আপনার অ্যাকাউন্টের সমস্ত তথ্য, কুইজ ও ইচ্ছা একটি JSON ফাইলে ডাউনলোড করে নিন।'
                    : 'Download a complete JSON export of your account profile, created quizzes, and wish list.'}
                </p>

                <button
                  type="button"
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isExporting
                      ? (language === 'bn' ? 'ডাউনলোড হচ্ছে...' : 'Exporting...')
                      : (language === 'bn' ? 'আমার সমস্ত ডেটা ডাউনলোড করুন (JSON)' : 'Download All My Data (JSON)')}
                  </span>
                </button>
              </div>

              {/* Account Deletion */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {language === 'bn'
                      ? 'অ্যাকাউন্ট ও সমস্ত ডেটা স্থায়ীভাবে মুছে ফেলুন (GDPR Right to Erasure)'
                      : 'Permanently Delete Account & Data (GDPR Right to Erasure)'}
                  </span>
                </span>

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{language === 'bn' ? 'অ্যাকাউন্ট ডিলিট করুন' : 'Delete My Account'}</span>
                  </button>
                ) : (
                  <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 space-y-2.5 text-xs text-rose-200">
                    <p className="leading-relaxed">
                      {language === 'bn' ? (
                        <>
                          সতর্কতা: এটি নিশ্চিত করলে আপনার অ্যাকাউন্ট, কুইজ, ইচ্ছা ও সমস্ত রেসপন্স স্থায়ীভাবে মুছে যাবে। নিশ্চিত করতে নিচে <strong className="text-white">মুছে ফেলুন</strong> বা <strong className="text-white">DELETE</strong> লিখুন:
                        </>
                      ) : (
                        <>
                          Warning: This action is permanent and erases your profile, custom quizzes, and secret wish box. Type <strong className="text-white">DELETE</strong> to confirm:
                        </>
                      )}
                    </p>
                    <input
                      type="text"
                      placeholder={language === 'bn' ? 'মুছে ফেলুন বা DELETE' : 'DELETE'}
                      value={deleteInput}
                      onChange={(e) => setDeleteInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-rose-400/50 text-white text-xs"
                    />

                    {deleteError && (
                      <p className="text-[11px] text-rose-300 font-semibold">{deleteError}</p>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting || !deleteInput.trim()}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs cursor-pointer"
                      >
                        {isDeleting
                          ? (language === 'bn' ? 'মোছা হচ্ছে...' : 'Deleting...')
                          : (language === 'bn' ? 'স্থায়ীভাবে মুছুন' : 'Permanently Delete')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteInput('');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs cursor-pointer"
                      >
                        {language === 'bn' ? 'বাতিল' : 'Cancel'}
                      </button>
                    </div>
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
