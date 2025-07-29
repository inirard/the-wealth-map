"use client"

import React from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart } from "recharts"
import type { WealthWheelData } from '@/lib/types';

const defaultWheelData: WealthWheelData[] = [
    { id: 'income', label: 'Income', value: 5 },
    { id: 'savings', label: 'Savings', value: 5 },
    { id: 'investing', label: 'Investing', value: 5 },
    { id: 'debt', label: 'Debt Management', value: 5 },
    { id: 'knowledge', label: 'Financial Knowledge', value: 5 },
    { id: 'giving', label: 'Giving / Charity', value: 5 },
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
                <h1 className="text-3xl font-bold font-headline">Wealth Wheel Assessment</h1>
                <p className="text-muted-foreground mt-2">Rate your satisfaction (1-10) in each area to visualize your financial balance.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Your Wealth Wheel</CardTitle>
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
                        <CardTitle>Rate Your Areas</CardTitle>
                        <CardDescription>Adjust sliders to reflect your current satisfaction.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                        {wheelData.map((item) => (
                            <div key={item.id} className="space-y-2">
                                <div className="flex justify-between">
                                    <Label htmlFor={item.id}>{item.label}</Label>
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
