// Google Translate API Integration using @vitalets/google-translate-api
import translate from '@vitalets/google-translate-api';

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

class GoogleTranslationService {
  private static instance: GoogleTranslationService;
  private cache: Map<string, string> = new Map();
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessing = false;
  private readonly RATE_LIMIT_DELAY = 100; // 100ms between requests

  constructor() {
    // Initialize the service
  }

  static getInstance(): GoogleTranslationService {
    if (!GoogleTranslationService.instance) {
      GoogleTranslationService.instance = new GoogleTranslationService();
    }
    return GoogleTranslationService.instance;
  }

  private getCacheKey(text: string, targetLang: string): string {
    return `${text}:${targetLang}`;
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
          // Add delay between requests to respect rate limits
          await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_DELAY));
        } catch (error) {
          console.warn('Translation request failed:', error);
        }
      }
    }

    this.isProcessing = false;
  }

  private validateTranslation(original: string, translated: string): boolean {
    // Basic validation checks
    if (!translated || translated.trim().length === 0) {
      return false;
    }

    // Check if variables are preserved (basic check for {{variable}} patterns)
    const originalVars = original.match(/\{\{.*?\}\}/g) || [];
    const translatedVars = translated.match(/\{\{.*?\}\}/g) || [];
    
    if (originalVars.length !== translatedVars.length) {
      console.warn('Translation validation failed: variables not preserved');
      return false;
    }

    // Check if HTML tags are preserved
    const originalTags = original.match(/<[^>]+>/g) || [];
    const translatedTags = translated.match(/<[^>]+>/g) || [];
    
    if (originalTags.length !== translatedTags.length) {
      console.warn('Translation validation failed: HTML tags not preserved');
      return false;
    }

    return true;
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

    return new Promise((resolve) => {
      const request = async () => {
        try {
          const result = await translate(text, { 
            from: sourceLanguage, 
            to: targetLanguage,
            fetchOptions: {
              timeout: 5000 // 5 second timeout
            }
          });

          const translatedText = result.text;

          // Validate translation
          if (this.validateTranslation(text, translatedText)) {
            // Cache the result
            this.cache.set(cacheKey, translatedText);
            resolve(translatedText);
          } else {
            console.warn('Translation validation failed, returning original text');
            resolve(text);
          }
        } catch (error) {
          console.warn('Translation failed:', error instanceof Error ? error.message : 'Unknown error');
          // Return original text as fallback
          resolve(text);
        }
      };

      this.requestQueue.push(request);
      this.processQueue();
    });
  }

  async translateMultiple(texts: string[], targetLanguage: string, sourceLanguage = 'en'): Promise<string[]> {
    // Filter out empty texts and create a mapping
    const nonEmptyTexts = texts.filter(text => text && text.trim().length > 0);
    const textIndexMap = new Map<string, number[]>();
    
    // Create mapping of unique texts to their indices
    texts.forEach((text, index) => {
      if (text && text.trim().length > 0) {
        if (!textIndexMap.has(text)) {
          textIndexMap.set(text, []);
        }
        textIndexMap.get(text)!.push(index);
      }
    });

    // Translate unique texts
    const uniqueTexts = Array.from(textIndexMap.keys());
    const translationPromises = uniqueTexts.map(text => 
      this.translateText(text, targetLanguage, sourceLanguage)
    );

    try {
      const translations = await Promise.all(translationPromises);
      
      // Map translations back to original positions
      const result = new Array(texts.length);
      uniqueTexts.forEach((originalText, index) => {
        const translatedText = translations[index];
        const indices = textIndexMap.get(originalText)!;
        indices.forEach(originalIndex => {
          result[originalIndex] = translatedText;
        });
      });

      // Fill in empty texts
      texts.forEach((text, index) => {
        if (!text || text.trim().length === 0) {
          result[index] = text;
        }
      });

      return result;
    } catch (error) {
      console.warn('Batch translation failed, returning original texts:', error instanceof Error ? error.message : 'Unknown error');
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
  getSupportedLanguages(): Language[] {
    return supportedLanguages;
  }

  // Check if translation service is available
  isTranslationAvailable(): boolean {
    return true; // Google Translate API is always available
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const translationService = GoogleTranslationService.getInstance();