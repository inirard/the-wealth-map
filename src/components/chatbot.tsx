
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useI18n } from '@/hooks/use-i18n';
import type { Goal, Transaction, WealthWheelData, Reflection, ChatMessage } from '@/lib/types';
import Textarea from 'react-textarea-autosize';
import { Bot, Send, User, X, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";


export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { t, language } = useI18n();
    const { toast } = useToast();
    
    // Data hooks are kept for future re-enabling
    const [goals] = useLocalStorage<Goal[]>('goals', []);
    const [transactions] = useLocalStorage<Transaction[]>('transactions', []);
    const [wheelData] = useLocalStorage<WealthWheelData[]>('wealthWheel', []);
    const [reflections] = useLocalStorage<Reflection[]>('reflections', []);
    
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);
    
    useEffect(() => {
        if (isOpen) {
            setMessages([{ role: 'model', content: t('chatbot_welcome') }]);
        }
    }, [isOpen, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // AI functionality is temporarily disabled.
            // We will just show the user a message.
            const modelMessage: ChatMessage = { role: 'model', content: t('ai_error_description') };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error: any) {
            console.error("Error in chatbot:", error);
            const modelMessage: ChatMessage = { role: 'model', content: t('ai_error_description') };
            setMessages(prev => [...prev, modelMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <Button variant="ghost" size="icon" className="text-primary hover:text-primary/90" onClick={() => setIsOpen(true)}>
                <Bot className="h-6 w-6" />
                <span className="sr-only">{t('open_chatbot')}</span>
            </Button>

            <div className={cn("fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-md transition-all duration-300 ease-in-out sm:bottom-auto sm:top-20", 
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none")}>
                <Card className="shadow-2xl h-[70vh] flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bot className="h-7 w-7 text-primary" />
                            <CardTitle className="text-lg">{t('ai_coach_title')}</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full" ref={scrollAreaRef}>
                            <div className="p-4 space-y-4">
                                {messages.map((msg, index) => (
                                    <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                                        {msg.role === 'model' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                                        <div className={cn("rounded-2xl px-4 py-2 max-w-[80%] text-sm", 
                                            msg.role === 'model' ? 'bg-muted' : 'bg-primary text-primary-foreground')}>
                                            <p>{msg.content}</p>
                                        </div>
                                         {msg.role === 'user' && <User className="h-6 w-6 text-foreground flex-shrink-0" />}
                                    </div>
                                ))}
                                {isLoading && (
                                     <div className="flex items-start gap-3 justify-start">
                                        <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                                        <div className="rounded-2xl px-4 py-2 bg-muted flex items-center">
                                           <Loader className="h-5 w-5 animate-spin text-primary" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-2 border-t">
                        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                            <Textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        handleSubmit(e);
                                    }
                                }}
                                placeholder={t('chatbot_placeholder')}
                                className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0"
                                maxRows={4}
                                autoFocus
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                <Send className="h-5 w-5" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
