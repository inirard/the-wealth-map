
"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trash2, Edit, LineChart, PlusCircle, Download } from "lucide-react";

import type { Investment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18n, useCurrency } from '@/hooks/use-i18n';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import InvestmentsReport from './report';
import { useToast } from "@/hooks/use-toast";

export default function InvestmentsPage() {
  const { t } = useI18n();
  const { currency, formatCurrency } = useCurrency();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [username] = useLocalStorage<string>('username', 'User');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const investmentTypes = useMemo(() => [
    { value: 'stocks', label: t('stocks') },
    { value: 'etfs', label: t('etfs') },
    { value: 'crypto', label: t('crypto') },
    { value: 'funds', label: t('funds') },
    { value: 'savings', label: t('savings_account') },
    { value: 'bonds', label: t('bonds') },
  ], [t]);

  const investmentSchema = useMemo(() => z.object({
    id: z.string().optional(),
    name: z.string().min(2, t('investment_name_error')),
    type: z.string({ required_error: t('investment_type_error') }),
    amount: z.coerce.number().min(0.01, t('investment_amount_error')),
    quantity: z.coerce.number().optional(),
  }), [t]);

  const [investments, setInvestments] = useLocalStorage<Investment[]>('investments', []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

  const form = useForm<z.infer<typeof investmentSchema>>({
    resolver: zodResolver(investmentSchema),
  });

  useEffect(() => {
    if (isDialogOpen) {
      if (editingInvestment) {
        form.reset(editingInvestment);
      } else {
        form.reset({
          name: "",
          type: undefined,
          amount: 0,
          quantity: 0,
        });
      }
    }
  }, [isDialogOpen, editingInvestment, form]);

  function onSubmit(values: z.infer<typeof investmentSchema>) {
    if (editingInvestment) {
      const updatedInvestments = investments.map(i =>
        i.id === editingInvestment.id ? { ...i, ...values } : i
      );
      setInvestments(updatedInvestments);
    } else {
      const newInvestment: Investment = {
        id: new Date().toISOString(),
        ...values,
      };
      setInvestments([...investments, newInvestment]);
    }
    form.reset();
    setEditingInvestment(null);
    setIsDialogOpen(false);
  }

  const deleteInvestment = (id: string) => {
    setInvestments(investments.filter(i => i.id !== id));
  };

  const handleOpenDialog = (investment: Investment | null = null) => {
    setEditingInvestment(investment);
    setIsDialogOpen(true);
  };
  
  const totalInvested = useMemo(() => {
    return investments.reduce((acc, curr) => acc + curr.amount, 0);
  }, [investments]);

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    // Timeout to allow state to update and show loading state
    setTimeout(() => {
        window.print();
        setIsDownloading(false);
    }, 100);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">{t('investments')}</h1>
        <div className="flex items-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button onClick={handleDownloadPdf} disabled={!isClient || investments.length === 0 || isDownloading} variant="outline" size="icon">
                            <Download className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                       <p>{isDownloading ? t('downloading') : t('download_pdf')}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <PlusCircle className="mr-2" />
                  {t('add_investment')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingInvestment ? t('edit_investment') : t('add_new_investment')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('investment_name')}</FormLabel>
                        <FormControl><Input placeholder={t('investment_name_placeholder')} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="type" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('investment_type')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder={t('investment_type_placeholder')} /></SelectTrigger></FormControl>
                          <SelectContent>
                            {investmentTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="amount" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('investment_amount')} ({currency})</FormLabel>
                        <FormControl><Input type="number" step="0.01" placeholder="1000.00" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="quantity" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('investment_quantity')} <span className="text-muted-foreground">({t('optional')})</span></FormLabel>
                        <FormControl><Input type="number" step="any" placeholder="10" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <DialogFooter>
                      <Button type="submit">{editingInvestment ? t('save_changes') : t('add_investment')}</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </div>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle>{t('total_invested_capital')}</CardTitle>
          <CardDescription>{t('total_invested_capital_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary">{isClient ? formatCurrency(totalInvested) : '...'}</p>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>{t('your_investments')}</CardTitle>
              <CardDescription>{t('your_investments_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
             <div className="hidden md:block">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>{t('name')}</TableHead>
                            <TableHead>{t('type')}</TableHead>
                            <TableHead>{t('quantity')}</TableHead>
                            <TableHead className="text-right">{t('amount')} ({currency})</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {isClient && investments.length > 0 ? (
                            investments.map(investment => (
                            <TableRow key={investment.id}>
                                <TableCell className="font-medium">{investment.name}</TableCell>
                                <TableCell>
                                    <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary whitespace-nowrap">
                                        {investmentTypes.find(i => i.value === investment.type)?.label || investment.type}
                                    </span>
                                </TableCell>
                                <TableCell>{investment.quantity || 'N/A'}</TableCell>
                                <TableCell className="text-right font-semibold">{formatCurrency(investment.amount)}</TableCell>
                                <TableCell className="text-right">
                                     <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(investment)}>
                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => deleteInvestment(investment.id)}>
                                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                {isClient ? t('no_investments_yet') : t('loading').concat('...')}
                                </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
             </div>
             
             {/* Mobile Cards */}
             <div className="md:hidden space-y-4">
                {isClient && investments.length > 0 ? (
                    investments.map(investment => (
                        <Card key={investment.id} className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold">{investment.name}</p>
                                    <span className="mt-1 inline-block px-2 py-1 rounded-full text-xs bg-primary/10 text-primary whitespace-nowrap">
                                        {investmentTypes.find(i => i.value === investment.type)?.label || investment.type}
                                    </span>
                                </div>
                                <div>
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(investment)}>
                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => deleteInvestment(investment.id)}>
                                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-muted-foreground">{t('quantity')}</p>
                                    <p className="font-medium">{investment.quantity || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground text-right">{t('amount')} ({currency})</p>
                                    <p className="font-bold text-lg text-primary text-right">{formatCurrency(investment.amount)}</p>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-10">
                         {isClient ? t('no_investments_yet') : t('loading').concat('...')}
                    </div>
                )}
             </div>
          </CardContent>
      </Card>

        {isClient && (
            <div className="fixed -left-[9999px] top-0 print-only" aria-hidden="true">
                <InvestmentsReport 
                    ref={reportRef}
                    data={{
                        username,
                        investments,
                        totalInvested,
                        investmentTypes
                    }}
                />
            </div>
        )}
    </div>
  );
}
