/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  User,
  Quiz,
  QuizResponse,
  Wish,
  UserPrivacySettings,
  BackendStatus,
  OpenAiStatusResponse,
  OpenAiChatResponse,
} from '../types/backend';

const AUTH_TOKEN_KEY = 'wishreveal_auth_token';
const AUTH_USER_KEY = 'wishreveal_auth_user';

class ApiClient {
  private token: string | null = null;
  private currentUser: User | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
        const storedUser = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY);
        if (storedUser) {
          this.currentUser = JSON.parse(storedUser);
        }
      } catch {
        // Storage unavailable
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public setSession(token: string, user: User, remember: boolean = true) {
    this.token = token;
    this.currentUser = user;
    try {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(AUTH_TOKEN_KEY, token);
      storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch {
      // Storage unavailable
    }
  }

  public clearSession() {
    this.token = null;
    this.currentUser = null;
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(AUTH_USER_KEY);
    } catch {
      // Storage unavailable
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.error || data?.message || `অনুরোধ ব্যর্থ হয়েছে (${response.status})`;
      throw new Error(errorMsg);
    }

    return data as T;
  }

  // --- Backend Status ---
  public async getBackendStatus(): Promise<BackendStatus> {
    try {
      return await this.request<BackendStatus>('/api/backend-status');
    } catch {
      return {
        isConfigured: false,
        storageType: 'in_memory_development',
        message: 'ব্যাকএন্ড সার্ভারের সাথে সংযোগ পাওয়া যায়নি।',
        hasOpenAiKey: false,
        hasGeminiKey: false,
        activeUsersCount: 0,
      };
    }
  }

  // --- Auth Endpoints ---
  public async register(payload: { name: string; email: string; password: string }): Promise<{ user: User; token: string }> {
    const result = await this.request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.setSession(result.token, result.user);
    return result;
  }

  public async login(payload: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const result = await this.request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.setSession(result.token, result.user);
    return result;
  }

  public async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } finally {
      this.clearSession();
    }
  }

  public async getMe(): Promise<User> {
    const user = await this.request<User>('/api/auth/me');
    this.currentUser = user;
    return user;
  }

  public async deleteAccount(confirmText: string): Promise<void> {
    await this.request('/api/auth/delete-account', {
      method: 'DELETE',
      body: JSON.stringify({ confirmText }),
    });
    this.clearSession();
  }

  // --- Privacy Settings ---
  public async updatePrivacySettings(settings: Partial<UserPrivacySettings>): Promise<UserPrivacySettings> {
    const updated = await this.request<UserPrivacySettings>('/api/user/privacy', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    if (this.currentUser) {
      this.currentUser.privacySettings = updated;
    }
    return updated;
  }

  public async exportUserData(): Promise<{ user: User; quizzes: Quiz[]; wishes: Wish[] }> {
    return await this.request<{ user: User; quizzes: Quiz[]; wishes: Wish[] }>('/api/user/export-data');
  }

  // --- Quiz Management ---
  public async createQuiz(quiz: Omit<Quiz, 'id' | 'creatorId' | 'creatorName' | 'createdAt' | 'shareToken'>): Promise<Quiz> {
    return await this.request<Quiz>('/api/quizzes', {
      method: 'POST',
      body: JSON.stringify(quiz),
    });
  }

  public async getMyQuizzes(): Promise<Quiz[]> {
    return await this.request<Quiz[]>('/api/quizzes/my');
  }

  public async getQuizByShareToken(shareToken: string): Promise<Quiz> {
    return await this.request<Quiz>(`/api/quizzes/public/${shareToken}`);
  }

  public async deleteQuiz(quizId: string): Promise<void> {
    await this.request(`/api/quizzes/${quizId}`, {
      method: 'DELETE',
    });
  }

  // --- Quiz Response Submission (Public with Share Token) ---
  public async submitQuizResponse(
    shareToken: string,
    payload: {
      respondentName: string;
      respondentConsentGiven: boolean;
      answers: Array<{ questionId: string; questionText: string; category: string; selectedOption: string }>;
      voluntaryNote?: string;
    }
  ): Promise<{ responseId: string; message: string }> {
    return await this.request<{ responseId: string; message: string }>(`/api/quizzes/public/${shareToken}/respond`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // --- Authorized Viewing of Quiz Responses ---
  public async getQuizResponses(quizId: string): Promise<QuizResponse[]> {
    return await this.request<QuizResponse[]>(`/api/quizzes/${quizId}/responses`);
  }

  // --- Wishes Management ---
  public async getWishes(): Promise<Wish[]> {
    return await this.request<Wish[]>('/api/wishes');
  }

  public async createWish(wish: { text: string; category: string; isLocked?: boolean; isPrivate?: boolean }): Promise<Wish> {
    return await this.request<Wish>('/api/wishes', {
      method: 'POST',
      body: JSON.stringify(wish),
    });
  }

  public async deleteWish(wishId: string): Promise<void> {
    await this.request(`/api/wishes/${wishId}`, {
      method: 'DELETE',
    });
  }

  // --- OpenAI ChatGPT Endpoints ---
  public async getOpenAiStatus(): Promise<OpenAiStatusResponse> {
    try {
      return await this.request<OpenAiStatusResponse>('/api/openai/status');
    } catch {
      return {
        isConfigured: false,
        provider: 'OpenAI ChatGPT',
        model: 'gpt-4o-mini',
        status: 'unconfigured_demo',
        message: 'OpenAI ব্যাকএন্ড স্ট্যাটাস লোড করা সম্ভব হয়নি।',
      };
    }
  }

  public async askOpenAiChat(payload: { message: string; friendName?: string; context?: string }): Promise<OpenAiChatResponse> {
    return await this.request<OpenAiChatResponse>('/api/openai/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const api = new ApiClient();
