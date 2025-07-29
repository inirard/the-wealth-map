"use client";

import { Button } from "@/components/ui/button";
import { CircleDollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CoverPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
      <div className="pointer-events-none absolute inset-0 z-0" style={{
        backgroundImage: `
          radial-gradient(circle at 10% 20%, hsl(var(--primary) / 0.1) 0, transparent 25%),
          radial-gradient(circle at 80% 90%, hsl(var(--accent) / 0.1) 0, transparent 25%)
        `
      }}></div>

      <main className="relative z-10 flex flex-col items-center justify-center text-center p-4">
        <div className="mb-8 animate-pulse-slow">
          <CircleDollarSign className="h-24 w-24 text-primary drop-shadow-lg" />
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-primary">
          The Wealth Map
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-foreground/80">
          Seu planejador digital interativo para navegar na jornada para a liberdade financeira.
        </p>
        <Link href="/dashboard" passHref>
          <Button size="lg" className="mt-10 group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform transform hover:scale-105">
            Comece Sua Jornada
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </main>
    </div>
  );
}
