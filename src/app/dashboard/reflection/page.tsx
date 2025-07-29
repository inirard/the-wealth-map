
"use client";

import React from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { Reflection } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/use-i18n';

const emotionalStates = [
    { emoji: '😃', label: 'excellent' },
    { emoji: '🙂', label: 'good' },
    { emoji: '😐', label: 'neutral' },
    { emoji: '😟', label: 'challenging' },
    { emoji: '😫', label: 'difficult' },
];

export default function ReflectionPage() {
    const { t } = useI18n();

    const reflectionPrompts = [
        { id: 'wins', prompt: t('wins_prompt') },
        { id: 'challenges', prompt: t('challenges_prompt') },
        { id: 'improvements', prompt: t('improvements_prompt') },
        { id: 'gratitude', prompt: t('gratitude_prompt') },
    ];

    const [reflections, setReflections] = useLocalStorage<Reflection[]>(
        'reflections', 
        reflectionPrompts.map(p => ({ id: p.id, prompt: p.prompt, content: '' }))
    );
    const [mood, setMood] = useLocalStorage<string | null>('monthlyMood', null);

    const handleContentChange = (id: string, content: string) => {
        const newReflections = reflections.map(r => 
            r.id === id ? { ...r, content } : r
        );
        setReflections(newReflections);
    };

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

            <div className="grid gap-6 md:grid-cols-2">
                {reflections.map((reflection) => (
                    <Card key={reflection.id}>
                        <CardHeader>
                            <CardTitle>{reflection.prompt}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor={reflection.id} className="sr-only">{reflection.prompt}</Label>
                            <Textarea
                                id={reflection.id}
                                value={reflection.content}
                                onChange={(e) => handleContentChange(reflection.id, e.target.value)}
                                placeholder={t('write_reflections_placeholder')}
                                className="min-h-[150px] text-base"
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
