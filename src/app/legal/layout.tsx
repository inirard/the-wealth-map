
import { CircleDollarSign, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Legal - The Wealth Map',
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <CircleDollarSign className="h-7 w-7" />
            <span className="font-semibold text-lg">The Wealth Map</span>
          </Link>
          <Button asChild variant="outline">
            <Link href="/dashboard" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to App
            </Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        <div className="prose prose-lg prose-p:text-foreground/80 prose-headings:text-foreground prose-strong:text-foreground bg-card p-8 rounded-xl shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}
