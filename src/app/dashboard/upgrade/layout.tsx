import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Upgrade to PRO - The Wealth Map',
};

export const viewport: Viewport = {
  themeColor: '#007C7C',
};

export default function UpgradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
