import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, ChevronRight, X, Server, Lock, Bot, Key } from 'lucide-react';
import { api } from '../services/apiClient';
import { BackendStatus } from '../types/backend';
import { useLanguage } from '../i18n/LanguageContext';

interface BackendStatusBannerProps {
  onOpenPrivacy: () => void;
  onOpenOpenAiConfig: () => void;
}

export const BackendStatusBanner: React.FC<BackendStatusBannerProps> = ({
  onOpenPrivacy,
  onOpenOpenAiConfig,
}) => {
  const [status, setStatus] = useState<BackendStatus | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    api.getBackendStatus()
      .then(setStatus)
      .catch(() => {});
  }, []);

  if (isDismissed || !status) return null;

  return (
    <div className="bg-[#0b102b] border-b border-indigo-500/20 py-1.5 px-3 sm:px-4 text-[11px] sm:text-xs text-indigo-200 z-40 relative font-bengali">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 font-bold shrink-0">
            <Server className="w-3 h-3 text-indigo-400" />
            <span>{t.backendReady}</span>
          </span>

          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-bold shrink-0">
            <Bot className="w-3 h-3 text-emerald-400" />
            <span>
              {status.hasOpenAiKey
                ? `OpenAI (${status.openAiModel || 'gpt-4o-mini'})`
                : language === 'bn' ? 'OpenAI রেডি (ডেমো মোড)' : 'OpenAI Ready (Demo Mode)'}
            </span>
          </span>

          <p className="truncate text-slate-300 hidden md:inline">
            {language === 'bn'
              ? 'পাসওয়ার্ড হ্যাসড ও RBAC সিকিউরড | সার্ভার-সাইড OpenAI প্রক্সি সক্রিয়'
              : 'Password Hashed & RBAC Secured | Server-Side OpenAI Proxy Active'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenOpenAiConfig}
            className="text-emerald-300 hover:text-emerald-100 underline cursor-pointer flex items-center gap-0.5"
          >
            <Key className="w-3 h-3" />
            <span>{t.backendApiKeySetup}</span>
          </button>
          <span className="text-white/20">|</span>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-indigo-400 hover:text-indigo-200 underline cursor-pointer"
          >
            {showDetails
              ? (language === 'bn' ? 'লুকান' : 'Hide')
              : (language === 'bn' ? 'নিরাপত্তা বিবরণ' : 'Security Details')}
          </button>
          <span className="text-white/20">|</span>
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="text-pink-400 hover:text-pink-300 underline cursor-pointer flex items-center gap-0.5"
          >
            <span>{language === 'bn' ? 'গোপনীয়তা' : 'Privacy'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label={language === 'bn' ? 'ব্যানার বন্ধ করুন' : 'Dismiss banner'}
            className="p-1 rounded-md text-slate-400 hover:text-white cursor-pointer ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="max-w-7xl mx-auto mt-2 p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 space-y-1.5 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-indigo-300 font-bold">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'bn' ? 'নিরাপত্তা ও ডেটাবেস অবস্থা:' : 'Security & Database Architecture:'}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {status.message}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="p-2 rounded bg-white/5 border border-white/5">
              <span className="text-slate-400 block">{language === 'bn' ? 'পাসওয়ার্ড স্টোরেজ:' : 'Password Storage:'}</span>
              <span className="text-emerald-400 font-semibold">Node Crypto Scrypt + Salt</span>
            </div>
            <div className="p-2 rounded bg-white/5 border border-white/5">
              <span className="text-slate-400 block">{language === 'bn' ? 'কুইজ ও ইচ্ছা এক্সেস:' : 'Quiz & Wish Access:'}</span>
              <span className="text-indigo-300 font-semibold">{language === 'bn' ? 'Private By Default (RBAC অথরাইজেশন)' : 'Private By Default (RBAC Authorization)'}</span>
            </div>
            <div className="p-2 rounded bg-white/5 border border-white/5">
              <span className="text-slate-400 block">{language === 'bn' ? 'OpenAI Key নিরাপত্তা:' : 'OpenAI Key Security:'}</span>
              <span className="text-emerald-300 font-semibold">{language === 'bn' ? 'সার্ভার-সাইড প্রক্সি (ব্রাউজারে গোপন)' : 'Server-side Proxy (Hidden from browser)'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

