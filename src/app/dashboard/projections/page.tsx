
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import type { Goal, Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/use-i18n';
import { predictFinancialFuture } from '@/ai/flows/predictive-insights-flow';
import type { PredictiveInsightsOutput } from '@/lib/ai-types';
import { Sparkles, Bot, TriangleAlert, TrendingUp, Target, AlertCircle, FlaskConical, Lightbulb, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function ProjectionsPage() {
    const { t, language } = useI18n();
    const { toast } = useToast();

    const [goals] = useLocalStorage<Goal[]>('goals', []);
    const [transactions] = useLocalStorage<Transaction[]>('transactions', []);
    
    const [aiPredictions, setAiPredictions] = useState<PredictiveInsightsOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [aiError, setAiError] = useState<boolean>(false);

    const handleGeneratePredictions = async () => {
        setIsLoading(true);
        setAiPredictions(null);
        setAiError(false);

        try {
            const predictions = await predictFinancialFuture({
                language,
                goals,
                transactions,
                currentDate: new Date().toISOString(),
            });
            setAiPredictions(predictions);
        } catch (error) {
            console.error("Error generating AI predictions:", error);
            setAiError(true);
            toast({
                variant: "destructive",
                title: t('ai_error_title'),
                description: t('ai_error_description'),
            });
        } finally {
            setIsLoading(false);
        }
    };

    const canGenerate = useMemo(() => {
        return transactions.length > 0 || goals.length > 0;
    }, [transactions, goals]);
    
    const renderContent = () => {
        if (isLoading) {
            return (
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
            )
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
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><TrendingUp className="text-primary"/>{t('future_balance_prediction')}</CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-muted-foreground">{aiPredictions.futureBalancePrediction}</p></CardContent>
                     </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><AlertCircle className="text-primary"/>{t('proactive_alerts')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                {aiPredictions.proactiveAlerts.map((alert, i) => <li key={i}>{alert}</li>)}
                            </ul>
                        </CardContent>
                     </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><FlaskConical className="text-primary"/>{t('spending_pattern_analysis')}</CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-muted-foreground">{aiPredictions.spendingAnalysis}</p></CardContent>
                     </Card>
                      <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><Target className="text-primary"/>{t('goal_projections')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                {aiPredictions.goalProjections.map((p, i) => <li key={i}><b>{p.goalName}:</b> {p.projection}</li>)}
                            </ul>
                        </CardContent>
                     </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><Lightbulb className="text-primary"/>{t('what_if_scenario')}</CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-muted-foreground">{aiPredictions.whatIfScenario}</p></CardContent>
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
                {aiPredictions && (
                     <Button onClick={handleGeneratePredictions} disabled={isLoading || !canGenerate}>
                        <Clock className="mr-2 h-4 w-4" />
                        {isLoading ? t('ai_coach_loading') : t('regenerate_projections_button')}
                    </Button>
                )}
            </div>

            {renderContent()}
        </div>
    );
}
