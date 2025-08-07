
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
  
  const [licenseKey] = useLocalStorage<string | null>('license_key', null);
  const [username] = useLocalStorage<string | null>('username', null);

  useEffect(() => {
    // Wait for localStorage to hydrate from client
    if (licenseKey === null || username === null) {
      return;
    }

    // The single responsibility of this provider is to protect dashboard routes.
    // If the key is invalid OR the user is not onboarded, redirect to the start of the flow.
    if (validKeys.includes(licenseKey) && username) {
      setIsVerified(true);
    } else {
      router.replace('/activate');
    }
  }, [licenseKey, username, router]);

  // Show a loading state while we verify the key on the client side.
  // This prevents rendering the dashboard and then quickly redirecting if the key is bad.
  if (!isVerified) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">A verificar acesso...</div>
      </div>
    );
  }

  // If verified, render the protected content.
  return <>{children}</>;
}
