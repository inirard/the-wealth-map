
"use client";

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // Garante que o valor inicial é usado durante a renderização no servidor (SSR)
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Este efeito é crucial. Ele só é executado no cliente.
  useEffect(() => {
    // A leitura do localStorage é feita aqui, dentro do useEffect.
    // Isto garante que não acontece durante a renderização do servidor.
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  const setValue: SetValue<T> = useCallback(
    (value) => {
      // Este código só será executado no cliente, onde `window` está disponível.
      try {
        // Permite que o novo valor seja uma função do valor antigo
        const newValue = value instanceof Function ? value(storedValue) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);
        // Dispara um evento para que outros hooks/componentes possam reagir a mudanças
        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
}
