/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VoluntaryAnswer {
  category: string;
  categoryIcon?: string;
  answer: string;
}

export interface AnalysisRequest {
  friendName: string;
  answers: VoluntaryAnswer[];
  voluntaryNotes?: string;
}

export interface SuggestionItem {
  title: string;
  category: string;
  description: string;
  supportingAnswer: string;
  reasoning: string;
  confidence: string;
}

export interface SuggestedGiftItem {
  name: string;
  reason: string;
  supportingAnswer: string;
}

export interface AnalysisResult {
  mode: 'real_ai' | 'demo_mode';
  providerName: string;
  friendName: string;
  summary: string;
  uncertaintyStatement: string;
  suggestions: SuggestionItem[];
  suggestedGifts: SuggestedGiftItem[];
  friendshipTip: string;
  demoNotice?: string;
}

/**
 * Intelligent client-side demo analyzer used ONLY when no backend / API is connected.
 * Transparently labeled as demo mode so the app never falsely claims real AI was used.
 */
function generateDemoAnalysis(req: AnalysisRequest): AnalysisResult {
  const { friendName, answers, voluntaryNotes } = req;
  const name = friendName.trim() || 'আপনার বন্ধু';

  // Analyze themes from selected answers
  const answerTexts = answers.map((a) => a.answer.toLowerCase()).join(' ') + ' ' + (voluntaryNotes || '').toLowerCase();

  const isNatureTravel = answerTexts.includes('পাহাড়') || answerTexts.includes('সমুদ্র') || answerTexts.includes('ভ্রমণ') || answerTexts.includes('প্রকৃতি') || answerTexts.includes('কুয়াশা') || answerTexts.includes('চেরি');
  const isTechGaming = answerTexts.includes('গেম') || answerTexts.includes('গ্যাজেট') || answerTexts.includes('টেক') || answerTexts.includes('হেডসেট') || answerTexts.includes('কম্পিউটার');
  const isCreativeLiterature = answerTexts.includes('বই') || answerTexts.includes('ডায়েরি') || answerTexts.includes('চিঠি') || answerTexts.includes('আর্ট') || answerTexts.includes('ছবি আঁকা') || answerTexts.includes('ফটোগ্রাফি');
  const isMusicSocial = answerTexts.includes('গান') || answerTexts.includes('কনসার্ট') || answerTexts.includes('আড্ডা') || answerTexts.includes('খাবার') || answerTexts.includes('সিনেমা');

  const suggestions: SuggestionItem[] = [];
  const suggestedGifts: SuggestedGiftItem[] = [];

  // Find supporting answers
  const travelAns = answers.find(a => a.category.includes('ভ্রমণ') || a.answer.includes('পাহাড়') || a.answer.includes('সমুদ্র'))?.answer || 'প্রকৃতি ও ভ্রমণ পছন্দ';
  const hobbyAns = answers.find(a => a.category.includes('শখ') || a.category.includes('অবসর'))?.answer || 'অবসরের শখ পছন্দ';
  const giftAns = answers.find(a => a.category.includes('উপহার'))?.answer || 'উপহারের ধরণ পছন্দ';
  const dreamAns = answers.find(a => a.category.includes('স্বপ্ন'))?.answer || 'জীবনের স্বপ্ন নির্বাচন';

  if (isNatureTravel) {
    suggestions.push({
      title: 'প্রাকৃতিক ও মুক্ত পরিবেশে ভ্রমণের প্রতি আগ্রহ',
      category: 'শখ ও আগ্রহ',
      description: `${name}-এর দেওয়া উত্তরে প্রকৃতি, পাহাড়ি পরিবেশ বা খোলা সৈকতের প্রতি ভালো লাগা লক্ষ্য করা গেছে। তিনি চার দেয়ালের চেয়ে মুক্ত প্রকৃতির সান্নিধ্যে মানসিক শান্তি খুঁজে পাওয়ার সম্ভাবনা রয়েছে।`,
      supportingAnswer: travelAns,
      reasoning: 'ব্যবহারকারী স্বেচ্ছায় ভ্রমণ বিষয়ক প্রশ্নে পাহাড়ি কুয়াশা বা প্রাকৃতিক দৃশ্যপট নির্বাচন করেছেন।',
      confidence: 'উচ্চ সম্ভাবনা (অনুমান)',
    });
    suggestedGifts.push({
      name: 'ক্যাম্পিং থার্মাল ফ্লাস্ক বা মেটালিক ট্রাভেল বটল',
      reason: 'ভ্রমণকালে সহজে উষ্ণ চা বা পানি বহনের জন্য এটি বেশ উপযোগী হতে পারে।',
      supportingAnswer: travelAns,
    });
  }

  if (isTechGaming) {
    suggestions.push({
      title: 'আধুনিক প্রযুক্তি ও ইন্টারেক্টিভ গ্যাজেটে স্বাচ্ছন্দ্য',
      category: 'শখ ও আগ্রহ',
      description: `${name} দৈনন্দিন জীবনে ডিজিটাল টুলস, স্মার্ট অ্যাক্সেসরিজ বা বন্ধুদের সাথে কো-অপ গেমিং সেশন পছন্দ করতে পারেন। এটি তার কর্মচঞ্চল ও আধুনিক দৃষ্টিভঙ্গির প্রতিফলন হতে পারে।`,
      supportingAnswer: hobbyAns,
      reasoning: 'শখ ও উপহারের অপশনে আধুনিক গ্যাজেট বা গেমিং এক্সেসরিজ সম্পর্কিত উত্তর নির্বাচন করা হয়েছে।',
      confidence: 'মাঝারি সম্ভাবনা (অনুমান)',
    });
    suggestedGifts.push({
      name: 'কম্প্যাক্ট ওয়্যারলেস পাওয়ার ব্যাংক বা প্রিমিয়াম ডেস্ক প্যাড',
      reason: 'দৈনন্দিন ডিভাইস ব্যবহারকে আরও স্বাচ্ছন্দ্যময় ও গোছানো করতে সহায়তা করতে পারে।',
      supportingAnswer: giftAns,
    });
  }

  if (isCreativeLiterature) {
    suggestions.push({
      title: 'ভাবুক মনন ও গভীর আবেগমাখা স্মৃতিকে মূল্যায়ন',
      category: 'উপহার ও রুচি',
      description: `${name} চাকচিক্যময় দামি উপহারের চেয়ে আন্তরিক ভালোবাসা, হাতে লেখা চিঠি বা সৃজনশীল শিল্পকে বেশি মূল্যবান মনে করার সম্ভাবনা রয়েছে।`,
      supportingAnswer: giftAns,
      reasoning: 'উপহার বা স্বপ্নের প্রশ্নে বই, চিঠি বা স্মারক জাতীয় অপশন স্বেচ্ছায় নির্বাচন করা হয়েছে।',
      confidence: 'উচ্চ সম্ভাবনা (অনুমান)',
    });
    suggestedGifts.push({
      name: 'হাতে লেখা আন্তরিক ফ্রেন্ডশিপ কার্ড ও মেটালিক বুকমার্ক',
      reason: 'বই পড়ার অভ্যাস ও মানসিক গভীরতার সাথে এই উপহারটি সবচেয়ে নিখুঁতভাবে মানানসই হতে পারে।',
      supportingAnswer: giftAns,
    });
  }

  if (isMusicSocial || suggestions.length < 2) {
    suggestions.push({
      title: 'বন্ধুদের সাথে গুণগত সময় ও আন্তরিক আড্ডা উপভোগ',
      category: 'বন্ধুত্বের মুহূর্ত',
      description: `${name}-এর জন্য একান্তে দীর্ঘ আলোচনা, চা-কফি পানের আড্ডা বা একসাথে প্রিয় কোনো গান ও মুভি দেখার অভিজ্ঞতা একটি প্রিয় মুহূর্ত হতে পারে।`,
      supportingAnswer: dreamAns,
      reasoning: 'আড্ডা ও জীবনের স্বপ্নের অংশে পারস্পরিক সম্পর্ক ও সুখের স্মৃতিকে অগ্রাধিকার দেওয়া হয়েছে।',
      confidence: 'মাঝারি সম্ভাবনা (অনুমান)',
    });
    suggestedGifts.push({
      name: 'প্রিয় ক্যাফেতে সারপ্রাইজ কফি ডে-আউট বা কিউরেটেড মিউজিক মেমোরি বক্স',
      reason: 'বস্তুগত উপহারের চেয়ে একসাথে কাটানো সময় বন্ধুত্বকে আরও সতেজ করতে পারে।',
      supportingAnswer: dreamAns,
    });
  }

  return {
    mode: 'demo_mode',
    providerName: 'WishReveal রুল-বেসড প্যাটার্ন ইঞ্জিন (ডেমো মোড)',
    friendName: name,
    summary: `${name}-এর স্বেচ্ছায় শেয়ার করা উত্তরগুলো পর্যালোচনা করে দেখা যাচ্ছে, তিনি প্রাকৃতিক সৌন্দর্য, চিন্তাশীল মুহূর্ত ও আন্তরিক স্মৃতিকে গুরুত্ব দেন। এটি কোনো মন পড়ার তথ্য নয়, বরং শেয়ারকৃত উত্তরের সুন্দর একটি সমন্বয়।`,
    uncertaintyStatement: 'সতর্কতা: এই ফলাফলগুলো নিশ্চিত সত্য নয়, শুধুই বন্ধুত্বপূর্ণ অনুমান ও আইডিয়া। মানুষের আসল পছন্দ সময়ের সাথে পরিবর্তিত হতে পারে।',
    suggestions,
    suggestedGifts,
    friendshipTip: `টিপস: উপহার চূড়ান্ত করার আগে কোনো স্বাভাবিক আড্ডায় হালকাভাবে ${name}-এর বর্তমান আগ্রহ বা প্রয়োজনের কথা জেনে নেওয়া সবচেয়ে বুদ্ধিমানের কাজ হবে!`,
    demoNotice: 'ডেমো মোড: ব্যাকএন্ড সার্ভার বা লাইভ এআই কী অনুপলব্ধ থাকায় এটি একটি স্থানীয় ডেমো অ্যালগরিদম দিয়ে প্রস্তুত করা হয়েছে। কোনো ভুয়া বাস্তব AI দাবি করা হচ্ছে না।',
  };
}

