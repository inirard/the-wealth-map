"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This component's sole responsibility is to redirect the user to the activation flow.
// This simplifies the app's entry point and prevents complex state management issues on the root page.

export default function RootRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to the activation page, which will handle all further logic.
    router.replace('/activate');
  }, [router]);

  // Render a consistent loading state while the redirect happens.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground">A carregar...</div>
    </div>
  );
}
