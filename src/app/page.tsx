
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { validKeys } from '@/lib/keys';

export default function RootPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // We call useLocalStorage at the top level to follow the rules of hooks.
  const [licenseKey] = useLocalStorage<string | null>('license_key', null);
  const [username] = useLocalStorage<string | null>('username', '');

  // This effect runs once on the client to confirm hydration.
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // This logic runs only on the client side, and only after we are sure
    // that a verification/redirection hasn't already started.
    if (isClient && !isVerified) {
      setIsVerified(true); // Mark as verified to prevent re-running

      if (licenseKey && validKeys.includes(licenseKey)) {
        if (username) {
          router.replace('/dashboard');
        } else {
          router.replace('/welcome');
        }
      } else {
        router.replace('/activate');
      }
    }
  }, [isClient, isVerified, licenseKey, username, router]);
  
  // Render a simple loading state to provide feedback while the redirect logic
  // is processing on the client. This screen will be shown until the redirect is complete.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground">A carregar...</div>
    </div>
  );
}
