
"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, Zap, Activity } from 'lucide-react';
import type { Goal, Transaction, WealthWheelData } from '@/lib/types';
import { useI18n, useCurrency } from '@/hooks/use-i18n';
import { cn } from '@/lib/utils';

interface MonthlySummaryProps {
  goals: Goal[];
  transactions: Transaction[];
  wheelData: WealthWheelData[];
}

// Helper function to safely parse dates on all browsers, especially Safari
const safeParseDate = (dateString: string) => {
    if (!dateString) return new Date();
    // Usa Date.parse de forma robusta e cross-browser
    const parts = dateString.split('T')[0].split('-'); // YYYY-MM-DD
    if (parts.length !== 3) return new Date(); // Retorna data atual se o formato for inesperado
    const [year, month, day] = parts.map(Number);
    // Validação simples dos números
    if (isNaN(year) || isNaN(month) || isNaN(day)) return new Date();
    return new Date(year, month - 1, day); // Mês no construtor de Date é 0-indexed
};


export default function MonthlySummary({ goals, transactions, wheelData }: MonthlySummaryProps) {
  const { t } = useI18n();
  const { formatCurrency } = useCurrency();

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
    const incompleteGoals = goals
      .filter(g => g.currentAmount < g.targetAmount)
      .sort((a, b) => {
          const dateA = safeParseDate(a.targetDate).getTime();
          const dateB = safeParseDate(b.targetDate).getTime();
          return dateA - dateB;
      });

    const closestGoal = incompleteGoals[0] || [...goals].sort((a, b) => {
         const dateA = safeParseDate(a.targetDate).getTime();
         const dateB = safeParseDate(b.targetDate).getTime();
         return dateB - dateA;
    })[0];
    
    let goalProgress = 0;
    if (closestGoal && closestGoal.targetAmount > 0) {
        goalProgress = (closestGoal.currentAmount / closestGoal.targetAmount) * 100;
    }
    
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
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-emphasis" />
                {t('monthly_summary')}
            </CardTitle>
            <CardDescription>{t('monthly_summary_desc')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
            <Card className="flex flex-col">
                <CardHeader className="flex-grow">
                    <div className="flex items-center gap-2">
                        {summary.balance >= 0 ? 
                            <TrendingUp className="h-6 w-6 text-green-600 flex-shrink-0" /> : 
                            <TrendingDown className="h-6 w-6 text-destructive flex-shrink-0" />
                        }
                        <CardTitle className="text-base font-semibold">{t('your_balance_this_month')}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className={cn("text-2xl font-bold", summary.balance >= 0 ? 'text-green-600' : 'text-destructive')}>
                        {formatCurrency(summary.balance)}
                    </p>
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                 <CardHeader className="flex-grow">
                    <div className="flex items-start gap-2">
                        <Target className="h-6 w-6 text-primary flex-shrink-0" />
                        <div>
                            <CardTitle className="text-base font-semibold">{t('next_goal_focus')}</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {summary.closestGoal ? (
                        summary.goalProgress >= 100 ? (
                            <p className="text-sm text-muted-foreground">
                                {t('goal_completed', { goalName: summary.closestGoal.name })}
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {t('next_goal_desc', { 
                                    goalName: summary.closestGoal.name, 
                                    progress: Math.round(summary.goalProgress) 
                                })}
                            </p>
                        )
                    ) : (
                        <p className="text-sm text-muted-foreground">{t('no_upcoming_goals')}</p>
                    )}
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                 <CardHeader className="flex-grow">
                    <div className="flex items-start gap-2">
                        <Activity className="h-6 w-6 text-accent flex-shrink-0" />
                         <div>
                            <CardTitle className="text-base font-semibold">{t('focus_area_title')}</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                     {summary.lowestWheelArea ? (
                        <p className="text-sm text-muted-foreground">
                           {t('focus_area_desc', { area: t(summary.lowestWheelArea.id) })}
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

    