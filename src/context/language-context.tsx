'use client';
import { createContext, useState, useEffect, ReactNode } from 'react';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

type Language = 'en' | 'es';

type Translations = typeof en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  translations: Translations;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  translations: en,
});

const translationsMap = { en, es };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('weather-app-lang') as Language | null;
    if (storedLang && ['en', 'es'].includes(storedLang)) {
      setLang(storedLang);
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('weather-app-lang', newLang);
  };

  const value = {
    lang,
    setLang: handleSetLang,
    translations: translationsMap[lang],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
