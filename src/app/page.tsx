
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function RootPage() {
  const router = useRouter();
  // We don't use the values directly, but calling useLocalStorage triggers client-side hydration.
  const [licenseKey] = useLocalStorage<string | null>('license_key', null);
  const [username] = useLocalStorage<string | null>('username', '');

  useEffect(() => {
    // This effect now runs reliably on the client side after hydration.
    if (licenseKey && username) {
      router.replace('/dashboard');
    } else if (licenseKey) {
      router.replace('/welcome');
    } else {
      router.replace('/activate');
    }
  }, [licenseKey, username, router]);

  // Render a simple loading state to prevent a flash of unstyled content
  // and give feedback while the redirect logic is processing on the client.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground">A carregar...</div>
    </div>
  );
}
