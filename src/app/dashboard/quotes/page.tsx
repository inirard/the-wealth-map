"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { quotes } from '@/lib/data';

export default function QuotesPage() {
    const [quote, setQuote] = useState({ quote: '', author: '' });

    const getNewQuote = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    }, []);

    useEffect(() => {
        getNewQuote();
    }, [getNewQuote]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Citações & Afirmações</h1>
                <p className="text-muted-foreground mt-2">Encontre inspiração para impulsionar a sua jornada financeira.</p>
            </div>
            
            <Card className="max-w-3xl w-full shadow-xl">
                <CardContent className="p-8 md:p-12">
                    <blockquote className="text-2xl md:text-3xl font-light italic text-foreground">
                        “{quote.quote}”
                    </blockquote>
                </CardContent>
                <CardFooter className="flex flex-col items-end p-6 bg-muted/50">
                    <p className="text-lg font-medium text-primary">— {quote.author}</p>
                </CardFooter>
            </Card>

            <Button onClick={getNewQuote} size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Nova Citação
            </Button>
        </div>
    );
}
