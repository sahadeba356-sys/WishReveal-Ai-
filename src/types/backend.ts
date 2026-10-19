/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  privacySettings: UserPrivacySettings;
}

export interface UserPrivacySettings {
  isProfileSearchable: boolean; // default: false
  defaultQuizPrivate: boolean; // default: true
  allowAiAnalysisConsent: boolean; // default: true
  allowAnonymousResponses: boolean; // default: false
  dataRetentionDays: number; // default: 90
}

export interface VoluntaryAnswer {
  category: string;
  categoryIcon?: string;
  answer: string;
}

export interface QuizQuestionOption {
  text: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  category: string;
  categoryIcon: string;
  options: QuizQuestionOption[];
}

export interface Quiz {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  theme: string;
  shareToken: string;
  isPrivate: boolean; // default: true
  allowMultipleResponses: boolean;
  expiresAt?: string;
  createdAt: string;
  questions: QuizQuestion[];
  responsesCount?: number;
}

export interface QuizAnswer {
  questionId: string;
  questionText: string;
  category: string;
  selectedOption: string;
}

export interface QuizResponse {
  id: string;
  quizId: string;
  quizTitle: string;
  respondentName: string;
  respondentConsentGiven: boolean;
  answers: QuizAnswer[];
  voluntaryNote?: string;
  submittedAt: string;
}

export interface Wish {
  id: string;
  userId: string;
  text: string;
  category: string;
  isLocked: boolean; // default: true
  isPrivate: boolean; // default: true
  createdAt: string;
}

export interface BackendStatus {
  isConfigured: boolean;
  storageType: 'in_memory_development' | 'production_database';
  message: string;
  hasOpenAiKey: boolean;
  openAiModel?: string;
  hasGeminiKey: boolean;
  activeUsersCount: number;
}

export interface OpenAiStatusResponse {
  isConfigured: boolean;
  provider: string;
  model: string;
  status: 'active' | 'unconfigured_demo';
  message: string;
}

export interface OpenAiChatResponse {
  reply: string;
  mode: 'real_ai' | 'demo_mode';
  providerName: string;
  error?: string;
}
