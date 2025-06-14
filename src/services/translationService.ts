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
  { code: 'ta', name: 'Tamil', nativeName: 'தமিழ்' },
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
  private isServiceAvailable = true;
  private lastErrorTime = 0;
  private errorCooldown = 60000; // 1 minute cooldown after errors

  constructor() {
    this.apiKey = import.meta.env.VITE_LINGO_API_KEY || '';
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

  private shouldSkipTranslation(): boolean {
    // Skip if no API key
    if (!this.apiKey) {
      return true;
    }

    // Skip if service is marked as unavailable and we're still in cooldown
    if (!this.isServiceAvailable && Date.now() - this.lastErrorTime < this.errorCooldown) {
      return true;
    }

    return false;
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage = 'en'): Promise<string> {
    // Return original text if target is same as source
    if (targetLanguage === sourceLanguage) {
      return text;
    }

    // Skip translation if service is unavailable
    if (this.shouldSkipTranslation()) {
      return text;
    }

    // Check cache first
    const cacheKey = this.getCacheKey(text, targetLanguage);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

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
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status} ${response.statusText}`);
      }

      const data: LingoTranslationResponse = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, data.translatedText);
      
      // Mark service as available if we got a successful response
      this.isServiceAvailable = true;
      
      return data.translatedText;
    } catch (error) {
      console.warn('Translation service unavailable, using original text:', error instanceof Error ? error.message : 'Unknown error');
      
      // Mark service as unavailable and set error time
      this.isServiceAvailable = false;
      this.lastErrorTime = Date.now();
      
      // Return original text as fallback
      return text;
    }
  }

  async translateMultiple(texts: string[], targetLanguage: string, sourceLanguage = 'en'): Promise<string[]> {
    // If service is unavailable, return original texts
    if (this.shouldSkipTranslation()) {
      return texts;
    }

    try {
      const promises = texts.map(text => this.translateText(text, targetLanguage, sourceLanguage));
      return await Promise.all(promises);
    } catch (error) {
      console.warn('Batch translation failed, using original texts:', error instanceof Error ? error.message : 'Unknown error');
      return texts;
    }
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

    try {
      const translations = await this.translateMultiple(uiElements, targetLanguage);
      
      const result: Record<string, string> = {};
      uiElements.forEach((element, index) => {
        result[element] = translations[index];
      });

      return result;
    } catch (error) {
      console.warn('UI elements translation failed, using original texts:', error instanceof Error ? error.message : 'Unknown error');
      
      // Return original texts as fallback
      const result: Record<string, string> = {};
      uiElements.forEach((element) => {
        result[element] = element;
      });

      return result;
    }
  }

  // Clear cache when needed
  clearCache(): void {
    this.cache.clear();
  }

  // Get supported languages
  getSupportedLanguages(): LingoLanguage[] {
    return supportedLanguages;
  }

  // Check if translation service is available
  isTranslationAvailable(): boolean {
    return this.isServiceAvailable && !!this.apiKey;
  }

  // Reset service availability (useful for retry logic)
  resetServiceAvailability(): void {
    this.isServiceAvailable = true;
    this.lastErrorTime = 0;
  }
}

export const translationService = LingoTranslationService.getInstance();