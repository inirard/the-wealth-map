
"use client";

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const readValue = useCallback((): T => {
    // Evita o erro "window is not defined" durante a renderização no servidor.
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Este efeito é crucial. Ele garante que o valor do localStorage só é lido no cliente,
  // após o componente ter sido montado.
  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  const setValue: SetValue<T> = useCallback(
    (value) => {
      // Evita o erro "window is not defined" durante a renderização no servidor.
      if (typeof window === 'undefined') {
        console.warn(
          `Tried to set localStorage key “${key}” even though no window was found.`,
        );
        return;
      }

      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);
        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
}
