
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { Reflection, Goal, Transaction, WealthWheelData } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/use-i18n';
import MonthlySummary from './monthly-summary';
import { generateInsights } from '@/ai/flows/generate-insights-flow';
import type { GenerateInsightsOutput } from '@/lib/ai-types';
import { Sparkles, Bot, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import FinancialReport from './report';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const emotionalStates = [
    { emoji: '😃', label: 'excellent' },
    { emoji: '🙂', label: 'good' },
    { emoji: '😐', label: 'neutral' },
    { emoji: '😟', label: 'challenging' },
    { emoji: '😫', label: 'difficult' },
];

export default function ReflectionPage() {
    const { t, language } = useI18n();
    const { toast } = useToast();
    const reportRef = useRef<HTMLDivElement>(null);

    const reflectionPrompts = useMemo(() => [
        { id: 'wins', prompt: t('wins_prompt') },
        { id: 'challenges', prompt: t('challenges_prompt') },
        { id: 'improvements', prompt: t('improvements_prompt') },
        { id: 'gratitude', prompt: t('gratitude_prompt') },
    ], [t]);

    const [reflections, setReflections] = useState<Reflection[]>(reflectionPrompts.map(p => ({ ...p, content: '' })));
    const [lsReflections, setLsReflections] = useLocalStorage<Reflection[]>('reflections', []);
    const [mood, setMood] = useLocalStorage<string | null>('monthlyMood', null);
    const [goals] = useLocalStorage<Goal[]>('goals', []);
    const [transactions] = useLocalStorage<Transaction[]>('transactions', []);
    const [wheelData] = useLocalStorage<WealthWheelData[]>('wealthWheel', []);
    const [username] = useLocalStorage<string>('username', 'User');
    const [aiInsight, setAiInsight] = useState<GenerateInsightsOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const handleDownloadPdf = async () => {
        const reportElement = reportRef.current;
        if (!reportElement) return;

        setIsDownloading(true);

        try {
            const canvas = await html2canvas(reportElement, {
                scale: 2, 
                useCORS: true,
                backgroundColor: '#ffffff',
                windowWidth: reportElement.scrollWidth,
                windowHeight: reportElement.scrollHeight,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / pdfWidth;
            const imgHeight = canvasHeight / ratio;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            
            pdf.save(`financial-report-${new Date().toISOString().split('T')[0]}.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
            toast({
                variant: "destructive",
                title: t('ai_error_title'),
                description: 'Failed to generate PDF report.',
            });
        } finally {
            setIsDownloading(false);
        }
    };


    useEffect(() => {
        const initialData = reflectionPrompts.map(p => {
            const saved = lsReflections.find(s => s.id === p.id);
            return { id: p.id, prompt: p.prompt, content: saved?.content || '' };
        });
        setReflections(initialData);
        setIsInitialLoad(false);
    }, [t, lsReflections, reflectionPrompts]); 

    const handleContentChange = (id: string, content: string) => {
        setReflections(currentReflections =>
            currentReflections.map(r => (r.id === id ? { ...r, content } : r))
        );
    };

    const handleGenerateInsights = async () => {
        setIsLoading(true);
        setAiInsight(null);
        setLsReflections(reflections);

        try {
            const insight = await generateInsights({
                language,
                goals,
                transactions,
                wheelData,
                reflections,
            });
            setAiInsight(insight);
        } catch (error) {
            console.error("Error generating AI insights:", error);
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
        return reflections.some(r => r.content && r.content.trim() !== '');
    }, [reflections]);

    const hasDataToReport = useMemo(() => {
        return goals.length > 0 || transactions.length > 0 || wheelData.length > 0 || reflections.some(r => r.content.trim() !== '');
    }, [goals, transactions, wheelData, reflections]);

    if (isInitialLoad) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-12 w-1/2" />
                <Skeleton className="h-8 w-3/4" />
                <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
                <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">{t('reflection_motivation')}</h1>
                    <p className="text-muted-foreground mt-2">{t('reflection_motivation_desc')}</p>
                </div>
                <Button onClick={handleDownloadPdf} disabled={!hasDataToReport || isDownloading}>
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading ? 'Downloading...' : 'Download PDF'}
                </Button>
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('how_did_you_feel')}</CardTitle>
                        <CardDescription>{t('how_did_you_feel_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            {emotionalStates.map((state) => (
                                <Button
                                    key={state.label}
                                    variant={mood === state.emoji ? "default" : "outline"}
                                    className={cn(
                                        "flex-grow sm:flex-grow-0 text-2xl h-20 w-24 flex flex-col items-center justify-center gap-2 transition-all duration-200",
                                        mood === state.emoji ? "border-primary border-2" : "border"
                                    )}
                                    onClick={() => setMood(state.emoji)}
                                >
                                    <span>{state.emoji}</span>
                                    <span className="text-sm font-normal">{t(state.label)}</span>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <MonthlySummary goals={goals} transactions={transactions} wheelData={wheelData} />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
                {reflections.map((reflection) => (
                    <Card key={reflection.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">{reflection.prompt}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <Label htmlFor={reflection.id} className="sr-only">{reflection.prompt}</Label>
                            <Textarea
                                id={reflection.id}
                                value={reflection.content}
                                onChange={(e) => handleContentChange(reflection.id, e.target.value)}
                                placeholder={t('write_reflections_placeholder')}
                                className="min-h-[150px] text-sm"
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div>
                <Card className="bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Sparkles className="h-6 w-6 text-primary" />
                            {t('ai_coach_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('ai_coach_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ) : aiInsight ? (
                            <div className="flex items-start gap-4">
                                <Bot className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                                <p className="text-sm text-foreground/90 italic">{aiInsight.analysis}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">{t('ai_coach_prompt')}</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={handleGenerateInsights} disabled={isLoading || !canGenerate}>
                                        {isLoading ? t('ai_coach_loading') : t('ai_coach_button')}
                                    </Button>
                                </TooltipTrigger>
                                {!canGenerate && (
                                    <TooltipContent>
                                        <p>{t('ai_coach_disabled_tooltip')}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    </CardFooter>
                </Card>
            </div>
            
            <div className="fixed -left-[9999px] top-0">
                 <FinancialReport 
                    ref={reportRef}
                    data={{
                        username,
                        goals,
                        transactions,
                        wheelData,
                        reflections,
                        mood,
                        aiInsight,
                    }}
                />
            </div>
        </div>
    );
}

    
