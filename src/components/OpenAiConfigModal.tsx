import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Server, Terminal, Copy, Check, ExternalLink, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/apiClient';
import { OpenAiStatusResponse } from '../types/backend';

interface OpenAiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenAiConfigModal: React.FC<OpenAiConfigModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<OpenAiStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const data = await api.getOpenAiStatus();
      setStatus(data);
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

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

  const sampleEnvText = `OPENAI_API_KEY="sk-proj-your-openai-api-key-here"\nOPENAI_MODEL="gpt-4o-mini"`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(sampleEnvText);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="openai-config-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-bengali"
    >
      <div className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-[#0c1233] border border-emerald-500/30 text-white shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#101a44]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 id="openai-config-modal-title" className="font-bold text-sm sm:text-base text-white">
                OpenAI ChatGPT কনফিগারেশন ও ডেপ্লয়মেন্ট নির্দেশিকা
              </h2>
              <p className="text-[11px] text-emerald-300/80">
                নিরাপদ সার্ভার-সাইড ইন্টিগ্রেশন ও ডেপ্লয়মেন্ট গাইড
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar text-xs leading-relaxed text-slate-300">
          
          {/* Current Live Backend Status */}
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>বর্তমান ব্যাকএন্ড অবস্থা:</span>
              </span>
              <button
                type="button"
                onClick={fetchStatus}
                disabled={isLoading}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>রিফ্রেশ</span>
              </button>
            </div>

            {status ? (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${status.isConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className="font-semibold text-white">
                    {status.isConfigured ? 'সক্রিয় (Active OpenAI Connected)' : 'ডেমো মোড (Unconfigured Demo)'}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    মডেল: {status.model}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{status.message}</p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">স্ট্যাটাস লোড হচ্ছে...</p>
            )}
          </div>

          {/* Security Guarantee Box */}
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>নিরাপত্তা প্রতিশ্রুতি (Zero Client-Side Exposure):</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              আপনার <code className="bg-black/30 px-1 py-0.5 rounded text-emerald-300">OPENAI_API_KEY</code> কখনোই ফ্রন্টএন্ড জাভাস্ক্রিপ্ট, ব্রাউজার রিকোয়েস্ট বা HTML ফাইলে উন্মুক্ত করা হয় না। সমস্ত রিকোয়েস্ট <code className="bg-black/30 px-1 py-0.5 rounded text-sky-300">/api/openai/*</code> এবং <code className="bg-black/30 px-1 py-0.5 rounded text-sky-300">/api/analyze-friend-wishes</code> প্রক্সি এন্ডপয়েন্টের মাধ্যমে সার্ভারে পরিচালিত হয়।
            </p>
          </div>

          {/* Step 1: Getting Key */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">১</span>
              <span>OpenAI API Key সংগ্রহ করুন</span>
            </h3>
            <p className="pl-7 text-slate-300">
              আপনার OpenAI একাউন্টে লগইন করে <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline inline-flex items-center gap-1 hover:text-emerald-300">platform.openai.com/api-keys <ExternalLink className="w-3 h-3" /></a> থেকে একটি নতুন সিক্রেট কী তৈরি করুন।
            </p>
          </div>

          {/* Step 2: Environment Variables */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">২</span>
              <span>এনভায়রনমেন্ট ভেরিয়েবল কনফিগার করুন</span>
            </h3>
            <p className="pl-7 text-slate-300">
              প্রজেক্টের রুট ডিরেক্টরিতে <code className="bg-black/30 px-1.5 py-0.5 rounded text-emerald-300">.env</code> ফাইল তৈরি করুন বা ক্লাউড প্ল্যাটফর্মের Environment Variables সেকশনে নিচের ভেরিয়েবলগুলো যুক্ত করুন:
            </p>
            <div className="ml-7 p-3 rounded-xl bg-black/50 border border-white/10 relative font-mono text-[11px] text-emerald-300 space-y-1">
              <button
                type="button"
                onClick={handleCopyEnv}
                className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
              >
                {copiedEnv ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedEnv ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
              <pre className="text-slate-300 font-mono text-[11px] overflow-x-auto whitespace-pre">
                {sampleEnvText}
              </pre>
            </div>
          </div>

          {/* Step 3: Production Deployment */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">৩</span>
              <span>প্রোডাকশন ডেপ্লয়মেন্ট গাইডলাইন</span>
            </h3>
            <div className="ml-7 space-y-2 text-slate-300">
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
                <span className="font-semibold text-white block">Node.js / Cloud Run / VPS:</span>
                <p className="text-[11px]">
                  ১. <code className="bg-black/30 px-1 py-0.5 rounded">npm run build</code> চালিয়ে ফ্রন্টএন্ড বান্ডেল তৈরি করুন।<br />
                  ২. <code className="bg-black/30 px-1 py-0.5 rounded">npm start</code> কমান্ড দিয়ে এক্সপ্রেস সার্ভার চালু করুন (সার্ভার পোর্ট ৩০০০-এ রান হয়)।
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
                <span className="font-semibold text-white block">Vercel / Render / Railway:</span>
                <p className="text-[11px]">
                  Environment Settings-এ গিয়ে <code className="bg-black/30 px-1 py-0.5 rounded text-emerald-300">OPENAI_API_KEY</code> সেট করুন। Build Command হিসেবে <code className="bg-black/30 px-1 py-0.5 rounded">npm run build</code> এবং Start Command হিসেবে <code className="bg-black/30 px-1 py-0.5 rounded">node server.ts</code> ব্যবহার করুন।
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-white/10 bg-[#101a44]/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs cursor-pointer transition-colors"
          >
            বুঝেছি, বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
