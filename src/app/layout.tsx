import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/sonner';
import QueryProvider from '../provider/queryProvider';
import { AuthHydration } from '../provider/authHydration';

import './globals.css';

const sfPro = localFont({
  src: [
    {
      path: './fonts/SF-Pro-Display-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Display-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Display-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Display-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/SF-Pro-Display-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-sf-pro',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sociality',
  description: 'Connect and share with your community.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang='en' className={sfPro.variable}>
      <body>
        <AuthHydration>
          <QueryProvider>
            {children}
            <Toaster position='top-right' richColors />
          </QueryProvider>
        </AuthHydration>
      </body>
    </html>
  );
}
