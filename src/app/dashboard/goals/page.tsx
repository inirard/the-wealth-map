"use client";

import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from "date-fns";
import { Calendar as CalendarIcon, Trash2, Target } from "lucide-react";

import type { Goal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const goalSchema = z.object({
  name: z.string().min(3, "Goal name must be at least 3 characters."),
  targetAmount: z.coerce.number().min(1, "Target amount must be greater than 0."),
  currentAmount: z.coerce.number().min(0).optional(),
  targetDate: z.date({
    required_error: "A target date is required.",
  }),
});

export default function GoalsPage() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      targetDate: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof goalSchema>) {
    const newGoal: Goal = {
      id: new Date().toISOString(),
      name: values.name,
      targetAmount: values.targetAmount,
      currentAmount: values.currentAmount || 0,
      targetDate: values.targetDate.toISOString(),
    };
    setGoals([...goals, newGoal]);
    form.reset();
    setIsDialogOpen(false);
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Goal Mapping</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Goal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Financial Goal</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Goal Name</FormLabel><FormControl><Input placeholder="e.g., Save for a house deposit" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="targetAmount" render={({ field }) => (
                  <FormItem><FormLabel>Target Amount ($)</FormLabel><FormControl><Input type="number" placeholder="20000" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="currentAmount" render={({ field }) => (
                  <FormItem><FormLabel>Current Amount ($)</FormLabel><FormControl><Input type="number" placeholder="5000" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="targetDate" render={({ field }) => (
                  <FormItem className="flex flex-col"><FormLabel>Target Date</FormLabel><Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                    </PopoverContent>
                  </Popover><FormMessage /></FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit">Add Goal</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <Card key={goal.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {goal.name}
                    <Button variant="ghost" size="icon" onClick={() => deleteGoal(goal.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="text-2xl font-bold">${goal.currentAmount.toLocaleString()} / <span className="text-lg font-medium text-muted-foreground">${goal.targetAmount.toLocaleString()}</span></p>
                  </div>
                  <Progress value={progress} />
                  <div>
                    <p className="text-sm text-muted-foreground">Target Date</p>
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
                <CardTitle>No goals yet!</CardTitle>
                <CardDescription>Start your journey by adding your first financial goal.</CardDescription>
            </CardHeader>
            <CardContent>
                <Target className="h-16 w-16 text-muted-foreground" />
            </CardContent>
        </Card>
      )}
    </div>
  );
}
