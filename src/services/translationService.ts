import { LingoDotDevEngine } from "lingo.dev";

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
  private engine: LingoDotDevEngine | null = null;
  private apiKey: string;
  private cache: Map<string, string> = new Map();
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.apiKey = import.meta.env.VITE_LINGO_API_KEY || 'api_yy9bvofs34f5mlzouxpmny95';
    this.initializeEngine();
  }

  static getInstance(): LingoTranslationService {
    if (!LingoTranslationService.instance) {
      LingoTranslationService.instance = new LingoTranslationService();
    }
    return LingoTranslationService.instance;
  }

  private async initializeEngine(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      try {
        if (!this.apiKey) {
          console.warn('Lingo.dev API key not found. Translation will be disabled.');
          return;
        }

        this.engine = new LingoDotDevEngine({
          apiKey: this.apiKey,
          defaultModel: "groq:mistral-saba-24b",
          caching: {
            enabled: true,
            ttl: 3600, // Cache for 1 hour
          },
        });

        this.isInitialized = true;
        console.log('Lingo.dev translation engine initialized successfully');
      } catch (error) {
        console.warn('Failed to initialize Lingo.dev engine:', error);
        this.engine = null;
      }
    })();

    return this.initializationPromise;
  }

  private getCacheKey(text: string, targetLang: string): string {
    return `${text}:${targetLang}`;
  }

  private validateTranslation(original: string, translated: string): boolean {
    // Basic validation checks
    const checks = {
      // Ensure variables are preserved
      variablesPreserved: () => {
        const originalVars = original.match(/\{\{.*?\}\}/g) || [];
        const translatedVars = translated.match(/\{\{.*?\}\}/g) || [];
        return originalVars.length === translatedVars.length;
      },

      // Check for empty translations
      notEmpty: () => translated.trim().length > 0,

      // Validate HTML preservation
      htmlPreserved: () => {
        const originalTags = original.match(/<[^>]+>/g) || [];
        const translatedTags = translated.match(/<[^>]+>/g) || [];
        return originalTags.length === translatedTags.length;
      },
    };

    return Object.entries(checks).every(([name, check]) => {
      const result = check();
      if (!result) {
        console.warn(`Translation validation failed: ${name}`);
      }
      return result;
    });
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage = 'en'): Promise<string> {
    // Return original text if target is same as source
    if (targetLanguage === sourceLanguage) {
      return text;
    }

    // Ensure engine is initialized
    await this.initializeEngine();

    if (!this.engine || !this.isInitialized) {
      console.warn('Translation engine not available, returning original text');
      return text;
    }

    // Check cache first
    const cacheKey = this.getCacheKey(text, targetLanguage);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const translated = await this.engine.translate(text, {
        sourceLocale: sourceLanguage,
        targetLocale: targetLanguage,
        context: "emotional wellness application",
        tone: "supportive",
        formality: "casual",
      });

      // Validate translation
      if (this.validateTranslation(text, translated)) {
        // Cache the result
        this.cache.set(cacheKey, translated);
        return translated;
      } else {
        console.warn('Translation validation failed, returning original text');
        return text;
      }
    } catch (error) {
      console.warn('Translation failed:', error instanceof Error ? error.message : 'Unknown error');
      // Return original text as fallback
      return text;
    }
  }

  async translateMultiple(texts: string[], targetLanguage: string, sourceLanguage = 'en'): Promise<string[]> {
    // Ensure engine is initialized
    await this.initializeEngine();

    if (!this.engine || !this.isInitialized) {
      console.warn('Translation engine not available, returning original texts');
      return texts;
    }

    try {
      const translations = await this.engine.translateBatch(texts, {
        sourceLocale: sourceLanguage,
        targetLocale: targetLanguage,
        preserveFormatting: true,
        context: "emotional wellness application",
      });

      return translations;
    } catch (error) {
      console.warn('Batch translation failed, using individual translations:', error instanceof Error ? error.message : 'Unknown error');
      
      // Fallback to individual translations
      try {
        const promises = texts.map(text => this.translateText(text, targetLanguage, sourceLanguage));
        return await Promise.all(promises);
      } catch (fallbackError) {
        console.warn('Individual translations also failed, returning original texts');
        return texts;
      }
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
      'Shared Insights',
      'Welcome back',
      'How would you like to explore your emotional wellness today?',
      'AI-Powered Reflection',
      'Get personalized insights through intelligent video conversations that adapt to your emotional state.',
      'Conflict Resolution',
      'Navigate interpersonal challenges with guided mediation and communication tools.',
      'Emotional Wellness',
      'Track your emotional journey with sentiment analysis and personalized wellness insights.'
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
    return this.isInitialized && !!this.engine && !!this.apiKey;
  }

  // Reset and reinitialize the engine
  async resetEngine(): Promise<void> {
    this.isInitialized = false;
    this.initializationPromise = null;
    this.engine = null;
    await this.initializeEngine();
  }
}

export const translationService = LingoTranslationService.getInstance();