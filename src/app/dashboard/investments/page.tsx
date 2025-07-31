
"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trash2, Edit, LineChart, PlusCircle, Download } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import type { Investment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18n } from '@/hooks/use-i18n';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import InvestmentsReport from './report';
import { useToast } from "@/hooks/use-toast";

export default function InvestmentsPage() {
  const { t } = useI18n();
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

  const handleDownloadPdf = async () => {
      const reportElement = reportRef.current;
      if (!reportElement) return;

      setIsDownloading(true);
      try {
          const a4Width = 794;
          reportElement.style.width = `${a4Width}px`;
          
          const canvas = await html2canvas(reportElement, {
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff',
              windowHeight: reportElement.scrollHeight,
              windowWidth: a4Width, 
          });

          reportElement.style.width = '';
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const ratio = canvasWidth / pdfWidth;
          const imgHeight = canvasHeight / ratio;
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;

          while (heightLeft > 0) {
              position -= pdfHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
              heightLeft -= pdfHeight;
          }
          
          pdf.save(`investments-report-${new Date().toISOString().split('T')[0]}.pdf`);
      } catch (error) {
          console.error("Error generating PDF:", error);
          toast({
              variant: "destructive",
              title: t('ai_error_title'),
              description: 'Failed to generate PDF report.',
          });
      } finally {
          setIsDownloading(false);
      }
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
                        <FormLabel>{t('investment_amount')}</FormLabel>
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
          <p className="text-3xl font-bold text-primary">€{isClient ? totalInvested.toFixed(2) : '0.00'}</p>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>{t('your_investments')}</CardTitle>
              <CardDescription>{t('your_investments_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>{t('name')}</TableHead>
                    <TableHead>{t('type')}</TableHead>
                    <TableHead>{t('quantity')}</TableHead>
                    <TableHead className="text-right">{t('amount')} (€)</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {isClient && investments.length > 0 ? (
                    investments.map(investment => (
                    <TableRow key={investment.id}>
                        <TableCell className="font-medium">{investment.name}</TableCell>
                        <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                {investmentTypes.find(i => i.value === investment.type)?.label || investment.type}
                            </span>
                        </TableCell>
                        <TableCell>{investment.quantity || 'N/A'}</TableCell>
                        <TableCell className="text-right font-semibold">€{investment.amount.toFixed(2)}</TableCell>
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
          </CardContent>
      </Card>

        <div className="fixed -left-[9999px] top-0">
            {isClient && (
                <InvestmentsReport 
                    ref={reportRef}
                    data={{
                        username,
                        investments,
                        totalInvested,
                        investmentTypes
                    }}
                />
            )}
        </div>
    </div>
  );
}

    