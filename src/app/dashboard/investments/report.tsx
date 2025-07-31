
"use client"

import React, { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CircleDollarSign, LineChart } from 'lucide-react';
import { format } from "date-fns";
import { useI18n } from '@/hooks/use-i18n';
import { cn } from "@/lib/utils";
import type { Investment } from '@/lib/types';

interface ReportData {
    username: string;
    investments: Investment[];
    totalInvested: number;
    investmentTypes: { value: string; label: string }[];
}

interface InvestmentsReportProps {
    data: ReportData;
}

const InvestmentsReport = forwardRef<HTMLDivElement, InvestmentsReportProps>(({ data }, ref) => {
    const { t } = useI18n();
    const { username, investments, totalInvested, investmentTypes } = data;

    const sectionStyle = {
        breakInside: 'avoid',
    } as React.CSSProperties;

    return (
        <div ref={ref} className="p-8 font-body bg-white text-gray-800">
            <header className="flex items-center justify-between pb-4 border-b-2 border-primary mb-8">
                <div className="flex items-center gap-3">
                    <LineChart className="h-10 w-10 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold font-headline text-gray-800">{t('investments_report_title')}</h1>
                        <p className="text-gray-500">{t('financial_report_subtitle', { name: username })}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-semibold">{t('report_date')}</p>
                    <p className="text-gray-600">{format(new Date(), "PPP")}</p>
                </div>
            </header>

            <main className="space-y-12">
                <section style={sectionStyle}>
                    <Card className="text-center shadow-md">
                        <CardHeader><CardTitle className="text-lg">{t('total_invested_capital')}</CardTitle></CardHeader>
                        <CardContent><p className="text-4xl font-bold text-primary">€{totalInvested.toFixed(2)}</p></CardContent>
                    </Card>
                </section>

                {investments.length > 0 && (
                    <section style={sectionStyle}>
                        <h2 className="text-2xl font-bold font-headline mb-4 text-gray-800">{t('investments_detail')}</h2>
                        <Card className="shadow-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('name')}</TableHead>
                                        <TableHead>{t('type')}</TableHead>
                                        <TableHead>{t('quantity')}</TableHead>
                                        <TableHead className="text-right">{t('amount')} (€)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {investments.map(investment => (
                                        <TableRow key={investment.id}>
                                            <TableCell className="font-medium">{investment.name}</TableCell>
                                            <TableCell>{investmentTypes.find(i => i.value === investment.type)?.label || investment.type}</TableCell>
                                            <TableCell>{investment.quantity || 'N/A'}</TableCell>
                                            <TableCell className="text-right font-semibold">€{investment.amount.toFixed(2)}</TableCell>
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

InvestmentsReport.displayName = 'InvestmentsReport';
export default InvestmentsReport;

    