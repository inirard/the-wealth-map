
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleDollarSign } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useI18n } from '@/hooks/use-i18n';

export default function WelcomePage() {
  const [name, setName] = useState('');
  const [storedName, setStoredName] = useLocalStorage('username', '');
  const router = useRouter();
  const { t } = useI18n();
  
  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStoredName(name);
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
      <div className="pointer-events-none absolute inset-0 z-0" style={{
        backgroundImage: `
          radial-gradient(circle at 10% 20%, hsl(var(--primary) / 0.1) 0, transparent 25%),
          radial-gradient(circle at 80% 90%, hsl(var(--accent) / 0.1) 0, transparent 25%)
        `
      }}></div>

      <main className="relative z-10 flex w-full max-w-2xl flex-col items-center justify-center text-center">
        <Link href="/" className="mb-8">
          <CircleDollarSign className="h-24 w-24 text-primary drop-shadow-lg" />
        </Link>
        <h1 className="font-headline text-5xl font-bold tracking-tight text-primary md:text-7xl">
          The Wealth Map
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-foreground/80 md:text-xl">
          {t('welcome_subtitle')}
        </p>

        <form onSubmit={handleStart} className="mt-10 flex w-full max-w-sm flex-col items-center gap-4">
          <label htmlFor="name" className="text-lg font-medium text-foreground">
            {t('what_is_your_name')}
          </label>
          <Input 
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="h-12 text-center text-lg"
            required 
          />
          <Button type="submit" size="lg" className="w-full">
            {t('start_your_journey')}
          </Button>
        </form>
      </main>
      
      <footer className="absolute bottom-4 text-xs text-muted-foreground z-10">
        <div className="flex gap-4">
          <Link href="/legal/terms" className="hover:text-primary">{t('terms_of_service')}</Link>
          <Link href="/legal/privacy" className="hover:text-primary">{t('privacy_policy')}</Link>
        </div>
      </footer>
    </div>
  );
}
