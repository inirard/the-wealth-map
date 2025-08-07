
import type { Metadata, Viewport } from 'next';
import './globals.css';
import './print.css';
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from '@/hooks/use-i18n';
import { Poppins } from 'next/font/google';
import ServiceWorkerRegistrar from '@/components/service-worker-registrar';

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
      { url: '/icons/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
       { rel: 'icon', type: 'image/png', sizes: '192x192', url: '/icons/icon-192x192.png' },
       { rel: 'icon', type: 'image/png', sizes: '512x512', url: '/icons/icon-512x512.png' },
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
      <head>
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#007C7C" />
        <meta name="application-name" content="The Wealth Map" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* iOS PWA - Tags explícitas para máxima compatibilidade */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="The Wealth Map" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Adicionando a tag apple-touch-icon diretamente para máxima compatibilidade com iOS */}
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
        
        {/* Fallback icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <I18nProvider>
          <ServiceWorkerRegistrar />
          {children}
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
