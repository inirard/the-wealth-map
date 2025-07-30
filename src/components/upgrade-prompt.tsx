
"use client";

import React from 'react';
import { Lock } from 'lucide-react';
import UpgradeButton from './upgrade-button';
import { useI18n } from '@/hooks/use-i18n';

interface UpgradePromptProps {
  message: string;
}

export default function UpgradePrompt({ message }: UpgradePromptProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg bg-primary/5">
        <Lock className="h-12 w-12 text-primary/50" />
        <p className="mt-4 text-lg font-semibold">{t('premium_feature')}</p>
        <p className="mt-2 text-muted-foreground max-w-md">{message}</p>
        <div className="mt-6">
            <UpgradeButton size="lg" />
        </div>
    </div>
  )
}
