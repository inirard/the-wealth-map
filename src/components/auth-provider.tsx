
"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useRouter } from 'next/navigation';
import { validKeys, trialKeys } from '@/lib/keys';
import { useToast } from '@/hooks/use-toast';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [licenseKey, setLicenseKey] = useLocalStorage<string | null>('license_key', null);
  const [trialStartTime, setTrialStartTime] = useLocalStorage<number | null>('trial_start_time', null);
  const [isVerified, setIsVerified] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const isPermanentKeyValid = licenseKey && validKeys.includes(licenseKey);
      
      let isTrialValid = false;
      if (licenseKey && trialKeys.includes(licenseKey) && trialStartTime) {
        const hoursPassed = (Date.now() - trialStartTime) / (1000 * 60 * 60);
        if (hoursPassed < 24) {
          isTrialValid = true;
        } else {
          // Trial has expired
          toast({
            variant: "destructive",
            title: "Avaliação Expirada",
            description: "O seu período de teste de 24 horas terminou. Por favor, insira uma chave de licença válida.",
          });
          setLicenseKey(null);
          setTrialStartTime(null);
        }
      }

      if (isPermanentKeyValid || isTrialValid) {
        setIsVerified(true);
      } else {
        router.replace('/activate');
      }
    }
  }, [licenseKey, trialStartTime, router, isClient, setLicenseKey, setTrialStartTime, toast]);

  if (!isVerified || !isClient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">A verificar acesso...</div>
      </div>
    );
  }

  return <>{children}</>;
}
