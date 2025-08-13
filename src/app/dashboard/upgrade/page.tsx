"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useI18n } from '@/hooks/use-i18n';
import { Gem, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function UpgradePage() {
    const { t } = useI18n();
    const { toast } = useToast();

    const handleNotifyClick = () => {
        const subject = encodeURIComponent("Notificação de Interesse no Plano PRO - The Wealth Map");
        const body = encodeURIComponent("Olá, gostaria de ser notificado(a) quando o Plano PRO for lançado. Obrigado!");
        window.location.href = `mailto:thewealthmap.app@gmail.com?subject=${subject}&body=${body}`;

        toast({
            title: "A abrir o seu cliente de e-mail...",
            description: "Se nada acontecer, por favor envie um e-mail para thewealthmap.app@gmail.com",
        });
    };

    return (
        <div className="max-w-full overflow-x-hidden">
            <div className="flex flex-col items-center text-center p-4 sm:p-6 lg:p-8">
                <div className="p-4 rounded-full bg-primary/10 mb-4">
                    <Gem className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-4xl font-bold font-headline mb-2">{t('unlock_pro_title')}</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">{t('unlock_pro_desc')}</p>

                <Card className="mt-12 w-full max-w-2xl text-left">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="text-emphasis"/>
                            {t('pro_features_title')}
                        </CardTitle>
                        <CardDescription>{t('pro_features_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>{t('pro_feature_cloud_sync_title')}</li>
                            <li>{t('pro_feature_bank_integration_title')}</li>
                            <li>{t('pro_feature_advanced_reports_title')}</li>
                            <li>{t('pro_feature_smart_alerts_title')}</li>
                        </ul>
                    </CardContent>
                </Card>

                <div className="text-center mt-12">
                    <Button size="lg" className="text-lg" onClick={handleNotifyClick}>
                        {t('notify_me')}
                    </Button>
                </div>
            </div>
        </div>
    );
}