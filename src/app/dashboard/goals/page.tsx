
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from "date-fns";
import { Calendar as CalendarIcon, Trash2, Target, Heart, Edit } from "lucide-react";

import type { Goal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from '@/components/ui/textarea';
import { cn } from "@/lib/utils";
import { useI18n, useCurrency } from '@/hooks/use-i18n';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function GoalsPage() {
  const { t } = useI18n();
  const { currency, formatCurrency } = useCurrency();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const goalSchema = useMemo(() => z.object({
    id: z.string().optional(),
    name: z.string().min(3, t('goal_name_error')),
    targetAmount: z.coerce.number().min(1, t('target_amount_error')),
    currentAmount: z.coerce.number().min(0).optional(),
    targetDate: z.date({
      required_error: t('target_date_error'),
    }),
    importance: z.string().min(10, t('importance_error')).optional(),
  }), [t]);

  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      targetDate: new Date(),
      importance: "",
    },
  });

  React.useEffect(() => {
    if (isDialogOpen) {
      if (editingGoal) {
        // When editing, parse the stored ISO string back into a Date object
        form.reset({
            ...editingGoal,
            targetDate: new Date(editingGoal.targetDate),
        });
      } else {
        form.reset({
            name: "",
            targetAmount: 0,
            currentAmount: 0,
            targetDate: new Date(), // Always default to a valid new date
            importance: "",
        });
      }
    }
  }, [isDialogOpen, editingGoal, form]);

  function onSubmit(values: z.infer<typeof goalSchema>) {
    if (editingGoal) {
        const updatedGoals = goals.map(g => g.id === editingGoal.id ? {
            ...g,
            ...values,
            targetDate: values.targetDate.toISOString(), // Save as ISO string
            currentAmount: values.currentAmount || 0,
            importance: values.importance || "",
        } : g);
        setGoals(updatedGoals);
    } else {
        const newGoal: Goal = {
          id: new Date().toISOString(),
          name: values.name,
          targetAmount: values.targetAmount,
          currentAmount: values.currentAmount || 0,
          targetDate: values.targetDate.toISOString(), // Save as ISO string
          importance: values.importance || "",
        };
        setGoals([...goals, newGoal]);
    }
    
    form.reset();
    setEditingGoal(null);
    setIsDialogOpen(false);
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };
  
  const handleOpenDialog = (goal: Goal | null = null) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  }
  
  const renderSkeletons = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-8 w-full" />
                </CardContent>
            </Card>
        ))}
    </div>
);


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">{t('goals_mapping')}</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>{t('add_new_goal')}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] grid-rows-[auto,1fr,auto] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{editingGoal ? t('edit_goal') : t('create_new_goal')}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="pr-4 -mr-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 pr-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>{t('goal_name')}</FormLabel><FormControl><Input placeholder={t('goal_name_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="targetAmount" render={({ field }) => (
                      <FormItem><FormLabel>{t('target_amount')} ({currency})</FormLabel><FormControl><Input type="number" placeholder="20000" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="currentAmount" render={({ field }) => (
                      <FormItem><FormLabel>{t('current_amount')} ({currency})</FormLabel><FormControl><Input type="number" placeholder="5000" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="targetDate" render={({ field }) => (
                      <FormItem className="flex flex-col"><FormLabel>{t('target_date')}</FormLabel>
                        <Popover modal={true} open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal hover:bg-primary/10 hover:text-primary", !field.value && "text-muted-foreground")}>
                                {field.value ? (format(new Date(field.value), "PPP")) : (<span>{t('pick_a_date')}</span>)}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-50" align="start">
                            <Calendar 
                                mode="single" 
                                selected={field.value} 
                                onSelect={(date) => {
                                    if (date) {
                                      field.onChange(date);
                                    }
                                    setIsCalendarOpen(false);
                                }}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="importance" render={({ field }) => (
                        <FormItem><FormLabel>{t('why_is_it_important')}</FormLabel><FormControl><Textarea placeholder={t('importance_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <DialogFooter className="pr-4 pt-4">
                      <Button type="submit">{editingGoal ? t('save_changes') : t('add_goal')}</Button>
                    </DialogFooter>
                  </form>
                </Form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {!isClient ? renderSkeletons() : goals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = (goal.targetAmount > 0) ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
            return (
              <Card key={goal.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Target className="h-6 w-6 text-primary" />
                        {goal.name}
                    </div>
                     <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(goal)}>
                            <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteGoal(goal.id)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('progress')}</p>
                    <p className="text-2xl font-bold">{formatCurrency(goal.currentAmount)} / <span className="text-lg font-medium text-muted-foreground">{formatCurrency(goal.targetAmount)}</span></p>
                  </div>
                  <Progress value={progress} />
                   {goal.importance && (
                    <div className="pt-2">
                        <p className="text-sm font-semibold flex items-center gap-2"><Heart className="h-4 w-4 text-pink-500" /> {t('my_motivation')}</p>
                        <p className="text-sm text-muted-foreground italic mt-1">"{goal.importance}"</p>
                    </div>
                   )}
                  <div>
                    <p className="text-sm text-muted-foreground">{t('target_date')}</p>
                    <p className="font-medium">{format(new Date(goal.targetDate), "PPP")}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
            <CardHeader>
                <CardTitle>{t('no_goals_yet')}</CardTitle>
                <CardDescription>{t('no_goals_yet_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => handleOpenDialog()} size="lg">{t('add_new_goal')}</Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
