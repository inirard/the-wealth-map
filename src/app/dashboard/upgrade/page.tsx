"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useI18n } from '@/hooks/use-i18n';
import { CloudSync, BarChart, BellRing, Banknote, Gem, Sparkles } from 'lucide-react';

const proFeaturesList = [
    { Icon: CloudSync, titleKey: 'pro_feature_cloud_sync_title', descKey: 'pro_feature_cloud_sync_desc' },
    { Icon: Banknote, titleKey: 'pro_feature_bank_integration_title', descKey: 'pro_feature_bank_integration_desc' },
    { Icon: BarChart, titleKey: 'pro_feature_advanced_reports_title', descKey: 'pro_feature_advanced_reports_desc' },
    { Icon: BellRing, titleKey: 'pro_feature_smart_alerts_title', descKey: 'pro_feature_smart_alerts_desc' },
];

export default function UpgradePage() {
    const { t } = useI18n();

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col items-center text-center">
                 <div className="p-4 rounded-full bg-primary/10 mb-4">
                    <Gem className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-4xl font-bold font-headline mb-2">{t('unlock_pro_title')}</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">{t('unlock_pro_desc')}</p>
            </div>

             <Card className="mt-12">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-emphasis"/>
                        {t('pro_features_title')}
                    </CardTitle>
                    <CardDescription>{t('pro_features_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2">
                    {proFeaturesList.map((feature) => {
                        const Icon = feature.Icon;
                        return (
                            <div
                                key={feature.titleKey}
                                className="flex items-start gap-4 p-4 rounded-lg bg-background hover:bg-primary/5 transition-colors"
                            >
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Icon className="h-6 w-6 text-primary flex-shrink-0" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        {t(feature.titleKey)}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t(feature.descKey)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            <div className="text-center mt-12">
                <Button size="lg" className="text-lg">
                    {t('notify_me')}
                </Button>
            </div>
        </div>
    );
}
