import React, { useState, useEffect } from 'react';
import { X, Share2, Copy, Check } from 'lucide-react';
import { Quiz } from '../types/backend';
import { useLanguage } from '../i18n/LanguageContext';

interface FriendshipLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetQuiz: Quiz | null;
}

export const FriendshipLinkModal: React.FC<FriendshipLinkModalProps> = ({
  isOpen,
  onClose,
  targetQuiz,
}) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

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

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareToken = targetQuiz?.shareToken || 'sample_token';
  const shareUrl = `${currentOrigin}/#respond?token=${shareToken}`;
  const quizTitle = targetQuiz?.title || (language === 'bn' ? 'ফ্রেন্ডশিপ উইশ কুইজ' : 'Friendship Wish Quiz');

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(
    language === 'bn'
      ? `✨ আমার ফ্রেন্ডশিপ উইশ কুইজ খেলে জানাও তোমার মনের ইচ্ছা: ${shareUrl}`
      : `✨ Play my Friendship Wish Quiz and share what you love: ${shareUrl}`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-link-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-bengali"
    >
      <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl bg-[#0c1233] border border-pink-500/30 text-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#10173e]/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Share2 className="w-4 h-4" />
            </div>
            <h2 id="share-link-modal-title" className="font-bold text-sm sm:text-base text-white">
              {language === 'bn' ? 'বন্ধুকে আমন্ত্রণ লিংক পাঠান' : 'Send Invitation Link to Friend'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t.close}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
            <span className="text-[10px] text-pink-400 font-semibold block">
              {language === 'bn' ? 'নির্বাচিত কুইজ:' : 'Selected Quiz:'}
            </span>
            <span className="font-bold text-sm text-white block">{quizTitle}</span>
            <p className="text-[11px] text-slate-300">
              {language === 'bn'
                ? 'এই লিংকটি বন্ধুর সাথে শেয়ার করলে সে তার পছন্দ ও ইচ্ছার উত্তর দিতে পারবে।'
                : 'Share this unique link with your friend so they can submit their preferences.'}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              {language === 'bn' ? 'কপি করার জন্য লিংক:' : 'Shareable Link:'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 rounded-xl bg-[#080d26] border border-white/15 text-xs text-pink-300 select-all font-mono"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'কপি' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-300 block">
              {language === 'bn' ? 'সরাসরি শেয়ার করুন:' : 'Share directly via:'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(quizTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 text-sky-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Telegram</span>
              </a>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center pt-2 border-t border-white/10">
            {language === 'bn'
              ? '🔒 বন্ধু যখনই উত্তর দেবে, আপনি আপনার ড্যাশবোর্ডে তা দেখতে পাবেন।'
              : '🔒 When your friend submits answers, they will immediately appear on your Dashboard.'}
          </p>
        </div>
      </div>
    </div>
  );
};
