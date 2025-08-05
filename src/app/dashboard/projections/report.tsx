
"use client"

import React, { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Sparkles, TrendingUp, Target, AlertCircle, FlaskConical, Lightbulb, CircleDollarSign } from 'lucide-react';
import { format } from "date-fns";
import { useI18n } from '@/hooks/use-i18n';
import type { PredictiveInsightsOutput } from '@/lib/ai-types';

interface ReportData {
    username: string;
    aiPredictions: PredictiveInsightsOutput | null;
}

interface ProjectionsReportProps {
    data: ReportData;
}

const ProjectionsReport = forwardRef<HTMLDivElement, ProjectionsReportProps>(({ data }, ref) => {
    const { t } = useI18n();
    const { username, aiPredictions } = data;

    if (!aiPredictions) {
        return null;
    }

    const sectionStyle = {
        breakInside: 'avoid',
        paddingTop: '1rem',
    } as React.CSSProperties;

    return (
        <div ref={ref} className="p-8 font-body bg-white text-gray-800">
            {/* Report Header */}
            <header className="flex items-center justify-between pb-4 border-b-2 border-primary mb-6">
                <div className="flex items-center gap-3">
                    <CircleDollarSign className="h-10 w-10 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold font-headline text-gray-800">{t('ai_projections_title')}</h1>
                        <p className="text-gray-500">{t('financial_report_subtitle', { name: username })}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-semibold">{t('report_date')}</p>
                    <p className="text-gray-600">{format(new Date(), "PPP")}</p>
                </div>
            </header>

            <main>
                <div className="space-y-6">
                    <div style={sectionStyle}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-lg"><TrendingUp className="text-primary"/>{t('future_balance_prediction')}</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-gray-700">{aiPredictions.futureBalancePrediction}</p></CardContent>
                        </Card>
                    </div>

                    <div style={sectionStyle}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-lg"><AlertCircle className="text-primary"/>{t('proactive_alerts')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                    {aiPredictions.proactiveAlerts.map((alert, i) => <li key={i}>{alert}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    <div style={sectionStyle}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-lg"><FlaskConical className="text-primary"/>{t('spending_pattern_analysis')}</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-gray-700">{aiPredictions.spendingAnalysis}</p></CardContent>
                        </Card>
                    </div>

                    {aiPredictions.goalProjections.length > 0 && (
                         <div style={sectionStyle}>
                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-lg"><Target className="text-primary"/>{t('goal_projections')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                        {aiPredictions.goalProjections.map((p, i) => <li key={i}><b>{p.goalName}:</b> {p.projection}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>
                         </div>
                    )}

                    <div style={sectionStyle}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-lg"><Lightbulb className="text-primary"/>{t('what_if_scenario')}</CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-gray-700">{aiPredictions.whatIfScenario}</p></CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
});

ProjectionsReport.displayName = 'ProjectionsReport';
export default ProjectionsReport;
