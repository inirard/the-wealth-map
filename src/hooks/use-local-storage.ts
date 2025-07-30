
"use client";

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    // This effect runs only once on the client-side after the initial render.
    // It safely reads from localStorage without causing server-client mismatches.
    try {
      const item = window.localStorage.getItem(key);
      // If the item exists in localStorage, we use that value.
      // Otherwise, we stick with the `initialValue` already in the state.
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      // In case of an error, the state already holds `initialValue`, so we do nothing.
    }
    // The empty dependency array ensures this effect runs only once on mount.
  }, [key]);

  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          window.dispatchEvent(new Event('local-storage'));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
}
