"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * This is the root page of the application.
 * Its sole purpose is to redirect the user to the correct starting point of the app flow,
 * which is the activation page. The logic for authentication and further redirection
 * is handled by the subsequent pages (`/activate`, `/welcome`, and AuthProvider).
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Unconditionally redirect to the start of the activation flow.
    // This simplifies the logic and prevents the app from getting stuck
    // on this page trying to read from localStorage.
    router.replace('/activate');
  }, [router]);

  // Render a simple loading state while the redirect is happening.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground">A carregar...</div>
    </div>
  );
}
