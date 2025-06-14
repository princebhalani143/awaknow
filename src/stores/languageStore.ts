import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translationService, supportedLanguages } from '../services/translationService';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => Promise<void>;
  translations: Record<string, string>;
  isTranslating: boolean;
  translateText: (text: string) => Promise<string>;
  translateUI: () => Promise<void>;
  getSupportedLanguages: () => Language[];
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: supportedLanguages[0], // Default to English
      translations: {},
      isTranslating: false,
      
      setLanguage: async (language: Language) => {
        set({ isTranslating: true });
        
        try {
          set({ currentLanguage: language });
          
          // Translate UI elements when language changes
          if (language.code !== 'en') {
            await get().translateUI();
          } else {
            set({ translations: {} }); // Clear translations for English
          }
        } catch (error) {
          console.error('Failed to set language:', error);
        } finally {
          set({ isTranslating: false });
        }
      },

      translateText: async (text: string): Promise<string> => {
        const { currentLanguage, translations } = get();
        
        if (currentLanguage.code === 'en') {
          return text;
        }

        // Check if translation already exists
        if (translations[text]) {
          return translations[text];
        }

        try {
          const translatedText = await translationService.translateText(text, currentLanguage.code);
          
          // Update translations cache
          set(state => ({
            translations: {
              ...state.translations,
              [text]: translatedText
            }
          }));
          
          return translatedText;
        } catch (error) {
          console.warn('Translation failed:', error);
          return text; // Return original text as fallback
        }
      },

      translateUI: async () => {
        const { currentLanguage } = get();
        
        if (currentLanguage.code === 'en') {
          set({ translations: {} });
          return;
        }

        try {
          const uiTranslations = await translationService.translateUIElements(currentLanguage.code);
          set({ translations: uiTranslations });
        } catch (error) {
          console.warn('UI translation failed:', error);
        }
      },

      getSupportedLanguages: () => supportedLanguages,
    }),
    {
      name: 'language-store',
      partialize: (state) => ({ 
        currentLanguage: state.currentLanguage,
        translations: state.translations 
      }),
    }
  )
);

// Export languages for backward compatibility
export const languages = supportedLanguages;