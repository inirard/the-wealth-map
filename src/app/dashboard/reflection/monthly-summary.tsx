
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
            <div className="flex items-start gap-4 rounded-lg bg-background p-4">
                {summary.balance >= 0 ? 
                    <TrendingUp className="h-8 w-8 text-green-600" /> : 
                    <TrendingDown className="h-8 w-8 text-destructive" />
                }
                <div>
                    <p className="font-semibold text-foreground">{t('your_balance_this_month')}</p>
                    <p className={cn("text-2xl font-bold", summary.balance >= 0 ? 'text-green-600' : 'text-destructive')}>
                        €{summary.balance.toFixed(2)}
                    </p>
                </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg bg-background p-4">
                <Target className="h-8 w-8 text-primary" />
                <div>
                     <p className="font-semibold text-foreground">{t('next_goal_focus')}</p>
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
                </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg bg-background p-4">
                <Activity className="h-8 w-8 text-accent" />
                 <div>
                    <p className="font-semibold text-foreground">{t('focus_area_title')}</p>
                    {summary.lowestWheelArea ? (
                        <p className="text-sm text-muted-foreground">
                           {t('focus_area_desc', { area: summary.lowestWheelArea.label })}
                        </p>
                    ) : (
                         <p className="text-sm text-muted-foreground">{t('complete_wealth_wheel')}</p>
                    )}
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
