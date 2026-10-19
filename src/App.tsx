/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { FriendshipCTA } from './components/FriendshipCTA';
import { Footer } from './components/Footer';
import { FloatingCatWidget } from './components/FloatingCatWidget';
import { QuizModal } from './components/QuizModal';
import { FriendshipLinkModal } from './components/FriendshipLinkModal';
import { WishBoxModal } from './components/WishBoxModal';
import { AiAnalysisModal } from './components/AiAnalysisModal';
import { LoginModal } from './components/LoginModal';
import { ContactModal } from './components/ContactModal';
import { InfoModal } from './components/InfoModal';
import { BackendStatusBanner } from './components/BackendStatusBanner';
import { CreateQuizModal } from './components/CreateQuizModal';
import { QuizResponsesModal } from './components/QuizResponsesModal';
import { QuizResponseSubmitModal } from './components/QuizResponseSubmitModal';
import { PrivacySettingsModal } from './components/PrivacySettingsModal';
import { OpenAiConfigModal } from './components/OpenAiConfigModal';
import { api } from './services/apiClient';
import { User, Quiz, VoluntaryAnswer } from './types/backend';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

function MainApp() {
  const { language, t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User | null>(api.getCurrentUser());

  // Modal Open States
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [targetLinkQuiz, setTargetLinkQuiz] = useState<Quiz | null>(null);
  const [isWishBoxOpen, setIsWishBoxOpen] = useState(false);
  const [isAiAnalysisOpen, setIsAiAnalysisOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'privacy' | 'terms' | null>(null);
  const [isOpenAiConfigOpen, setIsOpenAiConfigOpen] = useState(false);

  // Backend Interfaces
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [isResponsesOpen, setIsResponsesOpen] = useState(false);
  const [isPrivacySettingsOpen, setIsPrivacySettingsOpen] = useState(false);
  const [respondToken, setRespondToken] = useState<string | null>(null);

  // AI Analysis Initial Data
  const [aiAnalysisFriendName, setAiAnalysisFriendName] = useState<string | undefined>(undefined);
  const [analysisInitialAnswers, setAnalysisInitialAnswers] = useState<VoluntaryAnswer[] | undefined>(undefined);
  const [analysisVoluntaryNotes, setAnalysisVoluntaryNotes] = useState<string | undefined>(undefined);

  // Check URL hash for invitation tokens (e.g. #respond?token=wq_...)
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.includes('respond') && hash.includes('token=')) {
        const params = new URLSearchParams(hash.split('?')[1] || '');
        const token = params.get('token');
        if (token) {
          setRespondToken(token);
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleOpenAiWithAnswers = (answers: VoluntaryAnswer[], friendName?: string) => {
    setAnalysisInitialAnswers(answers);
    setAiAnalysisFriendName(friendName || 'আমার বন্ধু');
    setAnalysisVoluntaryNotes(undefined);
    setIsAiAnalysisOpen(true);
  };

  const handleOpenAiFromResponse = (friendName: string, answers: VoluntaryAnswer[], voluntaryNotes?: string) => {
    setAiAnalysisFriendName(friendName);
    setAnalysisInitialAnswers(answers);
    setAnalysisVoluntaryNotes(voluntaryNotes);
    setIsAiAnalysisOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const [appNotification, setAppNotification] = useState<string | null>(null);

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setAppNotification(language === 'bn' ? 'সফলভাবে লগআউট করা হয়েছে।' : 'Successfully logged out.');
    setTimeout(() => setAppNotification(null), 4000);
  };

  const handleAccountDeleted = () => {
    setCurrentUser(null);
    setAppNotification(
      language === 'bn'
        ? 'আপনার অ্যাকাউন্ট এবং সমস্ত ডেটা সফলভাবে মুছে ফেলা হয়েছে।'
        : 'Your account and all data have been permanently deleted.'
    );
    setTimeout(() => setAppNotification(null), 6000);
  };

  const handleQuizCreated = (quiz: Quiz) => {
    setTargetLinkQuiz(quiz);
    setIsLinkModalOpen(true);
  };

  const handleOpenShareModal = (quiz: Quiz) => {
    setTargetLinkQuiz(quiz);
    setIsLinkModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080c1e] text-slate-100 flex flex-col font-bengali selection:bg-pink-500 selection:text-white relative">
      
      {/* Top Backend Status & OpenAI Banner */}
      <BackendStatusBanner
        onOpenPrivacy={() => setIsPrivacySettingsOpen(true)}
        onOpenOpenAiConfig={() => setIsOpenAiConfigOpen(true)}
      />

      {/* App Notification Banner */}
      {appNotification && (
        <div className="bg-emerald-950/95 border-b border-emerald-500/40 py-1.5 px-3 text-center text-xs text-emerald-200 z-30 flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <span>{appNotification}</span>
          <button
            type="button"
            onClick={() => setAppNotification(null)}
            className="text-emerald-400 hover:text-white p-0.5 cursor-pointer ml-1 text-sm font-bold leading-none"
            aria-label={t.close}
          >
            ✕
          </button>
        </div>
      )}

      {/* Logged in notification banner */}
      {currentUser && (
        <div className="bg-gradient-to-r from-purple-900/90 via-pink-900/90 to-indigo-900/90 border-b border-pink-500/30 py-1 px-3 text-center text-[11px] sm:text-xs text-pink-200 z-30 flex items-center justify-center gap-2">
          <span className="truncate">
            {t.backendLoggedInWelcome}, {currentUser.name}! {t.backendLoggedInSuffix}
          </span>
          <button
            onClick={() => setIsResponsesOpen(true)}
            className="underline hover:text-white shrink-0 p-0.5 cursor-pointer font-bold"
          >
            {t.backendMyDashboard}
          </button>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        onStartQuiz={() => setIsQuizOpen(true)}
        onOpenWishBox={() => setIsWishBoxOpen(true)}
        onOpenAiAnalysis={() => {
          setAiAnalysisFriendName(undefined);
          setAnalysisInitialAnswers(undefined);
          setAnalysisVoluntaryNotes(undefined);
          setIsAiAnalysisOpen(true);
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenResponses={() => setIsResponsesOpen(true)}
        onOpenOpenAiConfig={() => setIsOpenAiConfigOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        <Hero
          onStartQuiz={() => setIsQuizOpen(true)}
          onOpenWishBox={() => setIsWishBoxOpen(true)}
          onOpenAiAnalysis={() => {
            setAiAnalysisFriendName(undefined);
            setAnalysisInitialAnswers(undefined);
            setAnalysisVoluntaryNotes(undefined);
            setIsAiAnalysisOpen(true);
          }}
        />

        <Features
          onStartQuiz={() => setIsQuizOpen(true)}
          onOpenWishBox={() => setIsWishBoxOpen(true)}
          onOpenAiAnalysis={() => {
            setAiAnalysisFriendName(undefined);
            setAnalysisInitialAnswers(undefined);
            setAnalysisVoluntaryNotes(undefined);
            setIsAiAnalysisOpen(true);
          }}
          onOpenFriendshipLink={() => {
            if (currentUser) {
              setIsResponsesOpen(true);
            } else {
              setIsCreateQuizOpen(true);
            }
          }}
        />

        <HowItWorks onStartQuiz={() => setIsQuizOpen(true)} />

        <FriendshipCTA
          onStartQuiz={() => setIsQuizOpen(true)}
          onOpenWishBox={() => setIsWishBoxOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setInfoModalType('privacy')}
        onOpenTerms={() => setInfoModalType('terms')}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Floating Cat Widget */}
      <FloatingCatWidget
        onStartQuiz={() => setIsQuizOpen(true)}
        onOpenWishBox={() => setIsWishBoxOpen(true)}
      />

      {/* --- Modals & Overlays --- */}

      {/* 1. Standard Wish Quiz Modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onOpenFriendshipLink={() => {
          setIsQuizOpen(false);
          setIsLinkModalOpen(true);
        }}
        onOpenAiAnalysis={(answers) => {
          setIsQuizOpen(false);
          handleOpenAiWithAnswers(answers);
        }}
      />

      {/* 2. OpenAI ChatGPT Analysis Modal */}
      <AiAnalysisModal
        isOpen={isAiAnalysisOpen}
        onClose={() => setIsAiAnalysisOpen(false)}
        onStartQuiz={() => {
          setIsAiAnalysisOpen(false);
          setIsQuizOpen(true);
        }}
        initialAnswers={analysisInitialAnswers}
        initialFriendName={aiAnalysisFriendName}
        initialVoluntaryNotes={analysisVoluntaryNotes}
      />

      {/* 3. OpenAI Configuration & Deployment Guide Modal */}
      <OpenAiConfigModal
        isOpen={isOpenAiConfigOpen}
        onClose={() => setIsOpenAiConfigOpen(false)}
      />

      {/* 4. Secret Wish Box Modal */}
      <WishBoxModal
        isOpen={isWishBoxOpen}
        onClose={() => setIsWishBoxOpen(false)}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* 5. Custom Quiz Creation Modal */}
      <CreateQuizModal
        isOpen={isCreateQuizOpen}
        onClose={() => setIsCreateQuizOpen(false)}
        currentUser={currentUser}
        onQuizCreated={handleQuizCreated}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* 6. Quiz Dashboard & Responses Modal */}
      <QuizResponsesModal
        isOpen={isResponsesOpen}
        onClose={() => setIsResponsesOpen(false)}
        onOpenCreateQuiz={() => setIsCreateQuizOpen(true)}
        onOpenShareModal={handleOpenShareModal}
        onOpenAiAnalysisWithData={handleOpenAiFromResponse}
      />

      {/* 7. Public Quiz Response Submission Modal (accessed via shared link) */}
      <QuizResponseSubmitModal
        shareToken={respondToken}
        onClose={() => {
          setRespondToken(null);
          window.location.hash = '';
        }}
        onOpenMyQuiz={() => {
          setRespondToken(null);
          window.location.hash = '';
          setIsQuizOpen(true);
        }}
      />

      {/* 8. Shareable Friendship Link Modal */}
      <FriendshipLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        targetQuiz={targetLinkQuiz}
      />

      {/* 9. User Login & Registration Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* 10. Privacy & GDPR Settings Modal */}
      <PrivacySettingsModal
        isOpen={isPrivacySettingsOpen}
        onClose={() => setIsPrivacySettingsOpen(false)}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onAccountDeleted={handleAccountDeleted}
      />

      {/* 11. Contact & Feedback Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* 12. Privacy Policy & Terms Modal */}
      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

