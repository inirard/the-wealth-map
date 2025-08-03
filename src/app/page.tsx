
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function WelcomePage() {
  const router = useRouter();
  const [licenseKey] = useLocalStorage<string | null>('license_key', null);
  const [username] = useLocalStorage<string | null>('username', null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the component has mounted on the client
    // before we try to access localStorage values.
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run the redirect logic once we are on the client and the values are available.
    if (isClient) {
      if (licenseKey) {
        if (username) {
          router.replace('/dashboard');
        } else {
          router.replace('/welcome');
        }
      } else {
        router.replace('/activate');
      }
    }
  }, [isClient, licenseKey, username, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground">A carregar...</div>
    </div>
  );
}
