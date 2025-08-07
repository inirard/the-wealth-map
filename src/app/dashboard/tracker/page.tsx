
"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from "date-fns";
import { Calendar as CalendarIcon, Trash2, TrendingUp, TrendingDown, Wallet, Download } from "lucide-react";

import type { Transaction } from '@/lib/types';
import { exportToCsv } from '@/lib/csv';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useI18n, useCurrency } from '@/hooks/use-i18n';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function TrackerPage() {
  const { t } = useI18n();
  const { currency, formatCurrency } = useCurrency();

  const transactionSchema = useMemo(() => z.object({
    description: z.string().min(2, t('description_error')),
    amount: z.coerce.number().min(0.01, t('amount_error')),
    type: z.enum(["income", "expense"], { required_error: t('transaction_type_error') }),
    date: z.date({ required_error: t('date_error') }),
  }), [t]);

  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "expense",
      date: new Date(),
    },
    resetOptions: {
      keepValues: false,
    }
  });

  React.useEffect(() => {
    if (isDialogOpen) {
      form.reset({
          description: "",
          amount: 0,
          type: "expense",
          date: new Date() // Default to today for new transactions
      });
    }
  }, [isDialogOpen, form]);

  function onSubmit(values: z.infer<typeof transactionSchema>) {
    const newTransaction: Transaction = {
      id: new Date().toISOString(),
      ...values,
      date: values.date.toISOString(),
    };
    setTransactions([...transactions, newTransaction].sort((a, b) => safeParseDate(b.date).getTime() - safeParseDate(a.date).getTime()));
    form.reset();
    setIsDialogOpen(false);
  }

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };
  
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    return { totalIncome, totalExpenses, balance };
  }, [transactions]);
  
  const handleExport = useCallback(() => {
    const dataToExport = transactions.map(transaction => ({
        ...transaction, 
        date: format(safeParseDate(transaction.date), "yyyy-MM-dd"),
        type: transaction.type === 'income' ? t('income') : t('expense')
    }));
    exportToCsv(`wealth-map-tracker-${new Date().toISOString().split('T')[0]}.csv`, dataToExport);
  }, [transactions, t]);

  const renderSummaryCards = () => {
    if (!isClient) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[120px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('total_income')}</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold text-green-600">{formatCurrency(totalIncome)}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('total_expenses')}</CardTitle><TrendingDown className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold text-destructive">{formatCurrency(totalExpenses)}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t('balance')}</CardTitle><Wallet className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{formatCurrency(balance)}</div></CardContent></Card>
        </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">{t('monthly_tracker')}</h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} disabled={!isClient || transactions.length === 0} className="hover:bg-primary hover:text-primary-foreground">
                <Download className="mr-2 h-4 w-4" /> {t('export_csv')}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild><Button>{t('add_transaction')}</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{t('add_new_transaction')}</DialogTitle></DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem><FormLabel>{t('description')}</FormLabel><FormControl><Input placeholder={t('description_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="amount" render={({ field }) => (
                      <FormItem><FormLabel>{t('amount')} ({currency})</FormLabel><FormControl><Input type="number" step="0.01" placeholder="55.75" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="type" render={({ field }) => (
                      <FormItem className="space-y-3"><FormLabel>{t('type')}</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                          <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="income" /></FormControl><FormLabel className="font-normal">{t('income')}</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="expense" /></FormControl><FormLabel className="font-normal">{t('expense')}</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="date" render={({ field }) => (
                      <FormItem className="flex flex-col"><FormLabel>{t('date')}</FormLabel><Popover>
                        <PopoverTrigger asChild><FormControl>
                          <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal hover:bg-primary/10 hover:text-primary", !field.value && "text-muted-foreground")}>
                            {field.value ? (format(field.value, "PPP")) : (<span>{t('pick_a_date')}</span>)}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover><FormMessage /></FormItem>
                    )} />
                    <DialogFooter><Button type="submit">{t('add_transaction')}</Button></DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </div>
      </div>
      
      {renderSummaryCards()}

      <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('description')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead className="text-right">{t('amount')}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isClient && transactions.length > 0 ? (
                transactions.map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(safeParseDate(transaction.date), "PPP")}</TableCell>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>
                      <span className={cn("px-2 py-1 rounded-full text-xs", transaction.type === 'income' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300')}>
                        {transaction.type === 'income' ? t('income') : t('expense')}
                      </span>
                    </TableCell>
                    <TableCell className={cn("text-right font-semibold", transaction.type === 'income' ? 'text-green-600' : 'text-destructive')}>
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => deleteTransaction(transaction.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {isClient ? t('no_transactions_yet') : t('loading').concat('...')}
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </Card>
    </div>
  );
}

    