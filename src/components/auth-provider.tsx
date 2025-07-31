
"use client";

import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useRouter } from 'next/navigation';
import { validKeys } from '@/lib/keys';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [licenseKey] = useLocalStorage<string | null>('license_key', null);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (!licenseKey || !validKeys.includes(licenseKey)) {
            router.replace('/activate');
        } else {
            setIsVerified(true);
        }
    }, [licenseKey, router]);

    if (!isVerified) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background">
                <div className="animate-pulse text-muted-foreground">A verificar acesso...</div>
            </div>
        );
    }

    return <>{children}</>;
}
