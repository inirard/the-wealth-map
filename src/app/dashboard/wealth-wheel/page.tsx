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
import { useI18n } from '@/hooks/use-i18n';

const chartConfig = {
    value: {
        label: "Score",
        color: "hsl(var(--primary))",
    },
};

export default function WealthWheelPage() {
    const { t } = useI18n();
    
    const defaultWheelData: WealthWheelData[] = [
        { id: 'income', label: t('income'), value: 5, description: t('income_desc') },
        { id: 'savings', label: t('savings'), value: 5, description: t('savings_desc') },
        { id: 'investing', label: t('investing'), value: 5, description: t('investing_desc') },
        { id: 'debt', label: t('debt_management'), value: 5, description: t('debt_management_desc') },
        { id: 'knowledge', label: t('financial_knowledge'), value: 5, description: t('financial_knowledge_desc') },
        { id: 'giving', label: t('giving'), value: 5, description: t('giving_desc') },
    ];

    const [wheelData, setWheelData] = useLocalStorage<WealthWheelData[]>('wealthWheel', defaultWheelData);

    const handleSliderChange = (id: string, value: number[]) => {
        const newData = wheelData.map(item =>
            item.id === id ? { ...item, value: value[0] } : item
        );
        setWheelData(newData);
    };

    return (
        <div className="space-y-8 max-w-full overflow-x-hidden">
            <div>
                <h1 className="text-3xl font-bold font-headline">{t('wealth_wheel_assessment')}</h1>
                <p className="text-muted-foreground mt-2">{t('wealth_wheel_assessment_desc')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>{t('your_wealth_wheel')}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px] w-full">
                        <ChartContainer config={chartConfig} className="w-full h-full mx-auto">
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
                        <CardTitle>{t('rate_your_areas')}</CardTitle>
                        <CardDescription>{t('rate_your_areas_desc')}</CardDescription>
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
