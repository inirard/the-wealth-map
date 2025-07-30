
"use client"

import React, { forwardRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "@/components/ui/chart"
import { CircleDollarSign, Target, TrendingUp, TrendingDown, Bot, Sparkles, Heart, Star, BookOpen } from 'lucide-react';
import { format } from "date-fns";
import { useI18n } from '@/hooks/use-i18n';
import { cn } from "@/lib/utils";
import type { Goal, Transaction, WealthWheelData, Reflection, Language } from '@/lib/types';
import type { GenerateInsightsOutput } from '@/lib/ai-types';

interface ReportData {
    username: string;
    goals: Goal[];
    transactions: Transaction[];
    wheelData: WealthWheelData[];
    reflections: Reflection[];
    mood: string | null;
    aiInsight: GenerateInsightsOutput | null;
}

interface FinancialReportProps {
    data: ReportData;
}

const chartConfig = {
    value: { label: "Score", color: "hsl(var(--primary))" },
};

const emotionalStates: { [key: string]: { labelKey: string; icon: React.FC<any> } } = {
    '😃': { labelKey: 'excellent', icon: (props) => <span {...props}>😃</span> },
    '🙂': { labelKey: 'good', icon: (props) => <span {...props}>🙂</span> },
    '😐': { labelKey: 'neutral', icon: (props) => <span {...props}>😐</span> },
    '😟': { labelKey: 'challenging', icon: (props) => <span {...props}>😟</span> },
    '😫': { labelKey: 'difficult', icon: (props) => <span {...props}>😫</span> },
};

const FinancialReport = forwardRef<HTMLDivElement, FinancialReportProps>(({ data }, ref) => {
    const { t } = useI18n();
    const { username, goals, transactions, wheelData, reflections, mood, aiInsight } = data;

    const { totalIncome, totalExpenses, balance } = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return { totalIncome: income, totalExpenses: expenses, balance: income - expenses };
    }, [transactions]);
    
    const nonEmptyReflections = reflections.filter(r => r.content.trim() !== '');

    return (
        <div ref={ref} className="p-8 font-body bg-white text-gray-800">
            {/* Report Header */}
            <header className="flex items-center justify-between pb-4 border-b-2 border-primary mb-8">
                <div className="flex items-center gap-3">
                    <CircleDollarSign className="h-10 w-10 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold font-headline text-primary">{t('financial_report_title')}</h1>
                        <p className="text-gray-500">{t('financial_report_subtitle', { name: username })}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-semibold">{t('report_date')}</p>
                    <p className="text-gray-600">{format(new Date(), "PPP")}</p>
                </div>
            </header>

            <main className="space-y-12">
                {/* Financial Summary */}
                <section>
                    <h2 className="text-2xl font-bold font-headline mb-4 text-primary">{t('financial_summary_title')}</h2>
                    <div className="grid grid-cols-3 gap-6">
                        <Card className="text-center shadow-md">
                            <CardHeader><CardTitle className="text-lg">{t('total_income')}</CardTitle></CardHeader>
                            <CardContent><p className="text-3xl font-bold text-green-600">€{totalIncome.toFixed(2)}</p></CardContent>
                        </Card>
                        <Card className="text-center shadow-md">
                            <CardHeader><CardTitle className="text-lg">{t('total_expenses')}</CardTitle></CardHeader>
                            <CardContent><p className="text-3xl font-bold text-red-600">€{totalExpenses.toFixed(2)}</p></CardContent>
                        </Card>
                        <Card className="text-center shadow-md">
                            <CardHeader><CardTitle className="text-lg">{t('final_balance')}</CardTitle></CardHeader>
                            <CardContent><p className={cn("text-3xl font-bold", balance >= 0 ? 'text-green-600' : 'text-red-600')}>€{balance.toFixed(2)}</p></CardContent>
                        </Card>
                    </div>
                </section>

                {/* AI Coach Insights */}
                {aiInsight && (
                    <section>
                        <Card className="bg-primary/5 border-primary">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-primary">
                                    <Sparkles className="h-6 w-6" /> {t('ai_coach_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-start gap-4">
                                <Bot className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                                <p className="text-base text-gray-700 italic">"{aiInsight.analysis}"</p>
                            </CardContent>
                        </Card>
                    </section>
                )}
                
                 {/* Reflections and Mood */}
                {nonEmptyReflections.length > 0 && (
                     <section>
                        <h2 className="text-2xl font-bold font-headline mb-4 text-primary">{t('reflection_motivation')}</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-4">
                                {nonEmptyReflections.map(reflection => (
                                    <Card key={reflection.id} className="shadow-md">
                                        <CardHeader><CardTitle className="text-base">{reflection.prompt}</CardTitle></CardHeader>
                                        <CardContent><p className="text-gray-600 italic">"{reflection.content}"</p></CardContent>
                                    </Card>
                                ))}
                             </div>
                             {mood && emotionalStates[mood] && (
                                <Card className="flex flex-col items-center justify-center bg-gray-50 shadow-md">
                                    <CardHeader><CardTitle>{t('how_did_you_feel')}</CardTitle></CardHeader>
                                    <CardContent className="text-center">
                                         {React.createElement(emotionalStates[mood].icon, { className: "text-7xl" })}
                                        <p className="text-2xl font-medium mt-4 text-gray-700">{t(emotionalStates[mood].labelKey)}</p>
                                    </CardContent>
                                </Card>
                            )}
                         </div>
                    </section>
                )}


                {/* Goals and Wealth Wheel */}
                <div className="grid grid-cols-5 gap-8">
                    {goals.length > 0 && (
                        <section className="col-span-3">
                            <h2 className="text-2xl font-bold font-headline mb-4 text-primary">{t('goals_progress_title')}</h2>
                            <div className="space-y-4">
                                {goals.map(goal => (
                                    <Card key={goal.id} className="shadow-md">
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center text-lg">
                                                <span>{goal.name}</span>
                                                <span className="text-sm font-medium text-gray-500">
                                                    {t('target_date')}: {format(new Date(goal.targetDate), "PPP")}
                                                </span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-xl font-bold">${goal.currentAmount.toLocaleString()} / <span className="text-base font-medium text-gray-500">${goal.targetAmount.toLocaleString()}</span></p>
                                            <Progress value={(goal.currentAmount / goal.targetAmount) * 100} className="mt-2" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}

                    {wheelData.length > 0 && (
                        <section className={goals.length > 0 ? "col-span-2" : "col-span-5"}>
                            <h2 className="text-2xl font-bold font-headline mb-4 text-primary">{t('your_wealth_wheel')}</h2>
                             <Card className="shadow-md">
                                 <CardContent className="h-[350px] p-4">
                                    <ChartContainer config={chartConfig} className="w-full h-full">
                                        <RadarChart data={wheelData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="label" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                                            <Radar name="Score" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                                        </RadarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </section>
                    )}
                </div>

                {/* Transactions */}
                {transactions.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold font-headline mb-4 text-primary">{t('transactions_title')}</h2>
                        <Card className="shadow-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('date')}</TableHead>
                                        <TableHead>{t('description')}</TableHead>
                                        <TableHead>{t('type')}</TableHead>
                                        <TableHead className="text-right">{t('amount')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map(transaction => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>{format(new Date(transaction.date), "PPP")}</TableCell>
                                            <TableCell className="font-medium">{transaction.description}</TableCell>
                                            <TableCell>
                                                <span className={cn(transaction.type === 'income' ? 'text-green-700' : 'text-red-700')}>
                                                    {transaction.type === 'income' ? t('income') : t('expense')}
                                                </span>
                                            </TableCell>
                                            <TableCell className={cn("text-right font-semibold", transaction.type === 'income' ? 'text-green-600' : 'text-red-600')}>
                                                €{transaction.amount.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </section>
                )}
            </main>
        </div>
    );
});

FinancialReport.displayName = 'FinancialReport';
export default FinancialReport;
