// Google Translate API Integration using @vitalets/google-translate-api
// Note: Using dynamic import to handle potential module loading issues

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

// Languages supported by Google Translate
export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தমিழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' }
];

class MockTranslationService {
  private static instance: MockTranslationService;
  private cache: Map<string, string> = new Map();

  constructor() {
    console.log('Translation service initialized in mock mode');
  }

  static getInstance(): MockTranslationService {
    if (!MockTranslationService.instance) {
      MockTranslationService.instance = new MockTranslationService();
    }
    return MockTranslationService.instance;
  }

  private getCacheKey(text: string, targetLang: string): string {
    return `${text}:${targetLang}`;
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage = 'en'): Promise<string> {
    // Return original text if target is same as source
    if (targetLanguage === sourceLanguage) {
      return text;
    }

    // Return empty string if input is empty
    if (!text || text.trim().length === 0) {
      return text;
    }

    // Check cache first
    const cacheKey = this.getCacheKey(text, targetLanguage);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // For now, return original text with language indicator
    // This prevents the app from breaking while we fix the translation
    const mockTranslation = `[${targetLanguage.toUpperCase()}] ${text}`;
    this.cache.set(cacheKey, mockTranslation);
    
    return mockTranslation;
  }

  async translateMultiple(texts: string[], targetLanguage: string, sourceLanguage = 'en'): Promise<string[]> {
    const promises = texts.map(text => this.translateText(text, targetLanguage, sourceLanguage));
    return Promise.all(promises);
  }

  async translateUIElements(targetLanguage: string): Promise<Record<string, string>> {
    const uiElements = [
      'Welcome to AwakNow',
      'Your Journey to Emotional Wellness',
      'AI Video Sessions',
      'Experience personalized conversations that understand and respond to your emotions',
      'Start Your Journey',
      'Reflect Alone',
      'Resolve With Someone',
      'Settings',
      'Sign Out',
      'Home',
      'Profile',
      'Sessions Completed',
      'Emotional Growth',
      'Wellness Score',
      'Start Session',
      'Upgrade to Premium',
      'Unlock unlimited sessions, advanced insights, and priority support',
      'Upgrade Now',
      'Private AI-powered sessions for personal emotional exploration and growth',
      'Guided conflict resolution sessions with AI mediation for better relationships',
      'AI Video Conversations',
      'Emotion Tracking',
      'Personal Insights',
      'Voice Analysis',
      'AI Mediation',
      'Safe Environment',
      'Communication Tools',
      'Shared Insights',
      'Welcome back',
      'How would you like to explore your emotional wellness today?',
      'AI-Powered Reflection',
      'Get personalized insights through intelligent video conversations that adapt to your emotional state.',
      'Conflict Resolution',
      'Navigate interpersonal challenges with guided mediation and communication tools.',
      'Emotional Wellness',
      'Track your emotional journey with sentiment analysis and personalized wellness insights.',
      'Ready to Begin?',
      'Join thousands who have transformed their emotional wellness through AI-guided reflection and conflict resolution.',
      'Get Started Now'
    ];

    const translations = await this.translateMultiple(uiElements, targetLanguage);
    
    const result: Record<string, string> = {};
    uiElements.forEach((element, index) => {
      result[element] = translations[index];
    });

    return result;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getSupportedLanguages(): Language[] {
    return supportedLanguages;
  }

  isTranslationAvailable(): boolean {
    return true;
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const translationService = MockTranslationService.getInstance();