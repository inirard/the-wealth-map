
"use client";

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { Reflection, Goal, Transaction, WealthWheelData } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/use-i18n';
import MonthlySummary from './monthly-summary';
import { generateInsights, GenerateInsightsOutput } from '@/ai/flows/generate-insights-flow';
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

    const reflectionPrompts = React.useMemo(() => [
        { id: 'wins', prompt: t('wins_prompt') },
        { id: 'challenges', prompt: t('challenges_prompt') },
        { id: 'improvements', prompt: t('improvements_prompt') },
        { id: 'gratitude', prompt: t('gratitude_prompt') },
    ], [t]);

    const [savedReflections, setSavedReflections] = useLocalStorage<Reflection[]>(
        'reflections', 
        reflectionPrompts.map(p => ({ id: p.id, prompt: p.prompt, content: '' }))
    );

    // State to manage the textareas' content in real-time
    const [currentReflections, setCurrentReflections] = useState<Reflection[]>([]);

    // Initialize local state from localStorage only once
    useEffect(() => {
        setCurrentReflections(savedReflections);
    }, []);

    // Update prompts if language changes
    useEffect(() => {
        setCurrentReflections(prevReflections =>
            reflectionPrompts.map(p => {
                const existing = prevReflections.find(r => r.id === p.id);
                return { ...p, content: existing?.content || '' };
            })
        );
    }, [reflectionPrompts]);


    const [mood, setMood] = useLocalStorage<string | null>('monthlyMood', null);
    
    // Fetching all necessary data for the summary and AI analysis
    const [goals] = useLocalStorage<Goal[]>('goals', []);
    const [transactions] = useLocalStorage<Transaction[]>('transactions', []);
    const [wheelData] = useLocalStorage<WealthWheelData[]>('wealthWheel', []);

    const [aiInsight, setAiInsight] = useState<GenerateInsightsOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleContentChange = (id: string, content: string) => {
        const newReflections = currentReflections.map(r => 
            r.id === id ? { ...r, content } : r
        );
        setCurrentReflections(newReflections);
    };

    const handleGenerateInsights = async () => {
        setIsLoading(true);
        setAiInsight(null);
        
        // Save the current reflections to localStorage before generating insights
        setSavedReflections(currentReflections);

        try {
            const insight = await generateInsights({
                language,
                goals,
                transactions,
                wheelData,
                reflections: currentReflections,
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

    const canGenerate = currentReflections.some(r => r.content.trim() !== '');

    return (
        <div className="space-y-8">
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

            <MonthlySummary
                goals={goals}
                transactions={transactions}
                wheelData={wheelData}
            />

            <div className="grid gap-6 md:grid-cols-2">
                {reflectionPrompts.map((prompt) => (
                    <Card key={prompt.id}>
                        <CardHeader>
                            <CardTitle>{prompt.prompt}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor={prompt.id} className="sr-only">{prompt.prompt}</Label>
                            <Textarea
                                id={prompt.id}
                                value={currentReflections.find(r => r.id === prompt.id)?.content || ''}
                                onChange={(e) => handleContentChange(prompt.id, e.target.value)}
                                placeholder={t('write_reflections_placeholder')}
                                className="min-h-[150px] text-base"
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-primary/5">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
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
                            <p className="text-foreground/90 italic">{aiInsight.analysis}</p>
                        </div>
                    ) : (
                         <p className="text-sm text-muted-foreground">{t('ai_coach_prompt')}</p>
                    )}
                </CardContent>
                <CardFooter>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span tabIndex={0}>
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
