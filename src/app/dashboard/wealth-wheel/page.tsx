
"use client"

import React from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart } from "recharts"
import type { WealthWheelData } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const defaultWheelData: WealthWheelData[] = [
    { id: 'income', label: 'Rendimento', value: 5, description: "Salário, freelancers, rendas, etc." },
    { id: 'savings', label: 'Poupança', value: 5, description: "Fundo de emergência, poupança para metas, etc." },
    { id: 'investing', label: 'Investimento', value: 5, description: "Ações, fundos, imóveis, etc." },
    { id: 'debt', label: 'Gestão de Dívidas', value: 5, description: "Crédito habitação, cartão de crédito, empréstimos, etc." },
    { id: 'knowledge', label: 'Conhecimento Financeiro', value: 5, description: "Literacia sobre investimentos, impostos, planeamento, etc." },
    { id: 'giving', label: 'Doação / Caridade', value: 5, description: "Contribuições para causas, voluntariado, etc." },
];

const chartConfig = {
    value: {
        label: "Score",
        color: "hsl(var(--primary))",
    },
};

export default function WealthWheelPage() {
    const [wheelData, setWheelData] = useLocalStorage<WealthWheelData[]>('wealthWheel', defaultWheelData);

    const handleSliderChange = (id: string, value: number[]) => {
        const newData = wheelData.map(item =>
            item.id === id ? { ...item, value: value[0] } : item
        );
        setWheelData(newData);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Avaliação da Roda da Riqueza</h1>
                <p className="text-muted-foreground mt-2">Avalie a sua satisfação (1-10) em cada área para visualizar o seu equilíbrio financeiro.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>A sua Roda da Riqueza</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ChartContainer config={chartConfig} className="w-full h-full">
                            <RadarChart
                                data={wheelData}
                                margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                            >
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <PolarGrid />
                                <PolarAngleAxis dataKey="label" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                                <Radar name="Score" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                            </RadarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Avalie as Suas Áreas</CardTitle>
                        <CardDescription>Ajuste os seletores para refletir a sua satisfação atual.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                        <TooltipProvider>
                            {wheelData.map((item) => (
                                <div key={item.id} className="space-y-2">
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor={item.id}>{item.label}</Label>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{item.description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <span className="font-bold text-primary">{item.value}</span>
                                    </div>
                                    <Slider
                                        id={item.id}
                                        min={0}
                                        max={10}
                                        step={1}
                                        value={[item.value]}
                                        onValueChange={(value) => handleSliderChange(item.id, value)}
                                    />
                                </div>
                            ))}
                        </TooltipProvider>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
