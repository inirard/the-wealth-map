
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function WelcomePage() {
  const router = useRouter();
  const [licenseKey] = useLocalStorage<string | null>('license_key', null);

  useEffect(() => {
    if (licenseKey) {
        router.replace('/dashboard');
    } else {
        router.replace('/activate');
    }
  }, [router, licenseKey]);

  return (
     <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">A carregar...</div>
    </div>
  );
}
