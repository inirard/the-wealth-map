
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
  const [isClient, setIsClient] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const [licenseKey] = useLocalStorage<string | null>('license_key', null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    if (licenseKey && validKeys.includes(licenseKey)) {
      setIsVerified(true);
    } else {
      router.replace('/activate');
    }
  }, [isClient, licenseKey, router]);

  if (!isVerified || !isClient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">A verificar acesso...</div>
      </div>
    );
  }

  return <>{children}</>;
}
