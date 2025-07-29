"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Target, Donut, ListChecks, BookOpen, Quote, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLocalStorage } from "@/hooks/use-local-storage";

const featureCards = [
  {
    title: "Goal Mapping",
    description: "Define your financial destination. Set clear, actionable goals for your future.",
    icon: Target,
    href: "/dashboard/goals",
    color: "text-blue-500",
  },
  {
    title: "Wealth Wheel",
    description: "Assess your financial well-being across key areas for a balanced perspective.",
    icon: Donut,
    href: "/dashboard/wealth-wheel",
    color: "text-purple-500",
  },
  {
    title: "Monthly Tracker",
    description: "Monitor your cash flow. Track every dollar to build a stronger financial foundation.",
    icon: ListChecks,
    href: "/dashboard/tracker",
    color: "text-green-500",
  },
  {
    title: "Reflection",
    description: "Align your mindset with your goals. Reflect on your journey and stay motivated.",
    icon: BookOpen,
    href: "/dashboard/reflection",
    color: "text-orange-500",
  },
   {
    title: "Affirmations",
    description: "Cultivate a positive money mindset with daily inspiration and affirmations.",
    icon: Quote,
    href: "/dashboard/quotes",
    color: "text-yellow-500",
  },
];

export default function DashboardPage() {
  const [name] = useLocalStorage('username', 'Explorer');

  return (
    <div className="flex flex-col gap-8">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-10 flex flex-col justify-center">
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">Bem-vindo(a), {name}!</h1>
                <p className="mt-2 text-lg text-foreground/80">
                    Este é o seu espaço pessoal para planear, acompanhar e alcançar os seus sonhos financeiros. Vamos começar a construir o seu futuro, um passo de cada vez.
                </p>
                <div className="mt-6">
                    <Link href="/dashboard/goals">
                        <Button size="lg" className="group">
                            Defina a Sua Primeira Meta <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="relative h-60 md:h-auto">
                 <Image
                    src="https://placehold.co/600x400.png"
                    alt="Financial planning illustration"
                    layout="fill"
                    objectFit="cover"
                    className="brightness-90"
                    data-ai-hint="financial planning"
                />
            </div>
        </div>
      </Card>
      
      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">O Seu Kit de Ferramentas Financeiras</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader className="flex-row items-center gap-4">
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                <div>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href={feature.href}>
                  <Button variant="outline" className="w-full">
                    Abrir
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
