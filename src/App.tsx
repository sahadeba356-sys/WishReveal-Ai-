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
import { api } from './services/apiClient';
import { User, Quiz, VoluntaryAnswer } from './types/backend';

export default function App() {
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

  // New Backend Interfaces
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [isResponsesOpen, setIsResponsesOpen] = useState(false);
  const [isPrivacySettingsOpen, setIsPrivacySettingsOpen] = useState(false);
  const [respondToken, setRespondToken] = useState<string | null>(null);

  // AI Analysis Initial Data
  const [aiAnalysisFriendName, setAiAnalysisFriendName] = useState<string | undefined>(undefined);
  const [analysisInitialAnswers, setAnalysisInitialAnswers] = useState<VoluntaryAnswer[] | undefined>(undefined);

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
    setAiAnalysisFriendName(friendName || 'বন্ধু');
    setIsAiAnalysisOpen(true);
  };

  const handleOpenAiFromResponse = (friendName: string, answers: VoluntaryAnswer[]) => {
    setAiAnalysisFriendName(friendName);
    setAnalysisInitialAnswers(answers);
    setIsAiAnalysisOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const [appNotification, setAppNotification] = useState<string | null>(null);

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setAppNotification('সফলভাবে লগআউট করা হয়েছে।');
    setTimeout(() => setAppNotification(null), 4000);
  };

  const handleAccountDeleted = () => {
    setCurrentUser(null);
    setAppNotification('আপনার অ্যাকাউন্ট এবং সমস্ত ডেটা সফলভাবে মুছে ফেলা হয়েছে।');
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
      
      {/* Top Backend Status & Transparency Banner */}
      <BackendStatusBanner onOpenPrivacy={() => setIsPrivacySettingsOpen(true)} />

      {/* App Notification Banner */}
      {appNotification && (
        <div className="bg-emerald-950/95 border-b border-emerald-500/40 py-1.5 px-3 text-center text-xs text-emerald-200 z-30 flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <span>{appNotification}</span>
          <button
            type="button"
            onClick={() => setAppNotification(null)}
            className="text-emerald-400 hover:text-white p-0.5 cursor-pointer ml-1 text-sm font-bold leading-none"
            aria-label="বার্তা বন্ধ করুন"
          >
            ✕
          </button>
        </div>
      )}

      {/* Logged in notification banner */}
      {currentUser && (
        <div className="bg-gradient-to-r from-purple-900/90 via-pink-900/90 to-indigo-900/90 border-b border-pink-500/30 py-1 px-3 text-center text-[11px] sm:text-xs text-pink-200 z-30 flex items-center justify-center gap-2">
          <span className="truncate">স্বাগতম, {currentUser.name}! নিরাপদ অ্যাকাউন্টে যুক্ত আছেন 💖</span>
          <button
            onClick={() => setIsResponsesOpen(true)}
            className="underline hover:text-white shrink-0 p-0.5 cursor-pointer font-bold"
          >
            আমার ড্যাশবোর্ড
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenCreateQuiz={() => {
          if (!currentUser) {
            setIsLoginOpen(true);
          } else {
            setIsCreateQuizOpen(true);
          }
        }}
        onOpenResponses={() => {
          if (!currentUser) {
            setIsLoginOpen(true);
          } else {
            setIsResponsesOpen(true);
          }
        }}
        onOpenPrivacy={() => setIsPrivacySettingsOpen(true)}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onStartQuiz={() => setIsQuizOpen(true)}
          onOpenWishBox={() => setIsWishBoxOpen(true)}
        />

        {/* Features Section */}
        <Features
          onOpenQuiz={() => setIsQuizOpen(true)}
          onOpenAiAnalysis={() => setIsAiAnalysisOpen(true)}
          onOpenWishBox={() => setIsWishBoxOpen(true)}
          onOpenFriendshipLink={() => {
            setTargetLinkQuiz(null);
            setIsLinkModalOpen(true);
          }}
        />

        {/* How It Works Section */}
        <HowItWorks
          onStartQuiz={() => setIsQuizOpen(true)}
        />

        {/* Friendship Sunset CTA */}
        <FriendshipCTA
          onStartQuiz={() => setIsQuizOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setInfoModalType('privacy')}
        onOpenTerms={() => setInfoModalType('terms')}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      {/* Floating Cat Helper Widget */}
      <FloatingCatWidget
        onStartQuiz={() => setIsQuizOpen(true)}
        onOpenWishBox={() => setIsWishBoxOpen(true)}
      />

      {/* Modals & Interfaces */}
      
      {/* 1. Registration & Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* 3. Quiz Creation Modal */}
      <CreateQuizModal
        isOpen={isCreateQuizOpen}
        onClose={() => setIsCreateQuizOpen(false)}
        onQuizCreated={handleQuizCreated}
      />

      {/* 4. Quiz Response Submission Modal (For friends with token) */}
      <QuizResponseSubmitModal
        isOpen={Boolean(respondToken)}
        shareToken={respondToken || ''}
        onClose={() => setRespondToken(null)}
        onSuccess={() => {}}
      />

      {/* 5. Viewing Authorized Responses Dashboard Modal */}
      <QuizResponsesModal
        isOpen={isResponsesOpen}
        onClose={() => setIsResponsesOpen(false)}
        onOpenAiAnalysisWithData={handleOpenAiFromResponse}
        onOpenShareModal={handleOpenShareModal}
        onCreateNewQuiz={() => setIsCreateQuizOpen(true)}
      />

      {/* 6. Shareable Quiz Link Modal */}
      <FriendshipLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setTargetLinkQuiz(null);
        }}
        onOpenQuiz={() => setIsQuizOpen(true)}
        targetQuiz={targetLinkQuiz}
        onOpenRespondModal={(token) => setRespondToken(token)}
      />

      {/* 7. Saving and Deleting Wishes Modal */}
      <WishBoxModal
        isOpen={isWishBoxOpen}
        onClose={() => setIsWishBoxOpen(false)}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* 8 & 9. Privacy Settings & Account Deletion Modal */}
      <PrivacySettingsModal
        isOpen={isPrivacySettingsOpen}
        onClose={() => setIsPrivacySettingsOpen(false)}
        currentUser={currentUser}
        onAccountDeleted={handleAccountDeleted}
      />

      {/* General Secret Wish Quiz Modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onOpenFriendshipLink={() => {
          setTargetLinkQuiz(null);
          setIsLinkModalOpen(true);
        }}
        onOpenAiAnalysis={(answers) => handleOpenAiWithAnswers(answers, currentUser?.name || 'বন্ধু')}
      />

      {/* AI Analysis Modal */}
      <AiAnalysisModal
        isOpen={isAiAnalysisOpen}
        onClose={() => {
          setIsAiAnalysisOpen(false);
          setAnalysisInitialAnswers(undefined);
          setAiAnalysisFriendName(undefined);
        }}
        onStartQuiz={() => setIsQuizOpen(true)}
        initialAnswers={analysisInitialAnswers}
        initialFriendName={aiAnalysisFriendName}
      />

      {/* Contact & Info Modals */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

    </div>
  );
}
