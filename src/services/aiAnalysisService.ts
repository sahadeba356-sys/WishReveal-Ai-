/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FriendQuizSubmission {
  friendName: string;
  travelAnswer?: string;
  hobbyAnswer?: string;
  giftAnswer?: string;
  hangoutAnswer?: string;
  dreamAnswer?: string;
  voluntaryNotes?: string;
}

export interface SupportedSuggestion {
  title: string;
  description: string;
  supportedBy: string;
  confidenceLabel: 'উচ্চ সম্ভাবনা (পরামর্শ)' | 'মাঝারি সম্ভাবনা (পরামর্শ)' | 'সম্ভাব্য আইডিয়া';
}

export interface AiAnalysisResult {
  summaryFriendlyText: string;
  archetypeTag: string;
  confidenceOverall: string;
  isDemoMode: boolean;
  providerInfo: string;
  suggestions: {
    interests: SupportedSuggestion[];
    gifts: SupportedSuggestion[];
    activities: SupportedSuggestion[];
  };
  ethicalNotice: string;
}

export async function analyzeFriendshipAnswers(
  submission: FriendQuizSubmission,
  apiEndpoint?: string
): Promise<AiAnalysisResult> {
  if (apiEndpoint) {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      if (response.ok) {
        return (await response.json()) as AiAnalysisResult;
      }
    } catch {
      // Fallback
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  const friendName = submission.friendName.trim() || 'আপনার বন্ধু';
  const travel = submission.travelAnswer || '';
  const hobby = submission.hobbyAnswer || '';
  const gift = submission.giftAnswer || '';
  const hangout = submission.hangoutAnswer || '';
  const dream = submission.dreamAnswer || '';

  let archetype = 'আন্তরিক ও স্মৃতিপ্রেমী বন্ধু';
  if (travel.includes('পাহাড়') || dream.includes('শান্ত') || travel.includes('প্রকৃতি')) {
    archetype = 'শান্তপ্রকৃতির অনুভূতিশীল মন';
  } else if (hobby.includes('গেম') || gift.includes('গ্যাজেট') || hobby.includes('টেক')) {
    archetype = 'আধুনিক টেক ও ক্রিয়েটিভ মন';
  } else if (travel.includes('সমুদ্র') || dream.includes('পৃথিবী') || travel.includes('অ্যাডভেঞ্চার')) {
    archetype = 'রোমাঞ্চপ্রিয় ও মুক্ত বিহঙ্গ';
  } else if (hobby.includes('বই') || gift.includes('চিঠি') || hobby.includes('আঁকা')) {
    archetype = 'রুচিশীল ও সাহিত্যপ্রেমী মন';
  }

  const interests: SupportedSuggestion[] = [];
  const gifts: SupportedSuggestion[] = [];
  const activities: SupportedSuggestion[] = [];

  if (travel) {
    interests.push({
      title: travel.includes('পাহাড়')
        ? 'শান্ত পাহাড়ি পরিবেশ ও প্রাকৃতিক নিস্তব্ধতা'
        : travel.includes('সমুদ্র')
        ? 'উন্মুক্ত সমুদ্রের বাতাস ও রোমাঞ্চকর ট্রিপ'
        : travel.includes('জাপান')
        ? 'ঐতিহ্যবাহী সংস্কৃতি, নান্দনিক স্থাপত্য ও চেরি ব্লসম'
        : 'শহরের ক্যাফে সংস্কৃতি ও শৈল্পিক পরিবেশ',
      description: `বন্ধুর দেওয়া ভ্রমণ উত্তর অনুযায়ী তিনি এই ধরনের আবহে মানসিক স্বস্তি বোধ করতে পারেন।`,
      supportedBy: `ভ্রমণ উত্তর: "${travel}"`,
      confidenceLabel: 'উচ্চ সম্ভাবনা (পরামর্শ)',
    });
  }

  if (hobby) {
    interests.push({
      title: hobby.includes('বই')
        ? 'সাহিত্য, ডায়েরি লেখা ও ব্যক্তিগত চিন্তা'
        : hobby.includes('গেম')
        ? 'গেমিং, ইন্টারঅ্যাক্টিভ মিডিয়া ও ডিজিটাল প্রযুক্তি'
        : hobby.includes('আঁকা')
        ? 'ভিজ্যুয়াল আর্ট, ফটোগ্রাফি ও সৃজনশীল ডিজাইন'
        : 'সঙ্গীত উপভোগ, সুর ও নতুন রেসিপি ট্রাই করা',
      description: `অবসর কাটানোর প্রশ্নের ভিত্তিতে তার এই বিশেষ শখের দিকে স্বাভাবিক ঝোঁক রয়েছে।`,
      supportedBy: `শখ ও অবসর উত্তর: "${hobby}"`,
      confidenceLabel: 'উচ্চ সম্ভাবনা (পরামর্শ)',
    });
  }

  if (gift) {
    gifts.push({
      title: gift.includes('চিঠি')
        ? 'হাতে লেখা আন্তরিক ফ্রেন্ডশিপ চিঠি ও স্মারক ফটোফ্রেম'
        : gift.includes('গ্যাজেট')
        ? 'প্রয়োজনীয় স্মার্ট টেক গ্যাজেট বা ওয়্যারলেস এক্সেসরিজ'
        : gift.includes('চকোলেট')
        ? 'আর্টিশানাল ডার্ক চকোলেট ও সুবাসিত ক্যান্ডেল বক্স'
        : 'একসাথে কোনো প্রিয় কনসার্ট বা অ্যামিউজমেন্ট ডে-আউট পাস',
      description: `উপহারের প্রশ্নের উত্তরে বন্ধু সরাসরি এমন ক্যাটাগরি পছন্দ করেছেন বলে এটি প্রস্তাবিত।`,
      supportedBy: `উপহারের ধরন উত্তর: "${gift}"`,
      confidenceLabel: 'উচ্চ সম্ভাবনা (পরামর্শ)',
    });
  }

  if (hangout) {
    activities.push({
      title: hangout.includes('রাত জেগে')
        ? 'নিরিবিলি ছাদ বা বারান্দায় চা-কফি সহযোগে মন খুলে আড্ডা'
        : hangout.includes('স্ট্রিট ফুড')
        ? 'জনপ্রিয় স্ট্রিট ফুড বা ক্যাফেতে ফুড ক্রল'
        : hangout.includes('সিনেমা')
        ? 'একসাথে পপকর্ন নিয়ে প্রিয় কোনো সিনেমার স্পেশাল স্ক্রিনিং নাইট'
        : 'ব্যস্ততার মাঝেও একে অপরের খবরাখবর নেওয়া ও পাশে থাকা',
      description: `বন্ধুর সাথে কাটানো প্রিয় মুহূর্তের পছন্দের ওপর ভিত্তি করে এই অ্যাক্টিভিটি প্রস্তাবিত।`,
      supportedBy: `আড্ডার ধরন উত্তর: "${hangout}"`,
      confidenceLabel: 'উচ্চ সম্ভাবনা (পরামর্শ)',
    });
  }

  const summaryFriendlyText = `আপনার দেওয়া উত্তরগুলো পর্যবেক্ষণ করে বোঝা যাচ্ছে ${friendName} অত্যন্ত আন্তরিক ও রুচিশীল একজন মানুষ। ` +
    (travel ? `ভ্রমণের ক্ষেত্রে ${travel.split(',')[0]} তার বিশেষ আগ্রহ নির্দেশ করে। ` : '') +
    (gift ? `উপহারের ব্যাপারে ${gift.split(' ')[0]} জাতীয় বিষয়ের প্রতি তার স্বাভাবিক টান প্রকাশ পেয়েছে। ` : '') +
    `মনে রাখবেন, এগুলো শুধুই বন্ধুকে চমকে দেওয়ার ও খুশি করার আইডিয়া মাত্র—কোনো চূড়ান্ত বা নিশ্চিত দাবি নয়।`;

  return {
    summaryFriendlyText,
    archetypeTag: archetype,
    confidenceOverall: 'মাঝারি থেকে উচ্চ (উত্তরের সংখ্যার ওপর নির্ভরশীল)',
    isDemoMode: true,
    providerInfo: 'ডেমো মোড: লোকাল রুল-বেসড এনালাইজার',
    suggestions: {
      interests,
      gifts,
      activities,
    },
    ethicalNotice:
      'এই বিশ্লেষণটি শুধুমাত্র বন্ধুর স্বেচ্ছায় দেওয়া উত্তরের ওপর ভিত্তি করে তৈরি। এটি কোনো গোপন মনস্তাত্ত্বিক সত্য বা অবচেতন মনের ইচ্ছা দাবি করে না।',
  };
}
