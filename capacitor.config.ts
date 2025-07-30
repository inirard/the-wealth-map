import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wealthmap.app',
  appName: 'The Wealth Map',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    // Required for static site generation (SSG) with Next.js
    url: 'http://localhost:3000',
    cleartext: true
  }
};

export default config;
