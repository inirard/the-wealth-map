
import { CircleDollarSign, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

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

// Minimal Button component for layout usage
const Button = ({ asChild, ...props }: { asChild?: boolean, variant: 'outline', children: React.ReactNode, className?: string }) => {
  const Comp = asChild ? 'div' : 'button';
  return (
    <Comp
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-primary hover:text-primary-foreground h-10 px-4 py-2"
    >
      {props.children}
    </Comp>
  )
};
