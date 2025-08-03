
"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useRouter } from 'next/navigation';
import { validKeys } from '@/lib/keys';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  
  // We need to call useLocalStorage at the top level to follow rules of hooks.
  // The value will be updated once the client hydrates.
  const [licenseKey] = useLocalStorage<string | null>('license_key', null);

  useEffect(() => {
    // This effect will re-run on the client when `licenseKey` is updated from localStorage.
    if (licenseKey === null) {
      // If the key is still the initial value, we might be on the server or the client
      // hasn't hydrated yet. We wait.
      return;
    }

    if (validKeys.includes(licenseKey)) {
      // If the key is valid, we allow rendering the children.
      setIsVerified(true);
    } else {
      // If the key is invalid or not present, redirect.
      router.replace('/activate');
    }
  }, [licenseKey, router]);

  if (!isVerified) {
    // Show a loading state while we verify the key on the client.
    // This prevents rendering the dashboard and then quickly redirecting.
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">A verificar acesso...</div>
      </div>
    );
  }

  return <>{children}</>;
}
