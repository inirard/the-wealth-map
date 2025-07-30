"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { Sparkles, Bot } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    const [aiInsight, setAiInsight] = useState<GenerateInsightsOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const initialData = reflectionPrompts.map(p => {
            const saved = lsReflections.find(s => s.id === p.id);
            return { id: p.id, prompt: p.prompt, content: saved?.content || '' };
        });
        setReflections(initialData);
        setIsInitialLoad(false);
    }, []); // Run only once on mount

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
            <div>
                <h1 className="text-3xl font-bold font-headline">{t('reflection_motivation')}</h1>
                <p className="text-muted-foreground mt-2">{t('reflection_motivation_desc')}</p>
            </div>

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

            <MonthlySummary goals={goals} transactions={transactions} wheelData={wheelData} />

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

            <Card className="bg-muted">
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
                                <span>
                                    <Button onClick={handleGenerateInsights} disabled={isLoading || !canGenerate}>
                                        {isLoading ? t('ai_coach_loading') : t('ai_coach_button')}
                                    </Button>
                                </span>
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
    );
}
