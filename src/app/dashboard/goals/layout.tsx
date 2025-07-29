import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Goals Mapping - The Wealth Map',
};

export const viewport: Viewport = {
  themeColor: '#007C7C',
};

export default function GoalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
