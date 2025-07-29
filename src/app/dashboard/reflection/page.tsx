"use client";

import React from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { Reflection } from '@/lib/types';
import { Label } from '@/components/ui/label';

const reflectionPrompts = [
    { id: 'wins', prompt: 'What are my financial wins this month?' },
    { id: 'challenges', prompt: 'What financial challenges did I face?' },
    { id: 'improvements', prompt: 'What is one step I can take to improve next month?' },
    { id: 'gratitude', prompt: 'What am I grateful for in my financial life?' },
];

export default function ReflectionPage() {
    const [reflections, setReflections] = useLocalStorage<Reflection[]>('reflections', 
        reflectionPrompts.map(p => ({ id: p.id, prompt: p.prompt, content: '' }))
    );

    const handleContentChange = (id: string, content: string) => {
        const newReflections = reflections.map(r => 
            r.id === id ? { ...r, content } : r
        );
        setReflections(newReflections);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Reflection & Motivation</h1>
                <p className="text-muted-foreground mt-2">Take time to reflect on your journey. Acknowledging your progress and challenges is key to growth.</p>
            </div>

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
                                placeholder="Write your thoughts here..."
                                className="min-h-[150px] text-base"
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
