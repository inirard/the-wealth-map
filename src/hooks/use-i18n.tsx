
"use client";

import React, { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';
import type { Language, Currency } from '@/lib/types';

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

const availableCurrencies: { code: Currency; name: string; symbol: string }[] = [
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'CVE', name: 'Cabo Verde Escudo', symbol: 'Esc' },
];

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (value: number) => string;
  availableCurrencies: typeof availableCurrencies;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useLocalStorage<Language>('language', 'pt');
  const [currency, setCurrency] = useLocalStorage<Currency>('currency', 'EUR');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const effectiveLanguage = isMounted ? language : 'pt';
    const langTranslations = translations[effectiveLanguage] || translations.en;
    let text = langTranslations[key] || key;

    if (params) {
      Object.keys(params).forEach(pKey => {
        text = text.replace(new RegExp(`{{${pKey}}}`, 'g'), String(params[pKey]));
      });
    }
    return text;
  }, [language, isMounted]);

  const formatCurrency = useCallback((value: number) => {
    const effectiveCurrency = isMounted ? currency : 'EUR';
    try {
      return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: effectiveCurrency,
      }).format(value);
    } catch (e) {
      // Fallback for unsupported currencies or formats
      const selected = availableCurrencies.find(c => c.code === effectiveCurrency) || availableCurrencies[0];
      return `${selected.symbol}${value.toFixed(2)}`;
    }
  }, [currency, language, isMounted]);

  const i18nContextValue = {
    language: isMounted ? language : 'pt',
    setLanguage,
    t,
  };

  const currencyContextValue = {
    currency: isMounted ? currency : 'EUR',
    setCurrency,
    formatCurrency,
    availableCurrencies,
  };

  return (
    <I18nContext.Provider value={i18nContextValue}>
      <CurrencyContext.Provider value={currencyContextValue}>
        {children}
      </CurrencyContext.Provider>
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

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within an I18nProvider');
  }
  return context;
};
