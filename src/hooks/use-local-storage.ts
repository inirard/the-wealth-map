
"use client";

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

// Custom hook to manage state in localStorage and sync across tabs
export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // This part runs only on the client, and only on the initial render.
    // We put it in a function for useState so it's not re-run on every render.
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
  });

  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          // Dispatch a custom event to notify other tabs/windows
          window.dispatchEvent(new CustomEvent('local-storage', {
            detail: { key, newValue: valueToStore }
          }));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    // This effect listens for changes in other tabs
    const handleStorageChange = (event: Event) => {
      // Check if it's our custom event
      if (event instanceof CustomEvent && event.detail.key === key) {
        setStoredValue(event.detail.newValue);
      }
      // Also handle the native 'storage' event
      else if (event instanceof StorageEvent && event.key === key && event.newValue) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch (error) {
           console.warn(`Error parsing storage event value for key “${key}”:`, error);
        }
      }
    };

    window.addEventListener('local-storage', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('local-storage', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
