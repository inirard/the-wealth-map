
import type { Metadata, Viewport } from 'next';
import './globals.css';
import './print.css';
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from '@/hooks/use-i18n';
import { Poppins } from 'next/font/google';

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
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#007C7C',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt-PT" suppressHydrationWarning className={`${poppins.variable}`}>
       <head>
        {/* Explicit PWA tags for iOS reliability */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="The Wealth Map" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
       </head>
      <body>
        <I18nProvider>
          {children}
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
