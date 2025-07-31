
"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useI18n } from '@/hooks/use-i18n';
import { CloudSync, BarChart, BellRing, Banknote, Gem } from 'lucide-react';

interface UpgradeToProProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UpgradeToPro({ open, onOpenChange }: UpgradeToProProps) {
    const { t } = useI18n();

    const proFeatures = [
        { icon: CloudSync, text: t('pro_feature_cloud_sync') },
        { icon: Banknote, text: t('pro_feature_bank_integration') },
        { icon: BarChart, text: t('pro_feature_advanced_reports') },
        { icon: BellRing, text: t('pro_feature_smart_alerts') },
    ];

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex justify-center items-center mb-4">
                       <div className="p-3 rounded-full bg-primary/10">
                            <Gem className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <AlertDialogTitle className="text-center text-2xl font-bold">
                        {t('unlock_pro_title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        {t('unlock_pro_desc')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-6 space-y-4">
                    {proFeatures.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="flex items-start gap-4">
                                <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                <p className="text-foreground/80">{feature.text}</p>
                            </div>
                        )
                    })}
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction className="w-full">{t('notify_me')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
