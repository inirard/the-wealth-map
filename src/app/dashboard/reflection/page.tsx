
"use client";

import React from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { Reflection } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';

const reflectionPrompts = [
    { id: 'wins', prompt: 'Quais foram as minhas vitórias financeiras este mês?' },
    { id: 'challenges', prompt: 'Que desafios financeiros enfrentei?' },
    { id: 'improvements', prompt: 'Que passo posso dar para melhorar no próximo mês?' },
    { id: 'gratitude', prompt: 'Pelo que sou grato(a) na minha vida financeira?' },
];

const emotionalStates = [
    { emoji: '😃', label: 'Excelente' },
    { emoji: '🙂', label: 'Bom' },
    { emoji: '😐', label: 'Neutro' },
    { emoji: '😟', label: 'Desafiador' },
    { emoji: '😫', label: 'Difícil' },
];

export default function ReflectionPage() {
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
                <h1 className="text-3xl font-bold font-headline">Reflexão & Motivação</h1>
                <p className="text-muted-foreground mt-2">Tire um tempo para refletir sobre a sua jornada. Reconhecer o seu progresso e os seus desafios é a chave para o crescimento.</p>
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>Como se sentiu em relação às suas finanças este mês?</CardTitle>
                    <CardDescription>Selecione o emoji que melhor representa o seu estado emocional.</CardDescription>
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
                                <span className="text-sm font-normal">{state.label}</span>
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
                                placeholder="Escreva aqui as suas reflexões..."
                                className="min-h-[150px] text-base"
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

    