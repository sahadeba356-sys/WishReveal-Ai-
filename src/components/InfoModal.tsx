import React, { useEffect } from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface InfoModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  useEffect(() => {
    if (!type) return;
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
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-bengali"
    >
      <div className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-[#0c1233] border border-pink-500/30 text-white shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#10173e]/90 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              {type === 'privacy' ? <Shield className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <h2 id="info-modal-title" className="font-bold text-sm sm:text-base text-white">
              {type === 'privacy' ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'ব্যবহারের শর্তাবলী (Terms of Service)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar text-xs leading-relaxed text-slate-300">
          {type === 'privacy' ? (
            <>
              <p>
                WishReveal Ai-এ আমরা আপনার গোপনীয়তাকে সর্বোচ্চ অগ্রাধিকার প্রদান করি। এই প্ল্যাটফর্মটি বন্ধুদের মধ্যে ভালোবাসাপূর্ণ উপহার ও ইচ্ছার আদান-প্রদানকে সহজ ও আনন্দদায়ক করতে তৈরি করা হয়েছে।
              </p>
              <h3 className="font-bold text-sm text-pink-300 pt-2">১. আমরা কী তথ্য সংগ্রহ করি?</h3>
              <p>
                আমরা কেবল সেই তথ্য সংগ্রহ করি যা আপনি বা আপনার বন্ধু স্বেচ্ছায় কুইজ বা উইশ বক্সে ইনপুট দেন (যেমন: পছন্দের ভ্রমণ স্থান, শখ, উপহারের ধরন ইত্যাদি)।
              </p>
              <h3 className="font-bold text-sm text-pink-300 pt-2">২. OpenAI ChatGPT ব্যবহারের স্বচ্ছতা</h3>
              <p>
                শেয়ার করা উত্তরের ভিত্তিতে উপহার আইডিয়া তৈরি করতে আমরা অফিসিয়াল OpenAI ChatGPT API ব্যবহার করি। আপনার কোনো ব্যক্তিগত সংবেদনশীল তথ্য বা পাসওয়ার্ড কোনো তৃতীয় পক্ষের সাথে ভাগ করা হয় না।
              </p>
              <h3 className="font-bold text-sm text-pink-300 pt-2">৩. পাসওয়ার্ড ও নিরাপত্তা</h3>
              <p>
                ব্যবহারকারীর পাসওয়ার্ডগুলি Node Scrypt ক্রিপ্টোগ্রাফিক অ্যালগরিদম ও ইউনিক সল্ট দিয়ে হ্যাশ করে সার্ভারে সংরক্ষিত থাকে।
              </p>
            </>
          ) : (
            <>
              <p>
                WishReveal Ai প্ল্যাটফর্মটি ব্যবহারের মাধ্যমে আপনি নিচের শর্তাবলীতে সম্মত হচ্ছেন:
              </p>
              <h3 className="font-bold text-sm text-pink-300 pt-2">১. বন্ধুসুলভ বিনোদনমূলক ব্যবহার</h3>
              <p>
                এই প্ল্যাটফর্মের সমস্ত কুইজ, ফলাফল ও AI বিশ্লেষণ শুধুমাত্র পারস্পরিক সৌহার্দ্য ও উপহারের ধারণার জন্য তৈরি। এটি কোনো অবচেতন বা মনস্তাত্ত্বিক দাবি নয়।
              </p>
              <h3 className="font-bold text-sm text-pink-300 pt-2">২. অপব্যবহার নিষিদ্ধ</h3>
              <p>
                অন্য কারো নাম বা তথ্য বিকৃত করে অসৎ উদ্দেশ্যে কুইজ তৈরি বা অনুপযুক্ত তথ্য প্রেরণ কঠোরভাবে নিষিদ্ধ।
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-white/10 bg-[#10173e]/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
