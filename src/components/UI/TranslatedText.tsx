import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '../../stores/languageStore';

interface TranslatedTextProps {
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'span' 
}) => {
  const { translateText, currentLanguage } = useLanguageStore();
  const [translatedText, setTranslatedText] = useState(children);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (currentLanguage.code === 'en') {
        setTranslatedText(children);
        return;
      }

      setIsLoading(true);
      try {
        const translated = await translateText(children);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(children);
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [children, currentLanguage.code, translateText]);

  return (
    <Component className={`${className} ${isLoading ? 'opacity-70' : ''}`}>
      {translatedText}
    </Component>
  );
};