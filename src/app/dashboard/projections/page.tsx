
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import type { Goal, Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/use-i18n';
import type { PredictiveInsightsOutput } from '@/lib/ai-types';
import { Sparkles, Bot, TriangleAlert, TrendingUp, Target, AlertCircle, FlaskConical, Lightbulb, Clock, Download, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ProjectionsReport from './report';


export default function ProjectionsPage() {
    const { t, language } = useI18n();
    const { toast } = useToast();
    const reportRef = useRef<HTMLDivElement>(null);

    const [goals] = useLocalStorage<Goal[]>('goals', []);
    const [transactions] = useLocalStorage<Transaction[]>('transactions', []);
    const [username] = useLocalStorage<string>('username', 'User');
    
    const [aiPredictions, setAiPredictions] = useLocalStorage<PredictiveInsightsOutput | null>('aiProjections', null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [aiError, setAiError] = useState<boolean>(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleGeneratePredictions = async () => {
        setIsLoading(true);
        setAiPredictions(null);
        setAiError(false);

        // DRASTIC MEASURE: Temporarily disable AI call
        toast({
            variant: "destructive",
            title: t('ai_error_title'),
            description: "This feature is temporarily unavailable. We are working on a fix."
        });
        setAiError(true);
        setIsLoading(false);
        return;

        // try {
        //     const payload = {
        //         language,
        //         goals,
        //         transactions,
        //         currentDate: new Date().toISOString(),
        //     };
            
        //     const response = await fetch('/api/ai', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ flow: 'predictFinancialFuture', payload }),
        //     });

        //     if (!response.ok) {
        //          throw new Error(`API Error: ${response.statusText}`);
        //     }

        //     const result = await response.json();
            
        //     if (!result.success) {
        //         throw new Error(result.error || 'AI request failed');
        //     }
            
        //     setAiPredictions(result.data as PredictiveInsightsOutput);

        // } catch (error) {
        //     console.error("Error generating AI predictions:", error);
        //     setAiError(true);
        //     toast({
        //         variant: "destructive",
        //         title: t('ai_error_title'),
        //         description: t('ai_error_description'),
        //     });
        // } finally {
        //     setIsLoading(false);
        // }
    };
    
    const handleDownloadPdf = () => {
        setIsDownloading(true);
        // Timeout to allow state to update and show loading state
        setTimeout(() => {
            window.print();
            setIsDownloading(false);
        }, 100);
    };

    const canGenerate = useMemo(() => {
        return transactions.length > 0 || goals.length > 0;
    }, [transactions, goals]);
    
    const renderSkeletons = () => (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(5)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
    
    const renderContent = () => {
        if (!isClient || isLoading) {
            return renderSkeletons();
        }
        
        if(aiError) {
            return (
                <Card className="col-span-full">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 text-destructive">
                           <TriangleAlert className="h-8 w-8 flex-shrink-0" />
                           <div>
                               <h3 className="font-bold">{t('ai_error_title')}</h3>
                               <p className="text-sm">{t('ai_coach_error_message')}</p>
                           </div>
                       </div>
                    </CardContent>
                </Card>
            )
        }

        if (aiPredictions) {
            return (
                <div className="grid gap-6 md:grid-cols-2">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-green-100">
                                    <TrendingUp className="text-green-600"/>
                                </div>
                                {t('future_balance_prediction')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-muted-foreground">{aiPredictions.futureBalancePrediction}</p></CardContent>
                     </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                 <div className="p-3 rounded-full bg-blue-100">
                                    <AlertCircle className="text-blue-600"/>
                                </div>
                                {t('proactive_alerts')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                {aiPredictions.proactiveAlerts.map((alert, i) => <li key={i}>{alert}</li>)}
                            </ul>
                        </CardContent>
                     </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-purple-100">
                                    <FlaskConical className="text-purple-600"/>
                                </div>
                                {t('spending_pattern_analysis')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-muted-foreground">{aiPredictions.spendingAnalysis}</p></CardContent>
                     </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-yellow-100">
                                    <Lightbulb className="text-yellow-600"/>
                                </div>
                                {t('what_if_scenario')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-muted-foreground">{aiPredictions.whatIfScenario}</p></CardContent>
                    </Card>
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                 <div className="p-3 rounded-full bg-primary/10">
                                    <Target className="text-primary"/>
                                </div>
                                {t('goal_projections')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                {aiPredictions.goalProjections.map((p, i) => <li key={i}><b>{p.goalName}:</b> {p.projection}</li>)}
                            </ul>
                        </CardContent>
                     </Card>
                </div>
            )
        }

        return (
             <Card className="flex flex-col items-center justify-center p-12 text-center col-span-full">
                <CardHeader>
                    <CardTitle>{t('generate_projections_title')}</CardTitle>
                    <CardDescription>{t('generate_projections_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <Sparkles className="h-16 w-16 text-muted-foreground" />
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={handleGeneratePredictions} disabled={isLoading || !canGenerate} size="lg">
                                    {isLoading ? t('ai_coach_loading') : t('generate_projections_button')}
                                </Button>
                            </TooltipTrigger>
                            {!canGenerate && (
                                <TooltipContent>
                                    <p>{t('add_data_to_generate')}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">{t('ai_projections_title')}</h1>
                    <p className="text-muted-foreground mt-2">{t('ai_projections_description')}</p>
                </div>
                <div className="flex items-center gap-2">
                    {isClient && aiPredictions && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={handleDownloadPdf} disabled={isDownloading} variant="outline" size="icon">
                                        <Download className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isDownloading ? t('downloading') : t('download_pdf')}</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                     <Button onClick={handleGeneratePredictions} disabled={isLoading || !canGenerate} variant="outline" size="icon">
                                        <RefreshCw className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isLoading ? t('ai_coach_loading') : t('regenerate_projections_button')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </div>

            {renderContent()}

            <div className="fixed -left-[9999px] top-0 print-only" aria-hidden="true">
                {isClient && aiPredictions && (
                    <ProjectionsReport 
                        ref={reportRef}
                        data={{
                            username,
                            aiPredictions,
                        }}
                    />
                )}
            </div>
        </div>
    );
}
