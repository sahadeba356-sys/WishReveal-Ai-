export type Language = 'bn' | 'en';

export interface QuizQuestionItem {
  id: number;
  title: string;
  category: string;
  question: string;
  options: { text: string; category: string }[];
}

export const translations = {
  bn: {
    // Brand & Header
    appName: 'WishReveal',
    appAiBadge: 'Ai',
    appSubtitle: 'বন্ধুর মনের ইচ্ছা ও ড্রিম কুইজ',
    navHome: 'হোম',
    navFeatures: 'ফিচারসমূহ',
    navHow: 'কিভাবে কাজ করে',
    navOpenAiStatus: 'OpenAI স্ট্যাটাস',
    navAiAnalysis: 'AI এনালাইসিস',
    navWishBox: 'উইশ বক্স',
    navLogin: 'লগইন',
    navLogout: 'লগআউট',
    navStartQuiz: 'কুইজ শুরু করুন',
    navDashboard: 'ড্যাশবোর্ড',
    navLoginRegister: 'লগইন / রেজিস্টার',
    navOpenAiConfig: 'OpenAI ChatGPT কনফিগারেশন',
    navMenuOpen: 'মেনু খুলুন',
    langToggleLabel: 'Language',
    langBengali: 'বাংলা',
    langEnglish: 'English',

    // Hero Section
    heroBadge: 'AI-চালিত ফ্রেন্ডশিপ ও সারপ্রাইজ উইশ প্ল্যাটফর্ম',
    heroTitlePrefix: 'বন্ধু না বললেও তার',
    heroTitleHighlight: 'মনের ইচ্ছা',
    heroTitleSuffix: 'জানার সবচেয়ে মিষ্টি মাধ্যম ✨',
    heroDescription:
      'মজার ড্রিম কুইজের মাধ্যমে বন্ধুদের সাথে শেয়ার করুন আপনার পছন্দের উপহার, ভ্রমণের স্বপ্ন ও প্রিয় মুহূর্ত। OpenAI ChatGPT দিয়ে স্বেচ্ছায় শেয়ার করা উত্তর থেকে বুঝে নিন পারফেক্ট উপহার ও আন্তরিক আইডিয়া।',
    heroStartBtn: 'এখনই শুরু করুন',
    heroAiBtn: 'AI দিয়ে পছন্দ বুঝুন',
    heroFeature1: '১০০% সম্মতির ভিত্তিতে তৈরি',
    heroFeature2: 'ব্যক্তিগত উপহার সুপারিশ',
    heroFeature3: 'নিরাপদ ও গোপনীয়তা বান্ধব',

    // Features Section
    featuresBadge: 'কেন WishReveal Ai?',
    featuresTitle: 'বন্ধুত্বকে আরও বিশেষ ও স্মৃতিময় করার স্মার্ট ফিচারসমূহ',
    featuresSubtitle: 'উপহার বাছাইয়ে দ্বিধা দূর করুন এবং বন্ধুকে দিন তার হৃদয়ের সবচেয়ে কাঙ্ক্ষিত সারপ্রাইজ।',
    featureQuizTitle: 'ড্রিম উইশ কুইজ',
    featureQuizDesc: 'ভ্রমণ, শখ, প্রিয় খাবার ও পছন্দের উপহার সম্পর্কিত ৫টি আকর্ষণীয় প্রশ্নের সমন্বয়ে তৈরি রোমাঞ্চকর কুইজ।',
    featureQuizBtn: 'কুইজ খেলুন',
    featureQuizTag: 'কোর ফিচার',
    featureAiTitle: 'OpenAI ChatGPT এনালাইসিস',
    featureAiDesc: 'স্বেচ্ছায় শেয়ার করা উত্তরের প্রাসঙ্গিকতা বিশ্লেষণ করে তৈরি হয় উপহারের সেরা আইডিয়া ও আন্তরিক বন্ধুত্বের টিপস।',
    featureAiBtn: 'বিশ্লেষণ করুন',
    featureAiTag: 'AI পাওয়ারড',
    featureWishTitle: 'সিক্রেট উইশ বক্স',
    featureWishDesc: 'নিজের মনের অব্যক্ত ইচ্ছা বা জীবনের লালিত স্বপ্ন নিরাপদে লিখে রাখুন। এটি সম্পূর্ণ ব্যক্তিগত ও সুরক্ষিত।',
    featureWishBtn: 'ইচ্ছা লিখুন',
    featureWishTag: 'প্রাইভেট স্টোরেজ',
    featureShareTitle: 'ফ্রেন্ডশিপ শেয়ার লিংক',
    featureShareDesc: 'আপনার তৈরি কুইজের ইউনিক লিংক পাঠিয়ে দিন বন্ধুদের ইনবক্সে এবং জেনে নিন তাদের মজার পছন্দের তালিকা।',
    featureShareBtn: 'লিংক পান',
    featureShareTag: 'সোশ্যাল শেয়ার',

    // How It Works
    howBadge: 'সহজ ৪ ধাপ',
    howTitle: 'কিভাবে কাজ করে WishReveal Ai?',
    howSubtitle: 'স্বচ্ছতা ও সম্মতির ভিত্তিতে তৈরি একটি সহজ ও মজাদার উপহার প্ল্যানিং জার্নি।',
    step1Title: 'কুইজ খেলুন বা তৈরি করুন',
    step1Desc: 'ভ্রমণ, পছন্দের উপহার, শখ ও স্বপ্নের ওপর ভিত্তি করে সহজ ও অর্থপূর্ণ প্রশ্নগুলোর উত্তর নির্বাচন করুন।',
    step2Title: 'বন্ধুর সাথে শেয়ার করুন',
    step2Desc: 'কুইজ শেষের ইউনিক লিংকটি বন্ধুর সাথে শেয়ার করুন। বন্ধু তার নিজের পছন্দ স্বেচ্ছায় জানিয়ে উত্তর সাবমিট করবে।',
    step3Title: 'AI দিয়ে সঠিক উপহার বুঝুন',
    step3Desc: 'OpenAI ChatGPT উত্তরের প্যাটার্ন পর্যালোচনা করে জানাবে কোন উপহারটি সবচেয়ে নিখুঁত ও স্মৃতিময় হবে।',
    step4Title: 'পারফেক্ট সারপ্রাইজ দিন',
    step4Desc: 'কোনো দ্বিধা বা অপ্রাসঙ্গিক উপহার নয়—বন্ধুকে চমকে দিন এমন কিছু দিয়ে যা সে আসলেই মনে প্রাণে চেয়েছিল!',

    // CTA
    ctaTitle: 'আজই আপনার প্রিয় বন্ধুকে জানান সে আপনার জীবনে কতটা বিশেষ!',
    ctaSubtitle: 'একটি সুন্দর কুইজ বা ছোট্ট একটি চিরকুট হয়তো আপনাদের বন্ধুত্বের সবচেয়ে আনন্দদায়ক স্মৃতির সূচনা করবে।',
    ctaStartQuiz: 'কুইজ শুরু করুন',
    ctaWishBox: 'সিক্রেট উইশ বক্স',

    // Footer
    footerPrivacy: 'গোপনীয়তা নীতি',
    footerTerms: 'ব্যবহারের শর্তাবলী',
    footerContact: 'যোগাযোগ ও ফিডব্যাক',
    footerEthicalNotice:
      '⚠️ নৈতিকতার প্রতিশ্রুতি: WishReveal Ai কোনো অবচেতন চিন্তা বা মন পড়ার দাবি করে না। অ্যাপ্লিকেশনটির সমস্ত বিশ্লেষণ ও উপহার আইডিয়া ব্যবহারকারীর স্বেচ্ছায় ও সচেতনভাবে দেওয়া উত্তরের ওপর ভিত্তি করে OpenAI ChatGPT ইঞ্জিনের মাধ্যমে প্রস্তুত করা হয়।',
    footerCopyright: 'WishReveal Ai. সর্বস্বত্ব সংরক্ষিত।',
    footerCraftedWith: 'আন্তরিক ভালোবাসার সাথে নির্মিত বন্ধুদের জন্য',

    // Backend Banner
    backendReady: 'সিকিউর ব্যাকএন্ড রেডি',
    backendOpenAiConfigured: 'OpenAI সক্রিয়',
    backendOpenAiDemo: 'OpenAI রেডি (ডেমো মোড)',
    backendSubtitle: 'পাসওয়ার্ড হ্যাসড ও RBAC সিকিউরড | সার্ভার-সাইড OpenAI প্রক্সি সক্রিয়',
    backendApiKeySetup: 'API কী সেটআপ',
    backendDetails: 'বিস্তারিত',
    backendClose: 'সংক্ষেপ করুন',
    backendLoggedInWelcome: 'স্বাগতম',
    backendLoggedInSuffix: 'নিরাপদ অ্যাকাউন্টে যুক্ত আছেন 💖',
    backendMyDashboard: 'আমার ড্যাশবোর্ড',

    // Floating Cat Widget
    catTitle: 'Meow Reveal AI',
    catQuote: '“বন্ধুত্বের সবচেয়ে মিষ্টি অনুভূতি হলো যখন আপনি বিনা বলাতেই তার মনের ইচ্ছা বুঝতে পারেন!”',
    catHint: 'টিপস: নিজের ড্রিম উইশ লিখে রাখুন অথবা ফ্রেন্ডশিপ কুইজ পাঠিয়ে বন্ধুর পছন্দ জানুন!',
    catStartQuiz: 'কুইজ খেলুন',
    catWriteWish: 'উইশ লিখুন',

    // Common
    close: 'বন্ধ করুন',
    cancel: 'বাতিল',
    save: 'সংরক্ষণ',
    loading: 'লোড হচ্ছে...',
    retry: 'পুনরায় চেষ্টা করুন',
    copy: 'কপি করুন',
    copied: 'কপি হয়েছে!',
    delete: 'মুছে ফেলুন',
    edit: 'সম্পাদনা',
    submit: 'জমা দিন',
    success: 'সফল হয়েছে',
    error: 'ত্রুটি',
  },
  en: {
    // Brand & Header
    appName: 'WishReveal',
    appAiBadge: 'Ai',
    appSubtitle: "Friend's Desires & Dream Quiz",
    navHome: 'Home',
    navFeatures: 'Features',
    navHow: 'How It Works',
    navOpenAiStatus: 'OpenAI Status',
    navAiAnalysis: 'AI Analysis',
    navWishBox: 'Wish Box',
    navLogin: 'Login',
    navLogout: 'Logout',
    navStartQuiz: 'Start Quiz',
    navDashboard: 'Dashboard',
    navLoginRegister: 'Login / Register',
    navOpenAiConfig: 'OpenAI ChatGPT Config',
    navMenuOpen: 'Open Menu',
    langToggleLabel: 'Language',
    langBengali: 'বাংলা',
    langEnglish: 'English',

    // Hero Section
    heroBadge: 'AI-Powered Friendship & Surprise Wish Platform',
    heroTitlePrefix: 'The Sweetest Way to Know Your Friend’s',
    heroTitleHighlight: 'True Wishes',
    heroTitleSuffix: 'Even Before They Say ✨',
    heroDescription:
      'Share your favorite gifts, travel dreams, and cherished moments through fun dream quizzes. With OpenAI ChatGPT, discover perfect gift ideas and heartwarming suggestions from voluntarily shared answers.',
    heroStartBtn: 'Get Started Now',
    heroAiBtn: 'Understand Tastes with AI',
    heroFeature1: '100% Consent-Based',
    heroFeature2: 'Personalized Gift Suggestions',
    heroFeature3: 'Private & Secure',

    // Features Section
    featuresBadge: 'Why WishReveal Ai?',
    featuresTitle: 'Smart Features to Make Friendship More Special & Memorable',
    featuresSubtitle: 'Eliminate gift guesswork and give your friends the heartfelt surprises they truly cherish.',
    featureQuizTitle: 'Dream Wish Quiz',
    featureQuizDesc: 'A thrilling 5-question quiz exploring travel destinations, hobbies, comfort food, and ideal gift styles.',
    featureQuizBtn: 'Play Quiz',
    featureQuizTag: 'Core Feature',
    featureAiTitle: 'OpenAI ChatGPT Analysis',
    featureAiDesc: 'Analyzes voluntarily shared answers to discover personalized gift picks and thoughtful friendship tips.',
    featureAiBtn: 'Analyze Now',
    featureAiTag: 'AI Powered',
    featureWishTitle: 'Secret Wish Box',
    featureWishDesc: 'Securely write down your unspoken dreams and cherished wishes. Completely private and protected.',
    featureWishBtn: 'Write a Wish',
    featureWishTag: 'Private Storage',
    featureShareTitle: 'Friendship Share Link',
    featureShareDesc: 'Send your custom quiz link to friends and uncover their authentic preferences and wishlist favorites.',
    featureShareBtn: 'Get Link',
    featureShareTag: 'Social Share',

    // How It Works
    howBadge: 'Simple 4 Steps',
    howTitle: 'How Does WishReveal Ai Work?',
    howSubtitle: 'A delightful, consent-driven gift planning journey with zero guesswork.',
    step1Title: 'Take or Create a Quiz',
    step1Desc: 'Choose meaningful options covering travel dreams, comfort items, leisure habits, and heartfelt wishes.',
    step2Title: 'Share with Your Friend',
    step2Desc: 'Send your unique quiz link. Your friend willingly submits their genuine answers and preferences.',
    step3Title: 'Understand Gifts via AI',
    step3Desc: 'OpenAI ChatGPT reviews preference patterns to reveal the most memorable and thoughtful gift ideas.',
    step4Title: 'Give the Perfect Surprise',
    step4Desc: 'No awkward or redundant presents—surprise your friend with something they truly love and appreciate!',

    // CTA
    ctaTitle: 'Tell your best friend how special they are today!',
    ctaSubtitle: 'A sweet quiz or a thoughtful note could be the spark for your friendship’s happiest memory.',
    ctaStartQuiz: 'Start Quiz',
    ctaWishBox: 'Secret Wish Box',

    // Footer
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Service',
    footerContact: 'Contact & Feedback',
    footerEthicalNotice:
      '⚠️ Ethical Guarantee: WishReveal Ai makes no claims of reading minds or detecting unconscious thoughts. All analysis and gift ideas are generated via OpenAI ChatGPT based solely on answers consciously and voluntarily shared by users.',
    footerCopyright: 'WishReveal Ai. All rights reserved.',
    footerCraftedWith: 'Crafted with heartfelt love for friends',

    // Backend Banner
    backendReady: 'Secure Backend Ready',
    backendOpenAiConfigured: 'OpenAI Active',
    backendOpenAiDemo: 'OpenAI Ready (Demo Mode)',
    backendSubtitle: 'Password Hashed & RBAC Secured | Server-Side OpenAI Proxy Active',
    backendApiKeySetup: 'API Key Setup',
    backendDetails: 'Details',
    backendClose: 'Collapse',
    backendLoggedInWelcome: 'Welcome',
    backendLoggedInSuffix: 'Logged in to secure account 💖',
    backendMyDashboard: 'My Dashboard',

    // Floating Cat Widget
    catTitle: 'Meow Reveal AI',
    catQuote: '“The sweetest feeling in friendship is knowing what they love without them having to ask!”',
    catHint: 'Tip: Save your dream wishes in the Wish Box or share a quiz link with your best friend!',
    catStartQuiz: 'Take Quiz',
    catWriteWish: 'Write Wish',

    // Common
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    loading: 'Loading...',
    retry: 'Try Again',
    copy: 'Copy',
    copied: 'Copied!',
    delete: 'Delete',
    edit: 'Edit',
    submit: 'Submit',
    success: 'Success',
    error: 'Error',
  },
};

