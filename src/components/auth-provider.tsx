
"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useRouter } from 'next/navigation';
import { validKeys } from '@/lib/keys';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">A carregar...</div>
      </div>
    );
  }

  return <AuthChecker>{children}</AuthChecker>;
}

function AuthChecker({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [licenseKey] = useLocalStorage<string | null>('license_key', null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (licenseKey && validKeys.includes(licenseKey)) {
      setIsVerified(true);
    } else {
      router.replace('/activate');
    }
  }, [licenseKey, router]);

  if (!isVerified) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">A verificar acesso...</div>
      </div>
    );
  }

  return <>{children}</>;
}
