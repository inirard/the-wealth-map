
"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, Zap, Activity } from 'lucide-react';
import type { Goal, Transaction, WealthWheelData } from '@/lib/types';
import { useI18n } from '@/hooks/use-i18n';
import { cn } from '@/lib/utils';

interface MonthlySummaryProps {
  goals: Goal[];
  transactions: Transaction[];
  wheelData: WealthWheelData[];
}

export default function MonthlySummary({ goals, transactions, wheelData }: MonthlySummaryProps) {
  const { t } = useI18n();

  const summary = useMemo(() => {
    // Transaction Summary
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    // Goal Summary
    const closestGoal = goals
      .filter(g => new Date(g.targetDate) > new Date())
      .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())[0];
    const goalProgress = closestGoal ? (closestGoal.currentAmount / closestGoal.targetAmount) * 100 : 0;
    
    // Wealth Wheel Summary
    const lowestWheelArea = [...wheelData]
      .sort((a, b) => a.value - b.value)[0];

    return { balance, closestGoal, goalProgress, lowestWheelArea };
  }, [goals, transactions, wheelData]);

  const hasData = goals.length > 0 || transactions.length > 0 || wheelData.length > 0;

  if (!hasData) {
    return null;
  }

  return (
    <Card className="bg-muted/30">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-emphasis" />
                {t('monthly_summary')}
            </CardTitle>
            <CardDescription>{t('monthly_summary_desc')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
            <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                     {summary.balance >= 0 ? 
                        <TrendingUp className="h-8 w-8 text-green-600 flex-shrink-0" /> : 
                        <TrendingDown className="h-8 w-8 text-destructive flex-shrink-0" />
                    }
                    <CardTitle className="text-base font-semibold">{t('your_balance_this_month')}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-end">
                    <p className={cn("text-3xl font-bold", summary.balance >= 0 ? 'text-green-600' : 'text-destructive')}>
                        €{summary.balance.toFixed(2)}
                    </p>
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                 <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <Target className="h-8 w-8 text-primary flex-shrink-0" />
                    <CardTitle className="text-base font-semibold">{t('next_goal_focus')}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    {summary.closestGoal ? (
                        <p className="text-sm text-muted-foreground">
                            {t('next_goal_desc', { 
                                goalName: summary.closestGoal.name, 
                                progress: Math.round(summary.goalProgress) 
                            })}
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground">{t('no_upcoming_goals')}</p>
                    )}
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                 <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <Activity className="h-8 w-8 text-accent flex-shrink-0" />
                    <CardTitle className="text-base font-semibold">{t('focus_area_title')}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                     {summary.lowestWheelArea ? (
                        <p className="text-sm text-muted-foreground">
                           {t('focus_area_desc', { area: summary.lowestWheelArea.label })}
                        </p>
                    ) : (
                         <p className="text-sm text-muted-foreground">{t('complete_wealth_wheel')}</p>
                    )}
                </CardContent>
            </Card>
        </CardContent>
    </Card>
  );
}
