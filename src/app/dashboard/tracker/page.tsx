"use client";

import React, { useState, useMemo } from 'react';
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

const transactionSchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  type: z.enum(["income", "expense"], { required_error: "You need to select a transaction type." }),
  date: z.date({ required_error: "A date is required." }),
});

export default function TrackerPage() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "expense",
    },
  });

  function onSubmit(values: z.infer<typeof transactionSchema>) {
    const newTransaction: Transaction = {
      id: new Date().toISOString(),
      ...values,
      date: values.date.toISOString(),
    };
    setTransactions([...transactions, newTransaction].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
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
  
  const handleExport = () => {
    exportToCsv(`wealth-map-tracker-${new Date().toISOString().split('T')[0]}.csv`, transactions);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Rastreador Mensal</h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} disabled={transactions.length === 0}>
                <Download className="mr-2 h-4 w-4" /> Exportar CSV
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild><Button>Adicionar Transação</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Adicionar Nova Transação</DialogTitle></DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem><FormLabel>Descrição</FormLabel><FormControl><Input placeholder="Ex: Compras de supermercado" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="amount" render={({ field }) => (
                      <FormItem><FormLabel>Valor (€)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="55.75" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="type" render={({ field }) => (
                      <FormItem className="space-y-3"><FormLabel>Tipo</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                          <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="income" /></FormControl><FormLabel className="font-normal">Rendimento</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="expense" /></FormControl><FormLabel className="font-normal">Despesa</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="date" render={({ field }) => (
                      <FormItem className="flex flex-col"><FormLabel>Data</FormLabel><Popover>
                        <PopoverTrigger asChild><FormControl>
                          <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? (format(field.value, "PPP")) : (<span>Escolha uma data</span>)}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover><FormMessage /></FormItem>
                    )} />
                    <DialogFooter><Button type="submit">Adicionar Transação</Button></DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Rendimento Total</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">€{totalIncome.toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Despesas Totais</CardTitle><TrendingDown className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">€{totalExpenses.toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Saldo</CardTitle><Wallet className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">€{balance.toFixed(2)}</div></CardContent></Card>
      </div>
      
      <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map(t => (
                  <TableRow key={t.id}>
                    <TableCell>{format(new Date(t.date), "PPP")}</TableCell>
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell>
                      <span className={cn("px-2 py-1 rounded-full text-xs", t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                        {t.type === 'income' ? 'Rendimento' : 'Despesa'}
                      </span>
                    </TableCell>
                    <TableCell className={cn("text-right", t.type === 'income' ? 'text-green-600' : 'text-red-600')}>
                      €{t.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => deleteTransaction(t.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">Ainda não há transações.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </Card>
    </div>
  );
}
