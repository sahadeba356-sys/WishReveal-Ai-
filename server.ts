/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import OpenAI from 'openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Secure Password Hashing Utilities using Node Crypto (scrypt + random salt) ---
function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

function verifyPassword(password: string, combinedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    const [salt, key] = combinedHash.split(':');
    if (!salt || !key) return resolve(false);

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return resolve(false);
      try {
        const keyBuffer = Buffer.from(key, 'hex');
        const match = crypto.timingSafeEqual(keyBuffer, derivedKey);
        resolve(match);
      } catch {
        resolve(false);
      }
    });
  });
}

// Generate secure random tokens
function generateSecureToken(prefix: string = 'tok'): string {
  return `${prefix}_${crypto.randomBytes(24).toString('base64url')}`;
}

// --- In-Memory Store Schemas ---
interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  privacySettings: {
    isProfileSearchable: boolean;
    defaultQuizPrivate: boolean;
    allowAiAnalysisConsent: boolean;
    allowAnonymousResponses: boolean;
    dataRetentionDays: number;
  };
}

interface StoredQuiz {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  theme: string;
  shareToken: string;
  isPrivate: boolean;
  allowMultipleResponses: boolean;
  expiresAt?: string;
  createdAt: string;
  questions: Array<{
    id: string;
    question: string;
    category: string;
    categoryIcon: string;
    options: Array<{ text: string; category: string }>;
  }>;
}

interface StoredQuizResponse {
  id: string;
  quizId: string;
  creatorId: string;
  quizTitle: string;
  respondentName: string;
  respondentConsentGiven: boolean;
  answers: Array<{
    questionId: string;
    questionText: string;
    category: string;
    selectedOption: string;
  }>;
  voluntaryNote?: string;
  submittedAt: string;
}

interface StoredWish {
  id: string;
  userId: string;
  text: string;
  category: string;
  isLocked: boolean;
  isPrivate: boolean;
  createdAt: string;
}

const users: Map<string, StoredUser> = new Map();
const sessions: Map<string, string> = new Map(); // token -> userId
const quizzes: Map<string, StoredQuiz> = new Map();
const quizResponses: Map<string, StoredQuizResponse> = new Map();
const wishes: Map<string, StoredWish> = new Map();

// Seed initial default mock user for development testing
async function seedDevelopmentData() {
  const devPasswordHash = await hashPassword('Friendship2025!');
  const devUser: StoredUser = {
    id: 'usr_dev_1',
    name: 'তানভীর আহমেদ',
    email: 'tanveer@example.com',
    passwordHash: devPasswordHash,
    createdAt: new Date().toISOString(),
    privacySettings: {
      isProfileSearchable: false,
      defaultQuizPrivate: true,
      allowAiAnalysisConsent: true,
      allowAnonymousResponses: false,
      dataRetentionDays: 90,
    },
  };
  users.set(devUser.id, devUser);

  const sampleQuiz: StoredQuiz = {
    id: 'quiz_sample_1',
    creatorId: devUser.id,
    creatorName: devUser.name,
    title: 'তানভীরের ফ্রেন্ডশিপ উইশ কুইজ',
    description: 'আমার বন্ধুদের মনের ইচ্ছা ও পছন্দের ড্রিম ট্রাভেল আইডিয়া জানার কুইজ!',
    theme: 'dreams',
    shareToken: 'wq_sample_friendship_token',
    isPrivate: true,
    allowMultipleResponses: false,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        question: 'যদি যেকোনো জায়গায় ঘুরে আসার সুযোগ পান, প্রথম পছন্দ কোথায়?',
        category: 'ভ্রমণ ও প্রকৃতি',
        categoryIcon: '✈️',
        options: [
          { text: 'পাহাড়ের শান্ত কুয়াশা ও পাইন বন', category: 'ভ্রমণ' },
          { text: 'সমুদ্রের উত্তাল নীল ঢেউ ও সূর্যাস্ত', category: 'ভ্রমণ' },
          { text: 'জাপানের চেরি ব্লসম ও প্রাচীন শহর', category: 'ভ্রমণ' },
        ],
      },
      {
        id: 'q2',
        question: 'কেমন উপহার পেলে আপনার মুখে সবচেয়ে খাঁটি হাসি ফুটে উঠবে?',
        category: 'পছন্দের উপহার',
        categoryIcon: '🎁',
        options: [
          { text: 'কাছের মানুষের হাতে লেখা আবেগমাখা চিঠি', category: 'উপহার' },
          { text: 'দৈনন্দিন কাজে সহায়ক স্মার্ট টেক গ্যাজেট', category: 'উপহার' },
          { text: 'একসাথে কোনো সারপ্রাইজ ডে-আউট ট্রিপ', category: 'উপহার' },
        ],
      },
    ],
  };
  quizzes.set(sampleQuiz.id, sampleQuiz);

  const sampleResp: StoredQuizResponse = {
    id: 'resp_sample_1',
    quizId: sampleQuiz.id,
    creatorId: devUser.id,
    quizTitle: sampleQuiz.title,
    respondentName: 'সাদিয়া তাসনিম',
    respondentConsentGiven: true,
    answers: [
      {
        questionId: 'q1',
        questionText: 'যদি যেকোনো জায়গায় ঘুরে আসার সুযোগ পান, প্রথম পছন্দ কোথায়?',
        category: 'ভ্রমণ ও প্রকৃতি',
        selectedOption: 'পাহাড়ের শান্ত কুয়াশা ও পাইন বন',
      },
      {
        questionId: 'q2',
        questionText: 'কেমন উপহার পেলে আপনার মুখে সবচেয়ে খাঁটি হাসি ফুটে উঠবে?',
        category: 'পছন্দের উপহার',
        selectedOption: 'কাছের মানুষের হাতে লেখা আবেগমাখা চিঠি',
      },
    ],
    voluntaryNote: 'আমি শান্ত পাহাড়ি জায়গা খুব ভালোবাসি!',
    submittedAt: new Date().toISOString(),
  };
  quizResponses.set(sampleResp.id, sampleResp);

  const sampleWish: StoredWish = {
    id: 'wish_sample_1',
    userId: devUser.id,
    text: 'বন্ধুদের সাথে একবার সাজেকের মেঘের ওপর বসে সূর্যোদয় দেখার ইচ্ছা।',
    category: 'স্বপ্ন',
    isLocked: true,
    isPrivate: true,
    createdAt: new Date().toISOString(),
  };
  wishes.set(sampleWish.id, sampleWish);
}

