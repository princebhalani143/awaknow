// Future internationalization utilities
// This file is prepared for future translation implementation

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

// Supported languages - ready for future expansion
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
];

// Default language
export const defaultLanguage: Language = supportedLanguages[0];

// Future: Translation function placeholder
export const t = (key: string, params?: Record<string, string>): string => {
  // For now, return the key as-is
  // In the future, this will look up translations from language files
  return key;
};

// Future: Language detection
export const detectLanguage = (): string => {
  // For now, return default language
  // In the future, this can detect from browser settings or user preferences
  return defaultLanguage.code;
};

// Future: Language file loader
export const loadLanguageFile = async (languageCode: string): Promise<Record<string, string>> => {
  // Future implementation will load language files from /public/locales/
  // For now, return empty object
  return {};
};