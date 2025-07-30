
"use client";

import React, { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';
import type { Language } from '@/lib/types';

import ptTranslations from '@/locales/pt/common.json';
import enTranslations from '@/locales/en/common.json';
import esTranslations from '@/locales/es/common.json';
import frTranslations from '@/locales/fr/common.json';

const translations: Record<Language, any> = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useLocalStorage<Language>('language', 'en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    // Use 'en' on the server and during initial client render to prevent hydration mismatch.
    // Use the user's chosen language only after the component has mounted.
    const effectiveLanguage = isMounted ? language : 'en';
    const langTranslations = translations[effectiveLanguage] || translations.en;
    let text = langTranslations[key] || key;
    if (params) {
      Object.keys(params).forEach(pKey => {
        text = text.replace(new RegExp(`{{${pKey}}}`, 'g'), String(params[pKey]));
      });
    }
    return text;
  }, [language, isMounted]);
  
  const contextValue = {
      language: isMounted ? language : 'en',
      setLanguage,
      t
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};


export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
