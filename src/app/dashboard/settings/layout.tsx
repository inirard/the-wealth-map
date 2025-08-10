import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Settings - The Wealth Map',
};

export const viewport: Viewport = {
  themeColor: '#007C7C',
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
