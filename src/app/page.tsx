
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleDollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useI18n } from '@/hooks/use-i18n';

export default function CoverPage() {
  const [name, setName] = useLocalStorage('username', '');
  const [tempName, setTempName] = useState('');
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    if (name) {
      router.push('/dashboard');
    }
  }, [name, router]);
  
  const handleStart = () => {
    if (tempName.trim()) {
      setName(tempName.trim());
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleStart();
    }
  };

  if (name) {
      return null; // Or a loading spinner
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
        <div className="mb-8 animate-pulse-slow">
          <CircleDollarSign className="h-24 w-24 text-primary drop-shadow-lg" />
        </div>
        <h1 className="font-headline text-5xl font-bold tracking-tight text-primary md:text-7xl">
          The Wealth Map
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-foreground/80 md:text-xl">
          {t('welcome_subtitle')}
        </p>

        <div className="mt-10 w-full space-y-4">
            <Input 
                type="text" 
                placeholder={t('what_is_your_name')}
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12 text-center text-lg"
            />
            <Button size="lg" className="group w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform transform hover:scale-105" onClick={handleStart} disabled={!tempName.trim()}>
                {t('start_your_journey')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
        </div>
      </main>
      
      <footer className="absolute bottom-4 text-xs text-muted-foreground z-10">
        <div className="flex gap-4">
          <Link href="/legal/terms" className="hover:text-primary">Terms of Service</Link>
          <Link href="/legal/privacy" className="hover:text-primary">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}
