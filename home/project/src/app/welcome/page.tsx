
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useLocalStorage } from '@/hooks/use-local-storage';
import { validKeys } from '@/lib/keys';

export default function WelcomePage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useLocalStorage('username', '');
  const [licenseKey] = useLocalStorage<string | null>('license_key', null);
  const router = useRouter();
  
  const [status, setStatus] = useState<'checking' | 'ready'>('checking');

  useEffect(() => {
    // This effect only ensures the user belongs on this page.
    // It does not handle complex redirection logic.
    if (licenseKey === null) {
      // Still waiting for localStorage to hydrate
      return;
    }

    if (!validKeys.includes(licenseKey)) {
      // Invalid key, should not be here.
      router.replace('/activate');
      return;
    }
      
    if (username) {
      // Already onboarded, should be on dashboard.
      router.replace('/dashboard');
      return;
    }

    // Belongs on this page.
    setStatus('ready');
  }, [licenseKey, username, router]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setUsername(name.trim());
      router.push('/dashboard');
    }
  };

  if (status === 'checking') {
     return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="animate-pulse text-muted-foreground">A verificar acesso...</div>
        </div>
     );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
      <div className="pointer-events-none absolute inset-0 z-0" style={{
        backgroundImage: `
          radial-gradient(circle at 10% 20%, hsl(var(--primary) / 0.1) 0, transparent 25%),
          radial-gradient(circle at 80% 90%, hsl(var(--accent) / 0.1) 0, transparent 25%)
        `
      }}></div>

      <main className="relative z-10 flex w-full max-w-md flex-col items-center justify-center text-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Sparkles className="h-6 w-6 text-primary" />
              Welcome to The Wealth Map!
            </CardTitle>
            <CardDescription>
              Let's get started by setting up your profile. What should we call you?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStart} className="flex w-full flex-col items-center gap-4">
              <Input 
                id="username"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-12 text-center text-lg"
                required
                autoFocus
              />
              <Button type="submit" size="lg" className="w-full" disabled={!name.trim()}>
                Start Your Journey
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