export const localizedQuizQuestions: Record<Language, QuizQuestionItem[]> = {
  bn: [
    {
      id: 1,
      title: 'ভ্রমণ ও প্রিয় পরিবেশ',
      category: 'ভ্রমণ ও প্রকৃতি',
      question: 'যদি আগামী ছুটিতে আপনাকে যেকোনো জায়গায় ঘুরতে যাওয়ার সুযোগ দেওয়া হয়, কোথায় যাবেন?',
      options: [
        { text: 'পাহাড়ের শান্ত কুয়াশা, সবুজ পাইন বন ও পাহাড়ি নদী', category: 'ভ্রমণ' },
        { text: 'সমুদ্রের উত্তাল নীল ঢেউ, শান্ত সৈকত ও সূর্যাস্ত', category: 'ভ্রমণ' },
        { text: 'জাপানের চেরি ব্লসম ও প্রাচীন ঐতিহ্যের ঐতিহাসিক শহর', category: 'ভ্রমণ' },
        { text: 'ইউরোপের নান্দনিক ক্যাফে, আর্ট গ্যালারি ও মিউজিয়াম', category: 'ভ্রমণ' },
      ],
    },
    {
      id: 2,
      title: 'অবসর সময় ও শখ',
      category: 'শখ ও অবসর',
      question: 'ছুটির দিনের অলস বিকেলে কোন কাজটি করলে আপনার মন সবচেয়ে বেশি সতেজ থাকে?',
      options: [
        { text: 'এক কাপ চা বা কফি নিয়ে প্রিয় বইয়ের পাতায় হারিয়ে যাওয়া', category: 'শখ' },
        { text: 'বন্ধুদের সাথে জমজমাট ভিডিও গেম খেলা বা টেক গ্যাজেট এক্সপ্লোর করা', category: 'শখ' },
        { text: 'ছবি আঁকা, ফটোগ্রাফি বা সৃজনশীল কোনো শিল্পচর্চা করা', category: 'শখ' },
        { text: 'হেডফোনে মন মাতানো গান শোনা অথবা রান্নার নতুন রেসিপি ট্রাই করা', category: 'শখ' },
      ],
    },
    {
      id: 3,
      title: 'উপহারের ধরণ ও অনুভূতি',
      category: 'উপহারের ধরণ',
      question: 'কোন ধরনের উপহার পেলে আপনার মনে হয় উপহারদাতা আপনাকে সত্যি গভীরভাবে বোঝে?',
      options: [
        { text: 'হাতে লেখা আবেগঘন দীর্ঘ চিঠি অথবা যত্ন করে বানানো হ্যান্ডমেড ডায়েরি', category: 'উপহার' },
        { text: 'দৈনন্দিন জীবনে কাজে লাগে এমন প্রয়োজনীয় টেক গ্যাজেট বা বই', category: 'উপহার' },
        { text: 'কোনো দামী ব্র্যান্ডের পারফিউম, হাতঘড়ি বা রুচিশীল ফ্যাশন আইটেম', category: 'উপহার' },
        { text: 'একসাথে কোনো কনসার্ট, থিয়েটার বা বিশেষ জায়গায় কাটানো স্মৃতির উপহার', category: 'উপহার' },
      ],
    },
    {
      id: 4,
      title: 'মুড বুস্টার ও আনন্দ',
      category: 'খাবার ও অনুভূতি',
      question: 'মন খুব খারাপ থাকলে কোন জিনিসটি নিমিষেই আপনার মুখে হাসি এনে দিতে পারে?',
      options: [
        { text: 'গরম গরম প্রিয় কোনো খাবার, চকোলেট অথবা পছন্দের মিষ্টি', category: 'আনন্দ' },
        { text: 'প্রিয় বন্ধুর সাথে মন খুলে কোনো বাধা ছাড়া দীর্ঘ আড্ডা ও হাসাহাসি', category: 'আনন্দ' },
        { text: 'একাকী বৃষ্টির শব্দ শোনা ও পছন্দের প্লেলিস্টের গান বাজানো', category: 'আনন্দ' },
        { text: 'হঠাৎ পাওয়া সারপ্রাইজ কোনো ডেলিভারি পার্সেল বা উপহার', category: 'আনন্দ' },
      ],
    },
    {
      id: 5,
      title: 'ভবিষ্যতের স্বপ্ন',
      category: 'স্বপ্ন ও লক্ষ্য',
      question: 'জীবনের এই পর্যায়ে আপনার সবচেয়ে বড় স্বপ্ন বা লালিত ইচ্ছাটি কীসের সাথে জড়িত?',
      options: [
        { text: 'সারা বিশ্ব ঘুরে নতুন সংস্কৃতি ও মানুষের সাথে পরিচিত হওয়া', category: 'স্বপ্ন' },
        { text: 'নিজের ক্যারিয়ার ও সৃজনশীলতায় অনন্য সাফল্য অর্জন করা', category: 'স্বপ্ন' },
        { text: 'প্রিয় মানুষদের নিয়ে একটি শান্ত, সুখী ও নিরাপদ জীবন গড়ে তোলা', category: 'স্বপ্ন' },
        { text: 'সমাজের অসহায় মানুষ বা প্রাণীদের কল্যাণে বিশেষ কিছু অবদান রাখা', category: 'স্বপ্ন' },
      ],
    },
  ],
  en: [
    {
      id: 1,
      title: 'Travel & Favorite Ambience',
      category: 'Travel & Nature',
      question: 'If you had the chance to travel anywhere on your next vacation, where would you go?',
      options: [
        { text: 'Misty serene mountains, lush pine forests, and mountain streams', category: 'Travel' },
        { text: 'Vibrant ocean waves, calm sandy beaches, and golden sunsets', category: 'Travel' },
        { text: 'Japan during cherry blossom season with historic temple towns', category: 'Travel' },
        { text: 'Aesthetic European cafes, historic art galleries, and museums', category: 'Travel' },
      ],
    },
    {
      id: 2,
      title: 'Leisure & Hobbies',
      category: 'Hobbies & Leisure',
      question: 'On a lazy afternoon, which activity rejuvenates you the most?',
      options: [
        { text: 'Getting lost in a captivating book with a warm cup of coffee or tea', category: 'Hobby' },
        { text: 'Gaming with friends or exploring cool new tech gadgets', category: 'Hobby' },
        { text: 'Painting, photography, crafting, or creative artistic projects', category: 'Hobby' },
        { text: 'Listening to favorite playlists or experimenting with gourmet recipes', category: 'Hobby' },
      ],
    },
    {
      id: 3,
      title: 'Gift Style & Sentiment',
      category: 'Gift Preference',
      question: 'What kind of gift makes you feel that the giver truly understands your heart?',
      options: [
        { text: 'A handwritten heartfelt letter or a carefully crafted customized journal', category: 'Gift' },
        { text: 'A practical gadget, productivity tool, or insightful book for daily life', category: 'Gift' },
        { text: 'An elegant signature perfume, sleek watch, or stylish fashion piece', category: 'Gift' },
        { text: 'An experience gift: concert tickets, theater, or a memorable day together', category: 'Gift' },
      ],
    },
    {
      id: 4,
      title: 'Mood Boosters',
      category: 'Food & Comfort',
      question: 'When having a tough day, what instantly brings a genuine smile to your face?',
      options: [
        { text: 'Delicious comfort food, artisanal chocolate, or a favorite dessert', category: 'Comfort' },
        { text: 'A hearty, unfiltered laugh and deep talk with my closest friend', category: 'Comfort' },
        { text: 'Listening to rainfall in solitude while relaxing to soothing music', category: 'Comfort' },
        { text: 'A surprise delivery package or an unexpected sweet gesture', category: 'Comfort' },
      ],
    },
    {
      id: 5,
      title: 'Future Dreams',
      category: 'Dreams & Goals',
      question: 'At this stage of life, what is your most cherished personal dream or aspiration?',
      options: [
        { text: 'Traveling across the world to immerse in diverse cultures and landscapes', category: 'Dreams' },
        { text: 'Reaching a pinnacle of creative and professional milestone achievement', category: 'Dreams' },
        { text: 'Building a peaceful, cozy, and loving life with my favorite people', category: 'Dreams' },
        { text: 'Making a lasting positive impact for those in need and animal rescue', category: 'Dreams' },
      ],
    },
  ],
};