seedDevelopmentData().catch(console.error);

// --- Express App Setup ---
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  // --- Auth Middleware ---
  interface AuthenticatedRequest extends Request {
    userId?: string;
    currentUser?: StoredUser;
  }

  function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'প্রবেশাধিকার নেই। অনুগ্রহ করে লগইন করুন।' });
    }

    const token = authHeader.split(' ')[1];
    const userId = sessions.get(token);

    if (!userId || !users.has(userId)) {
      return res.status(401).json({ error: 'সেশনটির মেয়াদ শেষ হয়েছে বা অকার্যকর। পুনরায় লগইন করুন।' });
    }

    req.userId = userId;
    req.currentUser = users.get(userId);
    next();
  }

  // --- Safe OpenAI Key & Model Resolution (Prevent accidental key leakage) ---
  function getSafeOpenAiModel(): string {
    const raw = process.env.OPENAI_MODEL;
    if (!raw || raw.startsWith('sk-') || raw.includes('MY_') || raw.length > 35) {
      return 'gpt-4o-mini';
    }
    return raw.trim();
  }

  function getOpenAIClient(): OpenAI | null {
    let key = process.env.OPENAI_API_KEY;
    if (!key || key.trim() === '' || key === 'MY_OPENAI_API_KEY') {
      // Check if user set the key in OPENAI_MODEL by mistake
      if (process.env.OPENAI_MODEL && process.env.OPENAI_MODEL.startsWith('sk-')) {
        key = process.env.OPENAI_MODEL;
      } else {
        return null;
      }
    }
    return new OpenAI({ apiKey: key.trim() });
  }

  function hasConfiguredOpenAi(): boolean {
    const hasExplicitKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'MY_OPENAI_API_KEY');
    const hasModelKey = Boolean(process.env.OPENAI_MODEL && process.env.OPENAI_MODEL.startsWith('sk-'));
    return hasExplicitKey || hasModelKey;
  }

  // --- 0. Backend Integration Status & OpenAI Endpoints ---
  app.get('/api/backend-status', (req, res) => {
    const hasOpenAiKey = hasConfiguredOpenAi();
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    res.json({
      isConfigured: false,
      storageType: 'in_memory_development',
      message: 'WishReveal Ai ব্যাকএন্ড ইন্টারফেস সফলভাবে প্রস্তুত। বর্তমান সেশনটি ইন-মেমোরি ডেভেলপমেন্ট স্টোরেজে চলছে। প্রোডাকশন ক্লাউড ডেটাবেস সংযোগের পূর্ব পর্যন্ত ডেটা ব্রাউজার সেশনে সক্রিয় থাকবে।',
      hasOpenAiKey,
      openAiModel: getSafeOpenAiModel(),
      hasGeminiKey,
      activeUsersCount: users.size,
    });
  });

  app.get('/api/openai/status', (req, res) => {
    const hasKey = hasConfiguredOpenAi();
    const model = getSafeOpenAiModel();
    res.json({
      isConfigured: hasKey,
      provider: 'OpenAI ChatGPT',
      model,
      status: hasKey ? 'active' : 'unconfigured_demo',
      message: hasKey
        ? `OpenAI ChatGPT (${model}) ব্যাকএন্ড সক্রিয় রয়েছে।`
        : 'OPENAI_API_KEY কনফিগার করা হয়নি। অ্যাপ্লিকেশনটি বর্তমানে স্মার্ট ডেমো মোডে চলবে। ব্যাকএন্ডে OPENAI_API_KEY সেট করুন।',
    });
  });

  // --- 1. User Registration & Login Endpoints ---
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body || {};

      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: 'সঠিক নাম প্রদান করুন (কমপক্ষে ২ অক্ষর)।' });
      }

      if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({ error: 'একটি বৈধ ইমেইল এড্রেস লিখুন।' });
      }

      if (!password || typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ error: 'নিরাপত্তার স্বার্থে পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।' });
      }

      const normalizedEmail = email.trim().toLowerCase();

      for (const u of users.values()) {
        if (u.email === normalizedEmail) {
          return res.status(400).json({ error: 'এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।' });
        }
      }

      const passwordHash = await hashPassword(password);
      const userId = generateSecureToken('usr');

      const newUser: StoredUser = {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        createdAt: new Date().toISOString(),
        privacySettings: {
          isProfileSearchable: false,
          defaultQuizPrivate: true,
          allowAiAnalysisConsent: true,
          allowAnonymousResponses: false,
          dataRetentionDays: 90,
        },
      };

      users.set(userId, newUser);

      const token = generateSecureToken('sess');
      sessions.set(token, userId);

      const { passwordHash: _, ...userSafe } = newUser;
      return res.status(201).json({
        user: userSafe,
        token,
        message: 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!',
      });
    } catch (err) {
      console.error('Registration error:', err);
      return res.status(500).json({ error: 'রেজিস্ট্রেশন প্রক্রিয়ায় ত্রুটি ঘটেছে।' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res.status(400).json({ error: 'ইমেইল এবং পাসওয়ার্ড আবশ্যক।' });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      let matchedUser: StoredUser | null = null;

      for (const u of users.values()) {
        if (u.email === normalizedEmail) {
          matchedUser = u;
          break;
        }
      }

      if (!matchedUser) {
        return res.status(401).json({ error: 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।' });
      }

      const isValid = await verifyPassword(String(password), matchedUser.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।' });
      }

      const token = generateSecureToken('sess');
      sessions.set(token, matchedUser.id);

      const { passwordHash: _, ...userSafe } = matchedUser;
      return res.json({
        user: userSafe,
        token,
        message: 'সফলভাবে লগইন হয়েছে!',
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'লগইন প্রক্রিয়ায় ত্রুটি ঘটেছে।' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      sessions.delete(token);
    }
    res.json({ success: true, message: 'সফলভাবে লগআউট হয়েছে।' });
  });

  app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res) => {
    const { passwordHash: _, ...userSafe } = req.currentUser!;
    res.json(userSafe);
  });

  // --- 3. Quiz Endpoints ---
  app.post('/api/quizzes', authenticateToken, (req: AuthenticatedRequest, res) => {
    try {
      const { title, description, theme, questions, isPrivate, allowMultipleResponses, expiresAt } = req.body || {};

      if (!title || typeof title !== 'string' || title.trim().length < 3) {
        return res.status(400).json({ error: 'কুইজের শিরোনাম লিখুন (কমপক্ষে ৩ অক্ষর)।' });
      }

      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'কুইজে কমপক্ষে ১টি প্রশ্ন থাকা আবশ্যক।' });
      }

      const quizId = generateSecureToken('qz');
      const shareToken = generateSecureToken('wq');

      const newQuiz: StoredQuiz = {
        id: quizId,
        creatorId: req.userId!,
        creatorName: req.currentUser!.name,
        title: title.trim(),
        description: (description && String(description).trim()) || '',
        theme: theme || 'dreams',
        shareToken,
        isPrivate: isPrivate !== false,
        allowMultipleResponses: Boolean(allowMultipleResponses),
        expiresAt: expiresAt || undefined,
        createdAt: new Date().toISOString(),
        questions: questions.map((q, idx) => ({
          id: q.id || `q_${idx + 1}`,
          question: String(q.question).trim(),
          category: String(q.category || 'সাধারণ').trim(),
          categoryIcon: String(q.categoryIcon || '✨').trim(),
          options: Array.isArray(q.options)
            ? q.options.map((opt: { text: string; category?: string }) => ({
                text: String(opt.text || '').trim(),
                category: String(opt.category || q.category || 'পছন্দ').trim(),
              }))
            : [],
        })),
      };

      quizzes.set(quizId, newQuiz);

      res.status(201).json({
        ...newQuiz,
        responsesCount: 0,
      });
    } catch (err) {
      console.error('Create quiz error:', err);
      res.status(500).json({ error: 'কুইজ তৈরিতে ত্রুটি ঘটেছে।' });
    }
  });

  app.get('/api/quizzes/my', authenticateToken, (req: AuthenticatedRequest, res) => {
    const myQuizzes: StoredQuiz[] = [];
    for (const q of quizzes.values()) {
      if (q.creatorId === req.userId) {
        let count = 0;
        for (const resp of quizResponses.values()) {
          if (resp.quizId === q.id) count++;
        }
        myQuizzes.push({
          ...q,
          responsesCount: count,
        } as StoredQuiz & { responsesCount: number });
      }
    }
    res.json(myQuizzes);
  });

  app.delete('/api/quizzes/:id', authenticateToken, (req: AuthenticatedRequest, res) => {
    const quiz = quizzes.get(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'কুইজটি পাওয়া যায়নি।' });
    }

    if (quiz.creatorId !== req.userId) {
      return res.status(403).json({ error: 'এই কুইজটি মোছার অনুমতি আপনার নেই।' });
    }

    quizzes.delete(req.params.id);

    for (const [respId, resp] of quizResponses.entries()) {
      if (resp.quizId === req.params.id) {
        quizResponses.delete(respId);
      }
    }

    res.json({ success: true, message: 'কুইজ এবং এর সকল রেসপন্স সফলভাবে মোছা হয়েছে।' });
  });

  // Public endpoint for quiz by share token
  app.get('/api/quizzes/public/:token', (req, res) => {
    const token = req.params.token;
    let foundQuiz: StoredQuiz | null = null;

    for (const q of quizzes.values()) {
      if (q.shareToken === token) {
        foundQuiz = q;
        break;
      }
    }

    if (!foundQuiz) {
      return res.status(404).json({ error: 'আমন্ত্রণ লিংকটি সঠিক নয় বা এর মেয়াদ শেষ হয়ে গেছে।' });
    }

    if (foundQuiz.expiresAt && new Date(foundQuiz.expiresAt) < new Date()) {
      return res.status(410).json({ error: 'এই কুইজের সময়সীমা শেষ হয়েছে।' });
    }

    res.json({
      id: foundQuiz.id,
      title: foundQuiz.title,
      description: foundQuiz.description,
      creatorName: foundQuiz.creatorName,
      theme: foundQuiz.theme,
      shareToken: foundQuiz.shareToken,
      questions: foundQuiz.questions,
    });
  });

  // Submit response via share token
  app.post('/api/quizzes/public/:token/respond', (req, res) => {
    try {
      const token = req.params.token;
      let targetQuiz: StoredQuiz | null = null;

      for (const q of quizzes.values()) {
        if (q.shareToken === token) {
          targetQuiz = q;
          break;
        }
      }

      if (!targetQuiz) {
        return res.status(404).json({ error: 'কুইজটি পাওয়া যায়নি।' });
      }

      const { respondentName, respondentConsentGiven, answers, voluntaryNote } = req.body || {};

      if (!respondentName || typeof respondentName !== 'string' || respondentName.trim().length < 2) {
        return res.status(400).json({ error: 'অনুগ্রহ করে আপনার নাম লিখুন।' });
      }

      if (!respondentConsentGiven) {
        return res.status(400).json({ error: 'উত্তরের গোপনীয়তা ও বন্ধুর সাথে শেয়ারের সম্মতি প্রদান আবশ্যক।' });
      }

      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ error: 'কমপক্ষে ১টি প্রশ্নের উত্তর নির্বাচন করুন।' });
      }

      const responseId = generateSecureToken('resp');
      const newResponse: StoredQuizResponse = {
        id: responseId,
        quizId: targetQuiz.id,
        creatorId: targetQuiz.creatorId,
        quizTitle: targetQuiz.title,
        respondentName: respondentName.trim(),
        respondentConsentGiven: true,
        answers: answers.map((a) => ({
          questionId: String(a.questionId || ''),
          questionText: String(a.questionText || ''),
          category: String(a.category || ''),
          selectedOption: String(a.selectedOption || ''),
        })),
        voluntaryNote: voluntaryNote ? String(voluntaryNote).trim().slice(0, 500) : undefined,
        submittedAt: new Date().toISOString(),
      };

      quizResponses.set(responseId, newResponse);

      return res.status(201).json({
        success: true,
        responseId,
        message: 'আপনার উত্তরটি সফলভাবে আপনার বন্ধুর কাছে পৌঁছে দেওয়া হয়েছে!',
      });
    } catch (err) {
      console.error('Submit response error:', err);
      return res.status(500).json({ error: 'রেসপন্স সাবমিট করতে ত্রুটি ঘটেছে।' });
    }
  });

  // Authorized viewing of quiz responses
  app.get('/api/quizzes/:id/responses', authenticateToken, (req: AuthenticatedRequest, res) => {
    const quizId = req.params.id;
    const quiz = quizzes.get(quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'কুইজটি পাওয়া যায়নি।' });
    }

    if (quiz.creatorId !== req.userId) {
      return res.status(403).json({ error: 'অননুমোদিত অ্যাক্সেস: আপনি এই কুইজের উত্তরগুলো দেখার অধিকারী নন।' });
    }

    const responses: StoredQuizResponse[] = [];
    for (const resp of quizResponses.values()) {
      if (resp.quizId === quizId) {
        responses.push(resp);
      }
    }

    res.json(responses);
  });

  // --- Wishes Endpoints ---
  app.get('/api/wishes', authenticateToken, (req: AuthenticatedRequest, res) => {
    const userWishes: StoredWish[] = [];
    for (const w of wishes.values()) {
      if (w.userId === req.userId) {
        userWishes.push(w);
      }
    }
    res.json(userWishes);
  });

  app.post('/api/wishes', authenticateToken, (req: AuthenticatedRequest, res) => {
    try {
      const { text, category, isLocked, isPrivate } = req.body || {};

      if (!text || typeof text !== 'string' || text.trim().length < 5) {
        return res.status(400).json({ error: 'ইচ্ছার বিবরণ কমপক্ষে ৫ অক্ষরের হতে হবে।' });
      }

      const wishId = generateSecureToken('wish');
      const newWish: StoredWish = {
        id: wishId,
        userId: req.userId!,
        text: text.trim().slice(0, 1000),
        category: (category && String(category).trim()) || 'সাধারণ',
        isLocked: isLocked !== false,
        isPrivate: isPrivate !== false,
        createdAt: new Date().toISOString(),
      };

      wishes.set(wishId, newWish);
      res.status(201).json(newWish);
    } catch (err) {
      console.error('Save wish error:', err);
      res.status(500).json({ error: 'ইচ্ছা সংরক্ষণে ত্রুটি ঘটেছে।' });
    }
  });

  app.delete('/api/wishes/:id', authenticateToken, (req: AuthenticatedRequest, res) => {
    const wish = wishes.get(req.params.id);
    if (!wish) {
      return res.status(404).json({ error: 'ইচ্ছাটি পাওয়া যায়নি।' });
    }

    if (wish.userId !== req.userId) {
      return res.status(403).json({ error: 'এই ইচ্ছাটি মোছার অনুমতি আপনার নেই।' });
    }

    wishes.delete(req.params.id);
    res.json({ success: true, message: 'ইচ্ছাটি সফলভাবে মুছে ফেলা হয়েছে।' });
  });

  // --- Privacy & GDPR Endpoints ---
  app.put('/api/user/privacy', authenticateToken, (req: AuthenticatedRequest, res) => {
    const user = users.get(req.userId!)!;
    const { isProfileSearchable, defaultQuizPrivate, allowAiAnalysisConsent, allowAnonymousResponses, dataRetentionDays } = req.body || {};

    user.privacySettings = {
      isProfileSearchable: typeof isProfileSearchable === 'boolean' ? isProfileSearchable : user.privacySettings.isProfileSearchable,
      defaultQuizPrivate: typeof defaultQuizPrivate === 'boolean' ? defaultQuizPrivate : user.privacySettings.defaultQuizPrivate,
      allowAiAnalysisConsent: typeof allowAiAnalysisConsent === 'boolean' ? allowAiAnalysisConsent : user.privacySettings.allowAiAnalysisConsent,
      allowAnonymousResponses: typeof allowAnonymousResponses === 'boolean' ? allowAnonymousResponses : user.privacySettings.allowAnonymousResponses,
      dataRetentionDays: Number(dataRetentionDays) || user.privacySettings.dataRetentionDays,
    };

    res.json(user.privacySettings);
  });

  app.get('/api/user/export-data', authenticateToken, (req: AuthenticatedRequest, res) => {
    const { passwordHash: _, ...safeUser } = req.currentUser!;
    const userQuizzes: StoredQuiz[] = [];
    for (const q of quizzes.values()) {
      if (q.creatorId === req.userId) userQuizzes.push(q);
    }
    const userWishes: StoredWish[] = [];
    for (const w of wishes.values()) {
      if (w.userId === req.userId) userWishes.push(w);
    }

    res.json({
      exportDate: new Date().toISOString(),
      user: safeUser,
      quizzes: userQuizzes,
      wishes: userWishes,
    });
  });

  app.delete('/api/auth/delete-account', authenticateToken, (req: AuthenticatedRequest, res) => {
    const { confirmText } = req.body || {};
    if (confirmText !== 'DELETE' && confirmText !== 'মুছে ফেলুন') {
      return res.status(400).json({ error: 'অ্যাকাউন্ট নিশ্চিত করার টেক্সট সঠিক নয়।' });
    }

    const userId = req.userId!;

    for (const [wId, w] of wishes.entries()) {
      if (w.userId === userId) wishes.delete(wId);
    }

    for (const [qId, q] of quizzes.entries()) {
      if (q.creatorId === userId) {
        quizzes.delete(qId);
        for (const [rId, r] of quizResponses.entries()) {
          if (r.quizId === qId) quizResponses.delete(rId);
        }
      }
    }

    for (const [tok, uid] of sessions.entries()) {
      if (uid === userId) sessions.delete(tok);
    }

    users.delete(userId);

    res.json({
      success: true,
      message: 'আপনার অ্যাকাউন্ট ও সম্পর্কিত সকল ডেটা স্থায়ীভাবে মুছে ফেলা হয়েছে।',
    });
  });

  // --- Shared AI Friendship Analysis Engine (OpenAI ChatGPT with Gemini & Demo Fallbacks) ---
  async function generateAiFriendAnalysis(
    cleanName: string,
    answers: Array<{ category?: string; answer?: string }>,
    voluntaryNotes?: string
  ) {
    const openai = getOpenAIClient();
    const geminiKey = process.env.GEMINI_API_KEY;

    const formattedAnswers = answers
      .map((a, idx) => `${idx + 1}. [${a.category || 'ক্যাটাগরি'}]: "${a.answer || ''}"`)
      .join('\n');

    // Priority 1: Official OpenAI API (ChatGPT)
    if (openai) {
      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      const prompt = `Analyze the following voluntarily shared quiz answers from a friend named "${cleanName}":\n${formattedAnswers}\n${voluntaryNotes ? `Additional voluntary note: "${voluntaryNotes}"` : ''}`;

      const completion = await openai.chat.completions.create({
        model,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are WishReveal Ai's friendship preference analysis assistant, powered by OpenAI ChatGPT.
CRITICAL ETHICAL RULES:
1. NEVER claim to read minds or know secrets.
2. NEVER infer sensitive personal information (financial, medical, religious, political).
3. Every suggestion MUST clearly indicate which voluntary quiz answer it is based on (supportingAnswer).
4. Always communicate uncertainty politely.
5. All text must be in natural, empathetic, polite Bengali language.

You MUST respond strictly with a valid JSON object matching this exact schema:
{
  "summary": "Friendship preference summary in Bengali",
  "uncertaintyStatement": "Clear statement in Bengali explaining that this is friendly estimation based solely on voluntary answers, not absolute fact",
  "suggestions": [
    {
      "title": "Title in Bengali",
      "category": "Category in Bengali",
      "description": "Description in Bengali",
      "supportingAnswer": "The voluntary quiz answer that supports this idea",
      "reasoning": "Reasoning in Bengali explaining why this was inferred",
      "confidence": "উচ্চ সম্ভাবনা (পরামর্শ)" or "মাঝারি সম্ভাবনা (পরামর্শ)" or "সম্ভাব্য আইডিয়া"
    }
  ],
  "suggestedGifts": [
    {
      "name": "Gift idea name in Bengali",
      "reason": "Why this gift fits in Bengali",
      "supportingAnswer": "Which voluntary answer supported this"
    }
  ],
  "friendshipTip": "A warm, thoughtful friendship tip in Bengali"
}`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      const raw = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(raw);
      return {
        mode: 'real_ai' as const,
        providerName: `OpenAI ChatGPT (${model})`,
        friendName: cleanName,
        summary: parsed.summary || `${cleanName}-এর শেয়ারকৃত উত্তরের ভিত্তিতে চমৎকার পছন্দের প্যাটার্ন পাওয়া গেছে।`,
        uncertaintyStatement: parsed.uncertaintyStatement || 'সতর্কতা: এটি শুধুই বন্ধুত্বপূর্ণ অনুমান, নিশ্চিত মন পড়ার দাবি নয়।',
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        suggestedGifts: Array.isArray(parsed.suggestedGifts) ? parsed.suggestedGifts : [],
        friendshipTip: parsed.friendshipTip || 'বন্ধুর সাথে আন্তরিক আড্ডায় তার বর্তমান রুচি জেনে নিন!',
      };
    }

    // Priority 2: Fallback to Google Gemini if configured
    if (geminiKey && geminiKey !== 'MY_GEMINI_API_KEY') {
      const ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `Analyze the following voluntarily shared quiz answers from a friend named "${cleanName}":\n${formattedAnswers}\n${voluntaryNotes ? `Additional voluntary note: "${voluntaryNotes}"` : ''}`;

      const systemInstruction = `
You are WishReveal Ai's friendship preference analysis assistant.
CRITICAL ETHICAL RULES:
1. NEVER claim to read minds or know secrets.
2. NEVER infer sensitive personal information.
3. Every suggestion MUST clearly indicate which voluntary quiz answer it is based on (supportingAnswer).
4. Always communicate uncertainty.
5. All text must be in natural, polite Bengali language.
`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          uncertaintyStatement: { type: Type.STRING },
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                supportingAnswer: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                confidence: { type: Type.STRING },
              },
              required: ['title', 'category', 'description', 'supportingAnswer', 'reasoning', 'confidence'],
            },
          },
          suggestedGifts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING },
                supportingAnswer: { type: Type.STRING },
              },
              required: ['name', 'reason', 'supportingAnswer'],
            },
          },
          friendshipTip: { type: Type.STRING },
        },
        required: ['summary', 'uncertaintyStatement', 'suggestions', 'suggestedGifts', 'friendshipTip'],
      };

      const result = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema,
        },
      });

      const parsed = JSON.parse(result.text?.trim() || '{}');
      return {
        mode: 'real_ai' as const,
        providerName: 'Google Gemini 3.8 Flash (WishReveal AI Engine)',
        friendName: cleanName,
        ...parsed,
      };
    }

    // Priority 3: Transparent demo mode fallback when neither key is provided
    return {
      mode: 'demo_mode' as const,
      providerName: 'WishReveal ব্যাকএন্ড ডেমো ইঞ্জিন (OpenAI কনফিগারেশন অপেক্ষা)',
      friendName: cleanName,
      summary: `${cleanName}-এর শেয়ারকৃত উত্তরের ভিত্তিতে দেখা যাচ্ছে তিনি আন্তরিক পরিবেশ ও সুন্দর স্মৃতির সান্নিধ্য ভালোবাসেন।`,
      uncertaintyStatement: 'সতর্কতা: এটি নিশ্চিত কোনো তথ্য বা মন পড়ার দাবি নয়, শুধুই বন্ধুত্বপূর্ণ ধারণা। মানুষের পছন্দ সময়ের সাথে পরিবর্তিত হতে পারে।',
      suggestions: [
        {
          title: 'প্রকৃতি ও উন্মুক্ত ভ্রমণের প্রতি আকর্ষণ',
          category: 'শখ ও আগ্রহ',
          description: `${cleanName}-এর দেওয়া উত্তরগুলোতে পাহাড়ি পরিবেশ বা মুক্ত প্রকৃতির সান্নিধ্যের প্রতি ভালো লাগা পরিলক্ষিত হয়।`,
          supportingAnswer: answers[0]?.answer || 'ভ্রমণ ক্যাটাগরির উত্তর',
          reasoning: 'ব্যবহারকারী স্বেচ্ছায় ভ্রমণ বা দৃশ্যপট বিষয়ক উত্তর নির্বাচন করেছেন।',
          confidence: 'উচ্চ সম্ভাবনা (পরামর্শ)',
        },
        {
          title: 'অর্থবহ উপহার ও স্মৃতির মূল্যায়ন',
          category: 'উপহার ও রুচি',
          description: `দামি কৃত্রিম পণ্যের চেয়ে আন্তরিক স্পর্শযুক্ত উপহার বেশি আনন্দদায়ক হতে পারে।`,
          supportingAnswer: answers[1]?.answer || 'পছন্দের উপহারের উত্তর',
          reasoning: 'পছন্দের উপহার অংশে ব্যক্তিগত স্পর্শযুক্ত উত্তর রয়েছে।',
          confidence: 'মাঝারি সম্ভাবনা (পরামর্শ)',
        },
      ],
      suggestedGifts: [
        {
          name: 'কাস্টমাইজড ফ্রেন্ডশিপ ফটোবুক বা মেমোরি কিট',
          reason: 'কাছের স্মৃতির প্রতিফলন হিসেবে বিশেষ আনন্দদায়ক হতে পারে।',
          supportingAnswer: answers[0]?.answer || 'পছন্দের উপহারের উত্তর',
        },
        {
          name: 'থার্মাল ট্রাভেল কফি মগ বা মেটালিক বুকমার্ক',
          reason: 'ভ্রমণ বা পড়ার সময়ে প্রতিদিন ব্যবহারযোগ্য উপহার।',
          supportingAnswer: answers[1]?.answer || 'উপহার ও শখের উত্তর',
        },
      ],
      friendshipTip: `টিপস: উপহার দেওয়ার আগে কোনো স্বাভাবিক আড্ডায় ${cleanName}-এর বর্তমান আগ্রহ জেনে নিন!`,
      demoNotice: 'ডেমো মোড: ব্যাকএন্ডে OPENAI_API_KEY কনফিগার করা না থাকায় এটি একটি ডেমো অ্যালগরিদম দিয়ে প্রস্তুত করা হয়েছে। লাইভ ChatGPT উত্তরের জন্য OPENAI_API_KEY কনফিগার করুন।',
    };
  }

  // --- Official OpenAI Dedicated Analysis Endpoint ---
  app.post('/api/openai/analyze', async (req, res) => {
    try {
      const { friendName, answers, voluntaryNotes } = req.body || {};
      const cleanName = (typeof friendName === 'string' && friendName.trim()) || 'বন্ধু';

      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({
          error: 'স্বেচ্ছায় শেয়ার করা উত্তরসমূহ প্রয়োজন।',
        });
      }

      const analysis = await generateAiFriendAnalysis(cleanName, answers, voluntaryNotes);
      return res.json(analysis);
    } catch (err: unknown) {
      console.error('OpenAI analyze error:', err);
      const errObj = err as { status?: number; message?: string };
      return res.status(errObj?.status || 500).json({
        error: `AI বিশ্লেষণে ত্রুটি: ${errObj?.message || 'সার্ভার সংযোগে ব্যর্থ'}`,
        details: errObj?.message,
      });
    }
  });

  // --- Official OpenAI Interactive ChatGPT Advisor Endpoint ---
  app.post('/api/openai/chat', async (req, res) => {
    try {
      const { message, friendName, context } = req.body || {};
      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'বার্তা বা প্রশ্ন প্রদান করুন।' });
      }

      const cleanFriend = (typeof friendName === 'string' && friendName.trim()) || 'বন্ধু';
      const openai = getOpenAIClient();

      if (!openai) {
        return res.json({
          reply: `[ডেমো মোড] ${cleanFriend}-এর জন্য আপনার প্রশ্নের উত্তর:\n\n"${message.trim()}" বিষয়ে বন্ধুত্বের সবচেয়ে সেরা টিপস হলো আন্তরিক অনুভূতি। যেকোনো উপহারের সাথে একটি হাতে লেখা চিরকুট যোগ করলে তা অনেক বেশি হৃদয়গ্রাহী হয়।\n\n(লাইভ OpenAI ChatGPT উত্তরের জন্য ব্যাকএন্ডে OPENAI_API_KEY কনফিগার করুন)`,
          mode: 'demo_mode',
          providerName: 'OpenAI ChatGPT (ডেমো মোড)',
        });
      }

      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: `You are WishReveal Ai's helpful, polite, and culturally aware ChatGPT friendship advisor.
Answer in warm, thoughtful, natural Bengali.
Be creative, empathetic, and practical. Provide helpful suggestions for gifts, birthday greetings, or fun hangout ideas.
${cleanFriend ? `The user is asking about their friend "${cleanFriend}".` : ''}
${context ? `Context about friend's preferences: ${context}` : ''}
Rules:
1. Always be polite, positive, and thoughtful.
2. Focus on meaningful gestures, budget-friendly ideas, and healthy friendship.
3. Keep the response concise, clear, and easy to read (max 2-3 short paragraphs or clean bullet points).`,
          },
          {
            role: 'user',
            content: message.trim(),
          },
        ],
        temperature: 0.7,
        max_tokens: 600,
      });

      const reply = completion.choices[0]?.message?.content?.trim() || 'কোনো উত্তর পাওয়া যায়নি।';
      return res.json({
        reply,
        mode: 'real_ai',
        providerName: `OpenAI ChatGPT (${model})`,
      });
    } catch (err: unknown) {
      console.error('OpenAI chat error:', err);
      const errObj = err as { status?: number; message?: string };
      return res.status(errObj?.status || 500).json({
        error: `OpenAI ChatGPT ত্রুটি: ${errObj?.message || 'ChatGPT সার্ভারের সাথে যোগাযোগে ব্যর্থ'}`,
        details: errObj?.message,
      });
    }
  });

  // --- General AI Analysis Endpoint (Connects to OpenAI ChatGPT) ---
  app.post('/api/analyze-friend-wishes', async (req, res) => {
    try {
      const { friendName, answers, voluntaryNotes } = req.body || {};
      const cleanName = (typeof friendName === 'string' && friendName.trim()) || 'বন্ধু';

      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({
          error: 'স্বেচ্ছায় শেয়ার করা উত্তরসমূহ প্রয়োজন।',
        });
      }

      const analysis = await generateAiFriendAnalysis(cleanName, answers, voluntaryNotes);
      return res.json(analysis);
    } catch (err: unknown) {
      console.error('AI error:', err);
      const errObj = err as { status?: number; message?: string };
      return res.status(errObj?.status || 500).json({
        error: `AI বিশ্লেষণে ত্রুটি: ${errObj?.message || 'সার্ভার সংযোগে ব্যর্থ'}`,
        details: errObj?.message,
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'MY_OPENAI_API_KEY');
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    res.json({
      status: 'ok',
      hasOpenAiKey,
      openAiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      hasApiKey: hasOpenAiKey || hasGeminiKey,
    });
  });

  // Vite middleware in dev or static files in production
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WishReveal Ai backend server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