/**
 * Service function to request AI analysis from the OpenAI-powered backend.
 * First calls the backend proxy route /api/analyze-friend-wishes (or /api/openai/analyze).
 * Propagates server errors so the UI can display friendly error handling and a retry option.
 */
export async function analyzeFriendWishes(
  req: AnalysisRequest,
  options?: { fallbackToDemoOnError?: boolean }
): Promise<AnalysisResult> {
  try {
    const res = await fetch('/api/analyze-friend-wishes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage = data?.error || `সার্ভার ত্রুটি (${res.status}): AI বিশ্লেষণ সম্পন্ন করা যায়নি।`;
      if (options?.fallbackToDemoOnError) {
        return generateDemoAnalysis(req);
      }
      throw new Error(errorMessage);
    }

    if (data && data.suggestions && Array.isArray(data.suggestions)) {
      return {
        mode: data.mode === 'real_ai' ? 'real_ai' : 'demo_mode',
        providerName: data.providerName || (data.mode === 'real_ai' ? 'OpenAI ChatGPT' : 'WishReveal ডেমো মোড'),
        friendName: data.friendName || req.friendName,
        summary: data.summary,
        uncertaintyStatement: data.uncertaintyStatement || 'এটি কেবল সম্ভাব্য পরামর্শ, নিশ্চিত সত্য নয়।',
        suggestions: data.suggestions,
        suggestedGifts: data.suggestedGifts || [],
        friendshipTip: data.friendshipTip || 'বন্ধুর সাথে খোলামেলা আড্ডা দিয়ে পছন্দের সত্যতা যাচাই করে নিন।',
        demoNotice: data.demoNotice,
      };
    }

    throw new Error('AI ফলাফল থেকে সঠিক তথ্য পাওয়া যায়নি।');
  } catch (err: unknown) {
    if (options?.fallbackToDemoOnError) {
      return generateDemoAnalysis(req);
    }
    throw err;
  }
}

/**
 * Interactive ChatGPT friendship and gifting advisor.
 * Connects securely to the backend /api/openai/chat endpoint.
 */
export async function askOpenAiFriendAdvisor(
  message: string,
  friendName?: string,
  context?: string
): Promise<{ reply: string; mode: 'real_ai' | 'demo_mode'; providerName: string }> {
  const res = await fetch('/api/openai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, friendName, context }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || `ChatGPT সংযোগে সমস্যা হয়েছে (${res.status})।`);
  }

  return {
    reply: data.reply || 'কোনো পরামর্শ পাওয়া যায়নি।',
    mode: data.mode === 'real_ai' ? 'real_ai' : 'demo_mode',
    providerName: data.providerName || 'OpenAI ChatGPT',
  };
}

export { generateDemoAnalysis };

