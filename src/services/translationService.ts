// Lingo.dev Translation Service Integration
interface LingoTranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

interface LingoLanguage {
  code: string;
  name: string;
  nativeName: string;
}

// Languages supported by Lingo.dev
export const supportedLanguages: LingoLanguage[] = [
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
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
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

class LingoTranslationService {
  private static instance: LingoTranslationService;
  private apiKey: string;
  private baseUrl = 'https://api.lingo.dev/v1';
  private cache: Map<string, string> = new Map();

  constructor() {
    this.apiKey = import.meta.env.VITE_LINGO_API_KEY || 'api_yy9bvofs34f5mlzouxpmny95';
  }

  static getInstance(): LingoTranslationService {
    if (!LingoTranslationService.instance) {
      LingoTranslationService.instance = new LingoTranslationService();
    }
    return LingoTranslationService.instance;
  }

  private getCacheKey(text: string, targetLang: string): string {
    return `${text}:${targetLang}`;
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage = 'en'): Promise<string> {
    // Return original text if target is same as source
    if (targetLanguage === sourceLanguage) {
      return text;
    }

    // Check cache first
    const cacheKey = this.getCacheKey(text, targetLanguage);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          source: sourceLanguage,
          target: targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data: LingoTranslationResponse = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, data.translatedText);
      
      return data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      // Return original text as fallback
      return text;
    }
  }

  async translateMultiple(texts: string[], targetLanguage: string, sourceLanguage = 'en'): Promise<string[]> {
    const promises = texts.map(text => this.translateText(text, targetLanguage, sourceLanguage));
    return Promise.all(promises);
  }

  // Batch translate common UI elements
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
      'Shared Insights'
    ];

    const translations = await this.translateMultiple(uiElements, targetLanguage);
    
    const result: Record<string, string> = {};
    uiElements.forEach((element, index) => {
      result[element] = translations[index];
    });

    return result;
  }

  // Clear cache when needed
  clearCache(): void {
    this.cache.clear();
  }

  // Get supported languages
  getSupportedLanguages(): LingoLanguage[] {
    return supportedLanguages;
  }
}

export const translationService = LingoTranslationService.getInstance();