
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
  icons: {
    icon: '/icon.svg',
    shortcut: '/favicon.ico',
    apple: [
      { url: '/icons/apple-icon-180.png' },
      { url: '/icons/apple-icon-152.png', sizes: '152x152' },
      { url: '/icons/apple-icon-167.png', sizes: '167x167' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#007C7C' }
    ]
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
      <head />
      <body>
        <I18nProvider>
          {children}
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
