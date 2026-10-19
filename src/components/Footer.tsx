import React from 'react';
import { Sparkles, Heart, Shield, FileText, Mail } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
}) => {
  const { language, t } = useLanguage();

  return (
    <footer className="w-full bg-[#060918] border-t border-white/10 pt-12 pb-8 text-slate-400 text-xs font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 fill-white/20" />
            </div>
            <span className="font-extrabold text-base text-white font-brand">
              {t.appName} <span className="text-pink-400">{t.appAiBadge}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-pink-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t.footerPrivacy}</span>
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-pink-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.footerTerms}</span>
            </button>
            <button
              onClick={onOpenContact}
              className="hover:text-pink-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{t.footerContact}</span>
            </button>
          </div>
        </div>

        {/* Ethical Notice */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 text-center leading-relaxed max-w-3xl mx-auto">
          {t.footerEthicalNotice}
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} {t.footerCopyright}</span>
          <span className="flex items-center justify-center gap-1">
            {t.footerCraftedWith} <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
          </span>
        </div>
      </div>
    </footer>
  );
};

