
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function RootPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'redirecting'>('loading');

  // We need to call useLocalStorage at the top level to follow rules of hooks.
  // We don't use the returned setter function directly in this component.
  const [licenseKey] = useLocalStorage<string | null>('license_key', null);
  const [username] = useLocalStorage<string | null>('username', '');

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    // At this point, localStorage has been read by the hook.
    if (licenseKey && username) {
      router.replace('/dashboard');
    } else if (licenseKey) {
      router.replace('/welcome');
    } else {
      router.replace('/activate');
    }
    // Set status to redirecting to prevent the loading UI from flashing
    // if the redirect is very fast.
    setStatus('redirecting');
  }, [licenseKey, username, router]);

  // Render a simple loading state to provide feedback while the redirect logic
  // is processing on the client.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground">A carregar...</div>
    </div>
  );
}
