
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This is a server component by default in App Router, but we need client-side logic for navigation.
// However, to keep it simple and robust, we'll use a simple client component to redirect.

export default function RootRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect immediately to the activation page, which will handle all further logic.
    // This avoids any complex state management or localStorage races on the root page.
    router.replace('/activate');
  }, [router]);

  // Render a loading state while the redirect happens.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground">A carregar...</div>
    </div>
  );
}
