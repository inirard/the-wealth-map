
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, CircleDollarSign } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { validKeys } from '@/lib/keys';
import { useToast } from "@/hooks/use-toast";

export default function ActivatePage() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [licenseKey, setLicenseKey] = useLocalStorage<string | null>('license_key', null);
  const [username] = useLocalStorage<string | null>('username', '');
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // This effect now acts as the main entry logic.
    // If the user lands here but already has a valid key, redirect them.
    if (isClient && licenseKey && validKeys.includes(licenseKey)) {
      if (username) {
        router.replace('/dashboard');
      } else {
        router.replace('/welcome');
      }
    }
  }, [isClient, licenseKey, username, router]);

  const handleActivation = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulação de verificação
    setTimeout(() => {
      if (validKeys.includes(key.trim())) {
        setLicenseKey(key.trim());
        toast({
          title: 'Ativação bem-sucedida!',
          description: 'A preparar a sua conta...',
        });
        // After setting the key, redirect to welcome page
        router.push('/welcome');
      } else {
        setError('Chave de licença inválida. Por favor, verifique e tente novamente.');
        setIsLoading(false);
      }
    }, 500);
  };
  
  // While checking for existing key on the client, or if we are redirecting, show a loading state.
  if (!isClient || (licenseKey && validKeys.includes(licenseKey))) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">A carregar...</div>
      </div>
    );
  }

  // Only show the activation form if the user is on the client AND has no valid key.
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
            <CircleDollarSign className="h-8 w-8" />
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
      </main>
    </div>
  );
}
