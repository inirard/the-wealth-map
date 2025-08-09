
import type { Metadata, Viewport } from 'next';
import './globals.css';
import './print.css';
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from '@/hooks/use-i18n';
import { Poppins } from 'next/font/google';
import AppLifecycle from '@/components/app-lifecycle';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'The Wealth Map | Your Interactive Financial Planner',
  description: 'Navigate your journey to financial freedom. The Wealth Map is a modern, interactive digital planner to help you set goals, track expenses, and build wealth.',
  manifest: '/manifest.json',
  applicationName: "The Wealth Map",
  appleWebApp: {
    capable: true,
    title: "The Wealth Map",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/favicon.svg',
    shortcut: '/icons/favicon.svg',
    apple: [
        { url: '/icons/apple-icon-180.png' },
        { url: '/icons/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#007C7C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt-PT" suppressHydrationWarning className={`${poppins.variable}`}>
      <head>
        {/* This explicit link is a good fallback for older devices */}
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" sizes="180x180" />
      </head>
      <body>
        <I18nProvider>
          <AppLifecycle />
          {children}
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
