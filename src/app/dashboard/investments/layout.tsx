import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Investments - The Wealth Map',
};

export const viewport: Viewport = {
  themeColor: '#007C7C',
};

export default function InvestmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
