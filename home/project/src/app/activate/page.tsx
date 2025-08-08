
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { validKeys } from '@/lib/keys';
import { useToast } from "@/hooks/use-toast";
import { WealthMapIcon } from '@/components/icons/WealthMapIcon';
import InstallInstructions from '@/components/install-instructions';

export default function ActivatePage() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const [licenseKey, setLicenseKey] = useLocalStorage<string | null>('license_key', null);
  const [username] = useLocalStorage<string | null>('username', null);
  
  const [status, setStatus] = useState<'checking' | 'ready'>('checking');

  useEffect(() => {
    // This effect is the single source of truth for redirection logic.
    // It waits until the values from localStorage have been hydrated.
    if (licenseKey === null || username === null) {
      // Still waiting for localStorage...
      return;
    }

    if (validKeys.includes(licenseKey)) {
      if (username) {
        // Key is valid and user is onboarded -> GO TO DASHBOARD
        router.replace('/dashboard');
      } else {
        // Key is valid but user needs onboarding -> GO TO WELCOME
        router.replace('/welcome');
      }
    } else {
      // No valid key, so we are ready to show the activation form.
      setStatus('ready');
    }
  }, [licenseKey, username, router]);

  const handleActivation = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network request
    setTimeout(() => {
      if (validKeys.includes(key.trim())) {
        setLicenseKey(key.trim());
        toast({
          title: 'Ativação bem-sucedida!',
          description: 'A preparar a sua conta...',
        });
        // The useEffect will catch the change in licenseKey and redirect to /welcome
      } else {
        setError('Chave de licença inválida. Por favor, verifique e tente novamente.');
        setIsLoading(false);
      }
    }, 500);
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
         <Link href="/" className="flex items-center gap-2 text-primary mb-4">
            <WealthMapIcon />
            <span className="font-semibold text-2xl">The Wealth Map</span>
          </Link>
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-xl">
                    <KeyRound className="h-6 w-6 text-primary" />
                    Ativação do Produto
                </CardTitle>
                <CardDescription>
                    Por favor, insira a sua chave de licença para aceder à aplicação.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleActivation} className="flex w-full flex-col items-center gap-4">
                    <Input 
                        id="license_key"
                        type="text"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="WHP-XXXXX-XXXXX-XXXXX"
                        className="h-12 text-center text-lg"
                        required 
                    />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                        {isLoading ? 'A verificar...' : 'Ativar e Aceder'}
                    </Button>
                </form>
            </CardContent>
        </Card>
        <div className="mt-6">
            <InstallInstructions />
        </div>
      </main>
    </div>
  );
}
