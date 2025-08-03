
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
  // We need to use a state that tells us when client-side hooks are ready
  const [isClient, setIsClient] = useState(false);
  const [licenseKey] = useLocalStorage<string | null>('license_key', null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run this logic on the client side
    if (isClient) {
      if (!licenseKey || !validKeys.includes(licenseKey)) {
        router.replace('/activate');
      } else {
        setIsVerified(true);
      }
    }
  }, [isClient, licenseKey, router]);

  if (!isVerified) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">A verificar acesso...</div>
      </div>
    );
  }

  return <>{children}</>;
}
