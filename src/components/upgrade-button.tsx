
"use client";

import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Check, Crown, X } from 'lucide-react';
import { usePlan } from '@/hooks/use-plan';
import { useI18n } from '@/hooks/use-i18n';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';

export default function UpgradeButton({ asChild = false, fullWidth = false, size = 'default', iconOnly = false }: { asChild?: boolean, fullWidth?: boolean, size?: 'sm' | 'default' | 'lg' | 'icon' | null | undefined, iconOnly?: boolean}) {
    const { plan, setPlan } = usePlan();
    const { t } = useI18n();

    if (plan === 'premium' && !asChild) return null;

    const basicFeatures = [
        t('basic_feature_1'),
        t('basic_feature_2'),
        t('basic_feature_3'),
        t('basic_feature_4'),
    ];

    const premiumFeatures = [
        t('premium_feature_1'),
        t('premium_feature_2'),
        t('premium_feature_3'),
        t('premium_feature_4'),
        t('premium_feature_5'),
        t('premium_feature_6'),
    ];

    const buttonContent = iconOnly ? (
        <Crown className="h-6 w-6 text-primary" />
    ) : (
        <>
            <Crown className="mr-2 h-4 w-4" />
            {t('upgrade_to_premium')}
        </>
    );

    const triggerButton = (
        <Button 
            variant={iconOnly ? "ghost" : "default"}
            size={iconOnly ? "icon" : size} 
            asChild={asChild}
            className={cn(
                iconOnly ? 'text-primary hover:text-primary/90' : 'bg-gradient-to-r from-emphasis to-primary/80 text-white shadow-lg hover:scale-105 transition-transform',
                fullWidth ? 'w-full' : ''
            )}
        >
            {asChild ? <span>{buttonContent}</span> : buttonContent}
        </Button>
    );

    return (
        <Dialog>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            {triggerButton}
                        </DialogTrigger>
                    </TooltipTrigger>
                    {iconOnly && (
                         <TooltipContent>
                            <p>{t('upgrade_to_premium')}</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
            <DialogContent className="max-w-4xl p-8">
                <DialogHeader>
                    <DialogTitle className="text-center text-3xl font-bold">{t('unlock_full_potential')}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    {/* Basic Plan */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('basic_plan')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-3xl font-bold">€29.90 <span className="text-sm font-normal text-muted-foreground">{t('one_time_payment')}</span></p>
                            <ul className="space-y-2">
                                {basicFeatures.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                                <li className="flex items-start gap-3 text-muted-foreground">
                                    <X className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                                    <span>{t('no_advanced_ai')}</span>
                                </li>
                                <li className="flex items-start gap-3 text-muted-foreground">
                                    <X className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                                    <span>{t('no_pdf_export')}</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <DialogClose asChild>
                                <Button variant="outline" className="w-full" >{t('stay_on_basic')}</Button>
                            </DialogClose>
                        </CardFooter>
                    </Card>

                    {/* Premium Plan */}
                    <Card className="border-primary border-2 shadow-lg relative">
                         <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">{t('most_popular')}</div>
                        <CardHeader>
                            <CardTitle>{t('premium_plan')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="text-3xl font-bold">
                                €6.99 <span className="text-sm font-normal text-muted-foreground">/ {t('month')}</span>
                                <span className="text-lg font-normal text-muted-foreground mx-2">{t('or')}</span>
                                €59 <span className="text-sm font-normal text-muted-foreground">/ {t('year')}</span>
                            </div>
                             <ul className="space-y-2">
                                {premiumFeatures.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="flex-col items-stretch gap-4">
                             <Button onClick={() => setPlan('premium')} className="w-full bg-primary hover:bg-primary/90">
                                {t('choose_premium_monthly')}
                            </Button>
                             <Button onClick={() => setPlan('premium')} className="w-full bg-primary/90 hover:bg-primary/80">
                                {t('choose_premium_annually')} ({t('save_percent', { percent: 30 })})
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}
